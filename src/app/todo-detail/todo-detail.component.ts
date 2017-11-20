import { Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { ToDo, ToDoScans, BibliographicEntry, BibliographicResource } from '../locdb';
import { LocdbService } from '../locdb.service';
import {Observable} from 'rxjs/Rx';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent implements OnInit, OnChanges {
  scanIsVisible = false;
  @Input() todo: ToDoScans | ToDo;
  @Input() resourceTrack: BibliographicResource | ToDo;
  entries: BibliographicEntry[] = [];
  @Output() entry: EventEmitter<BibliographicEntry> = new EventEmitter(true);
  @Output() goBack: EventEmitter<null> = new EventEmitter();
  loading = false;
  scanAvailable = true;


  constructor( private locdbService: LocdbService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges | any) {
    // fetch entries for todo item (cold observable, call in template with async)
    if (!this.todo) { return; }
    if (this.todo.hasOwnProperty('parts')) {
      // this could be problematic TODO FIXME if parts and scans are present
      // were dealing with a resource, not a scan
      console.log('viewing details for external todo item');
      this.scanAvailable = false;
      const todoResource = this.todo as ToDo;
      this.entries = todoResource.parts;
    } else {
      console.log('viewing details for internal todo item');
      // scan present
      this.scanAvailable = true;
      this.entries = [];
      this.loading = true;
      this.locdbService.getToDoBibliographicEntries(this.todo._id).subscribe(
        (result) => {this.entries = result; this.loading = false},
        (err) => {this.loading = false }
      );
    }
  }

  getScan(id: string) {
    return this.locdbService.getScan(id);
  }


  showScan() {
    this.scanIsVisible = true;
  }

  hideScan() {
    this.scanIsVisible = false;
  }

  back() {
    this.entry.emit(null);
    this.todo = null;
    this.goBack.emit(null);
  }

  forwardEntry(entry: BibliographicEntry) {
    this.entry.emit(entry);
  }

}
