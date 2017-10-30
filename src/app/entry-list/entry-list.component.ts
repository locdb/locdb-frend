import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BibliographicEntry } from '../locdb'

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})

export class EntryListComponent implements OnInit {

  @Input() entries: BibliographicEntry;
  selectedEntry: BibliographicEntry;
  @Output() entry: EventEmitter<BibliographicEntry> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSelect(entry: BibliographicEntry) {
    this.selectedEntry = entry;
    console.log('entry emitted', entry)
    this.entry.next(entry)
  }

}
