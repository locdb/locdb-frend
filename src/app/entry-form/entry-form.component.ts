import { Component, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { BibliographicEntry, Identifier} from '../locdb';
import { LocdbService } from '../locdb.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})

export class EntryFormComponent implements OnChanges {
  @Input() entry: BibliographicEntry;
  entryForm: FormGroup;

  @Output() state: EventEmitter<BibliographicEntry> = new EventEmitter()



  constructor(
    private fb: FormBuilder,
    private locdbService: LocdbService) { this.createForm(); }

  createForm() {
    this.entryForm = this.fb.group({
      bibliographicEntryText: '',
      // addresses: formModel.secretLairs // <-- bad!
      references: '',
      title: '',
      date: '',
      authors: this.fb.array([]),
    }
    )
  }

  ngOnChanges() {
    if (!this.entryForm || !this.entry) 
      return;
    this.entryForm.reset({
      title: this.entry.ocrData.title,
      references: this.entry.references,
      date: this.entry.ocrData.date,
      bibliographicEntryText: this.entry.bibliographicEntryText,
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

  addAuthor(){
    this.authors.push(this.fb.control(""));
  }

  removeAuthor(idx: number) {
    let authors: string[] = this.authors.value;
    authors.splice(idx, 1);
    this.setAuthors(authors);
  }

  onSubmit() {
    this.entry = this.prepareSaveEntry();
    console.log("Submitting entry", this.entry);

    this.locdbService.putBibliographicEntry(this.entry).subscribe(
      (result) => console.log("Submitted Entry with result", result)
    );
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
      bibliographicEntryText: formModel.bibliographicEntryText as string || "",
      references: formModel.references as string || "",
      ocrData: {
        title: formModel.title as string || "",
        date: formModel.date as string || "",
        authors: authorsDeepCopy || [],
        },
      status: "VALID" // validated
    };
    return saveEntry;
  }

  copyArray<T>(array: T[]): T[] {
    let copy = []
    for (let elem of array) {
      copy.push(elem);
    }
    return copy;
  }

  revert() { this.ngOnChanges(); }

  output() {
    const formModel = this.entryForm.value;
    let authorsDeepCopy = this.copyArray<string>(formModel.authors);
    // copy from original entry
    const current : BibliographicEntry = {
      _id: this.entry._id || "",
      scanId: this.entry.scanId || "",
      status: this.entry.status || "",
      bibliographicEntryText: formModel.bibliographicEntryText as string || "",
      references: formModel.references as string || "",
      ocrData: {
        coordinates: this.entry.ocrData.coordinates || "",
        title: formModel.title as string || "",
        date: formModel.date as string || "",
        // might be also a form variable
        marker: this.entry.ocrData.marker || "",
        authors: authorsDeepCopy as string[] || []
      }
    };
    console.log("output", current);
    this.state.next(current);
  }

}
