
import { Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';
import { LocdbService } from '../locdb.service';
import {Observable} from 'rxjs/Rx';
import { SimpleChanges } from '@angular/core';
import { EntryListComponent } from './entry-list/entry-list.component';
import { DisplayComponent } from './display/display.component';

@Component({
  selector: 'app-scan-inspector',
  templateUrl: './scan-inspector.component.html',
  styleUrls: ['./inspector.css']
})
export class ScanInspectorComponent implements OnInit, OnChanges {
  @Input() scan: models.Scan = null;
  @Input() resource: TypedResourceView;
  scanIsVisible = true;
  entries: models.BibliographicEntry[] = [];
  @Output() entry: EventEmitter<models.BibliographicEntry> = new EventEmitter();
  loading = false;


  constructor( private locdbService: LocdbService) { }

  ngOnInit() {
    console.log('ScanInspector onInit');
    this.entries = [];
    this.loading = true;
    this.locdbService.getToDoBibliographicEntries(this.scan._id).subscribe(
      (result) => {this.entries = result; this.loading = false},
      (err) => {this.loading = false }
    );
  }

  ngOnChanges(changes: SimpleChanges | any) {
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

  forwardEntry(entry: models.BibliographicEntry) {
    this.entry.emit(entry);
  }

  newEntry() {
    // this.entries.push(this.locdbService.newBibliographicEntry())
  }

}
