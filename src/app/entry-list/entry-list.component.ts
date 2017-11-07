import { Component, OnInit, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { BibliographicEntry } from '../locdb'
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['../locdb.css', './entry-list.component.css']
})

export class EntryListComponent implements OnInit, OnChanges {

  @Input() entries: BibliographicEntry[];
  selectedEntry: BibliographicEntry;
  @Output() entry: EventEmitter<BibliographicEntry> = new EventEmitter();


  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!this.entries) { return; }
    this.selectedEntry = this.entries.find(e => !e.references);
    this.entry.next(this.selectedEntry);
  }

  addEntry() {
    const entry = new BibliographicEntry();
    this.onSelect(entry);
  }

  deleteEntry() {

  }

  onSelect(entry: BibliographicEntry) {
    this.selectedEntry = entry;
    console.log('entry emitted', entry)
    this.entry.next(entry)
  }

}
