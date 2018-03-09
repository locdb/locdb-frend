import { Component, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { BibliographicEntry, Identifier, TypedResourceView} from '../locdb';
import { SimpleChanges } from '@angular/core';
import { LocdbService } from '../locdb.service';
@Component({
  selector: 'app-entry-card-group',
  templateUrl: './entry-card-group.component.html',
  styleUrls: ['./entry-card-group.component.css'],
})

export class EntryCardGroupComponent implements OnChanges {




    @Input() resource: TypedResourceView;
    @Input() entry: BibliographicEntry;
    @Input() active: false;
    entryForm: FormGroup;
    submitted = false;
    disabled = true;
    open = false;
    @Output() state: EventEmitter<BibliographicEntry> = new EventEmitter()



    constructor(
      private fb: FormBuilder,
      private locdbService: LocdbService) { this.createForm(); }

    createForm() {
      this.entryForm = this.fb.group({
        bibliographicEntryText: '',
        references: '',
        title: '',
        date: '',
        authors: this.fb.array([]),
        identifiers: this.fb.array([]),
        marker: '',
        comments: '',
        journal: '',
        volume: '',
      }
      )
    }

    ngOnChanges() {

      if (!this.entry) {
        return;
      }
      this.entryForm.reset({
        bibliographicEntryText: this.entry.bibliographicEntryText,
        references: this.entry.references,
        title: this.entry.ocrData.title,
        date: this.entry.ocrData.date,
        // not reflected yet TODO FIXME
        marker: this.entry.ocrData.marker,
        comments: this.entry.ocrData.comments,
        journal: this.entry.ocrData.journal,
        volume: this.entry.ocrData.volume,
      });
      this.setAuthors(this.entry.ocrData.authors);
      this.setIdentifiers(this.entry.identifiers);
      this.open = false;
    }

    setAuthors(authors: string[]) {
      const authorFGs = authors.map(author => this.fb.control(author));
      const authorFormArray = this.fb.array(authorFGs);
      // const authorFormArray = this.fb.array(authors);
      this.entryForm.setControl('authors', authorFormArray);
    }

    get authors(): FormArray {
      return this.entryForm.get('authors') as FormArray;
    };

    addAuthor() {
      this.authors.push(this.fb.control(''));
    }

    clearReference() {
      // for the future
      this.entryForm.setValue({references: ''});
    }

    removeAuthor(idx: number) {
      this.authors.removeAt(idx);
    }

    showForm(val: boolean) {
        // Display the form or stop displaying it
        this.submitted = !val;
    }
    setIdentifiers(ids: Identifier[]) {
      const identsFGs = ids ? ids.map(
        identifier => this.fb.group(
          {literalValue: identifier.literalValue,
            scheme: identifier.scheme }
        )
      ) : [];
      const idsFormArray = this.fb.array(identsFGs);
      this.entryForm.setControl('identifiers', idsFormArray);
    }

    get identifiers(): FormArray {
      return this.entryForm.get('identifiers') as FormArray;
    }

    addIdentifier() {
      // reference from getter above
      this.identifiers.push(this.fb.group({scheme: '', literalValue: ''}));
    }

    removeIdentifier(index: number) {
      this.identifiers.removeAt(index);
    }

    onSubmit() {
      const entry = this.prepareSaveEntry();
      console.log('Submitting entry', this.entry);

      if (entry._id) {
        this.locdbService.updateBibliographicEntry(entry).subscribe(
          (result) => { this.entry = result; this.toggleOpen(); this.ngOnChanges()},
          (error) => console.log('Error updating entry', error)
        );
      } else {
        this.locdbService.createBibliographicEntry(this.resource._id, entry).subscribe(
          (result) => { this.entry = result; this.toggleOpen(); this.ngOnChanges()},
          (error) => console.log('Error creating entry', error)
        )

      }
    }
    reconstructIdentifier(scheme: string, value: string): Identifier {
      const identifier = {
        scheme: scheme,
        literalValue: value,
      }
      return identifier;
    }

    prepareSaveEntry(): BibliographicEntry {
      const formModel = this.entryForm.value;
      // deep copy of form model lairs
      // const authorsDeepCopy: string[] = formModel.authors.map(
      //   (author: string) => Object.assign({}, author)
      // const authorsDeepCopy = Object.create(formModel.authors);
      // const authorsDeepCopy = this.copyArray<string>(formModel.authors);
      // return new `BibliographicEntry` object containing a combination of original entry value(s)
      // and deep copies of changed form model values
      const authorsDeepCopy = formModel.authors.map( x => x);
      const identsDeepCopy = formModel.identifiers.map(
        (id: {scheme: string, literalValue: string} ) => this.reconstructIdentifier(id.scheme, id.literalValue)
      ).filter(i => i.scheme && i.literalValue); // sanity check
      const saveEntry: BibliographicEntry = {
        _id: this.entry._id,
        bibliographicEntryText: formModel.bibliographicEntryText as string || '',
        references: formModel.references as string || '',
        identifiers: identsDeepCopy || [],
        ocrData: {
          title: formModel.title as string || '',
          date: formModel.date as string || '',
          authors: authorsDeepCopy || [],
          marker: formModel.marker as string || '',
          comments: formModel.comments as string || '',
          journal: formModel.journal as string || '',
          volume: formModel.volume as string || '',
        },
        status: 'VALID' // validated
      };
      return saveEntry;
    }

    copyArray<T>(array: T[]): T[] {
      // not really deep
      const copy = []
      for (const elem of array) {
        copy.push(elem);
      }
      return copy;
    }

    revert() { this.ngOnChanges(); }

    delete(entry) {
      if (confirm('Are you sure to delete resource ' + entry._id)) {
           this.locdbService.deleteBibliographicEntry(entry).subscribe(
              (res) => {console.log('Deleted'); this.entry = null;},
              (err) => {alert("Error deleting resource " + entry._id); console.log("Error", err)}
          );
      }
     }

    short() {
      // TODO
      // this is so complicated it could be an own component
      if (!this.entry) { return 'Loading...'; }

      const elements: string[] = [];
      if (this.entry.ocrData.authors && this.entry.ocrData.authors.length) {
        const authorsString = this.entry.ocrData.authors.join('; ')
        if (authorsString) {
          elements.push(`${authorsString}`)
        }
      }

      if (this.entry.ocrData.date) {
        elements.push(`${this.entry.ocrData.date}`);
      }

      if (this.entry.ocrData.title) {
        elements.push(this.entry.ocrData.title);
      }

      if (this.entry.ocrData.journal) {
        elements.push(`In: ${this.entry.ocrData.journal} ${this.entry.ocrData.volume}`);
      }

      if (this.entry.identifiers && this.entry.identifiers.length) {
        const istring = this.entry.identifiers.filter(ident => ident.literalValue)
          .map(
          (ident) => `${ident.scheme}: ${ident.literalValue}`
        ).join('; ');
        if (istring) {
          // could be empty because of missing literal Values
          elements.push(`${istring}`);
        }
      }


      if (!elements.length) {
        // no structured meta data at all, use raw text if present
        return this.entry.bibliographicEntryText;
      } else {
        return elements.join('. ');
      }
    }

        toggleOpen(){
          this.open = !this.open
        }

  }
