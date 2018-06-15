
import { Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';
import { LocdbService } from '../locdb.service';
import {Observable} from 'rxjs/Rx';
import { SimpleChanges } from '@angular/core';
import { EntryListComponent } from './entry-list/entry-list.component';

@Component({
  selector: 'app-refs-inspector',
  templateUrl: './refs-inspector.component.html',
  styleUrls: ['./inspector.css']
})
export class RefsInspectorComponent implements OnInit, OnChanges {
  @Input() resource: TypedResourceView;
  @Input() refs: Array<models.BibliographicEntry>;
  @Output() entry: EventEmitter<models.BibliographicEntry> = new EventEmitter();
  title = 'Reference Inspector';

  constructor( private locdbService: LocdbService) { }

  ngOnInit() {
    console.log('RefsInspector onInit');
  }

  ngOnChanges(changes: SimpleChanges | any) {
    // fetch entries for todo item (cold observable, call in template with async)
  }

  forwardEntry(entry: models.BibliographicEntry) {
    this.entry.emit(entry);
  }

  newEntry() {
    // this.refs.push(this.locdbService.newBibliographicEntry())
  }

}
