import { Component, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { BibliographicEntry, Identifier} from '../locdb';
import { SimpleChanges } from '@angular/core';
import { LocdbService } from '../locdb.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})

export class EntryFormComponent implements OnChanges {
  @Input() entry: BibliographicEntry;
  @Input() active: false;
  entryForm: FormGroup;
  submitted = true;

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
      title: this.entry.ocrData.title,
      references: this.entry.references,
      date: this.entry.ocrData.date,
      bibliographicEntryText: this.entry.bibliographicEntryText,
      // not reflected yet TODO FIXME
      marker: this.entry.ocrData.marker,
      comments: this.entry.ocrData.comments,
      journal: this.entry.ocrData.journal,
      volume: this.entry.ocrData.volume,
    });
    this.setAuthors(this.entry.ocrData.authors);
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

  removeAuthor(idx: number) {
    this.authors.removeAt(idx);
  }

  showForm(val: boolean) {
      // Display the form or stop displaying it
      this.submitted = !val;
  }

  onSubmit() {
    this.entry = this.prepareSaveEntry();
    console.log('Submitting entry', this.entry);

    this.locdbService.putBibliographicEntry(this.entry).subscribe(
      (result) => console.log('Submitted Entry with result', result)
    );
    this.submitted = true;
    this.ngOnChanges();
  }

  prepareSaveEntry(): BibliographicEntry {
    const formModel = this.entryForm.value;
    // deep copy of form model lairs
    // const authorsDeepCopy: string[] = formModel.authors.map(
    //   (author: string) => Object.assign({}, author)
    // );
    // const authorsDeepCopy = Object.create(formModel.authors);
    const authorsDeepCopy = this.copyArray<string>(formModel.authors);
    // return new `BibliographicEntry` object containing a combination of original entry value(s)
    // and deep copies of changed form model values
    const saveEntry: BibliographicEntry = {
      _id: this.entry._id,
      bibliographicEntryText: formModel.bibliographicEntryText as string || '',
      references: formModel.references as string || '',
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
    const copy = []
    for (const elem of array) {
      copy.push(elem);
    }
    return copy;
  }

  revert() { this.ngOnChanges(); }

  short() {
    if (!this.entry) { return 'Loading'; }
    if (this.entry.ocrData.title) {
      return this.entry.ocrData.title;
    } else {
      return this.entry.bibliographicEntryText;
    }
  }

}
