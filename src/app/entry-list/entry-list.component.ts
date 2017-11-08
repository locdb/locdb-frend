import { Component, SimpleChanges, OnInit, OnChanges, Input, EventEmitter, Output } from '@angular/core';
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
  // first argument : true makes event emitter async
  // necessary to avoid ChangeDetection errors
  @Output() entry: EventEmitter<BibliographicEntry> = new EventEmitter(true);


  constructor() {
  }

  ngOnInit() {
    console.log('ngOnInit in entry-list');
  }

  ngOnChanges(changes: SimpleChanges | any) {
    console.log('ngOnChanges in entry-list');
    if (!this.entries || !this.entries.length) { return; }
    setTimeout(() => {
      this.selectedEntry = this.entries.find(e => !e.references);
      this.entry.emit(this.selectedEntry);
      console.log('first unlinked entry emitted', this.selectedEntry)
    });
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
    this.entry.emit(entry)
  }

}
