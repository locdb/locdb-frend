import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { ToDo, ToDoParts, ToDoScans, BibliographicEntry } from '../locdb';
import { LocdbService } from '../locdb.service';

// Display component consists of file upload, todo item selection and actual
// display of the scan

@Component({
  moduleId: module.id,
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
  providers: [ LocdbService ]
})

export class DisplayComponent implements OnInit {
  displaySource: string;
  displayActive: boolean = false;
  title: string = 'Display';
  currentIndex: number = 0;
  entries: BibliographicEntry[];
  @Output() entry: EventEmitter<BibliographicEntry> = new EventEmitter();

  constructor( private locdbService: LocdbService) { }

  updateDisplay(newTodo: ToDoScans) {
    // this method is called when a todo item is selected
    console.log(newTodo);
    this.displaySource = this.locdbService.getScan(newTodo._id);
    this.displayActive = true;
    this.locdbService.getToDoBibliographicEntries(newTodo._id)
      .subscribe( (res) => this.entriesArrived(res) ) ;
  }

  entriesArrived(entries) {
    this.entries = entries;
    this.currentIndex = 0;
    this.entry.next(entries[0]);
  }

  onSelect(entry: any) {
    // selection of an entry of one todo item
    this.entry.next(entry);
  }

  newCustomEntry() {
    this.entry.next(new BibliographicEntry());
  }

  next(diff: number) {
    this.currentIndex = Math.abs((this.entries.length + this.currentIndex + diff) % this.entries.length);
    let entry = this.entries[this.currentIndex];
    console.log('Emission of entry at index ' + this.currentIndex, entry);
    this.entry.next(this.entries[this.currentIndex]);
  }

  ngOnInit() {

  }

  clear() {
    this.displaySource = null;
    this.displayActive = false;
    console.log('Emission of null to clear');
    this.entry.next(null); // reset view
  }

}
