import { Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { ToDoScans, BibliographicEntry } from '../locdb';
import { LocdbService } from '../locdb.service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent implements OnInit, OnChanges {
  scanIsVisible = false;
  @Input() todo: ToDoScans;
  entries: BibliographicEntry[];
  @Output() entry: EventEmitter<BibliographicEntry> = new EventEmitter();
  @Output() goBack: EventEmitter<null> = new EventEmitter();


  constructor( private locdbService: LocdbService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    // fetch entries for todo item (cold observable, call in template with async)
    this.locdbService.getToDoBibliographicEntries(this.todo._id).subscribe(
      (result) => this.entries = result
    );
  }


  showScan() {
    this.scanIsVisible = true;
  }

  hideScan() {
    this.scanIsVisible = false;
  }

  back() {
    this.todo = null;
    this.entry.next(null);
    this.goBack.next(null);
  }

  forwardEntry(entry: BibliographicEntry) {
    this.entry.next(entry);
  }

}
