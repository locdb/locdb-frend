import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';
import { LocdbService } from '../locdb.service';
import { Context } from '../agenda/agenda.component';
import { AgendaComponent } from '../agenda/agenda.component';

import { RefsInspectorComponent, ScanInspectorComponent } from '../inspectors';
//import { environment } from 'environments/environment';

@Component({
  selector: 'app-linking',
  templateUrl: './linking.component.html',
  providers: [ LocdbService ]
})

/** Main App Component for whole LOCDB Frontend */
export class LinkingComponent implements OnInit {
  title = 'LOC-DB Frontend';
  source: TypedResourceView = null;
  context: Context;
  scan: models.Scan = null;
  refs: Array<models.BibliographicEntry> = null;
  entry: models.BibliographicEntry = null;
  target: TypedResourceView = null;
  mode: 'refs' | 'scan' | 'agenda' = 'agenda';
  constructor (private locdbService: LocdbService ) {}

  ngOnInit() {
    // this.visualState = 0;
  }

  get isInspecting () {
    return this.mode !== 'agenda';
  }

  startInspectRefs(refs: Array<models.BibliographicEntry>, context: Context) {
    this.mode = 'refs';
    this.refs = refs;
    this.context = context;
    this.scan = null;
    this.entry = null;
  }

  startInspectScan(scan: models.Scan, context: Context) {
    this.mode = 'scan';
    this.scan = scan;
    this.context = context;
    this.refs = null;
    this.entry = null;
  }

  reset() {
    this.mode = 'agenda';
    this.context = null;
    this.refs = null;
    this.scan = null;
    this.entry = null;
  }

  updateSource (br: TypedResourceView) {
    // this.enableCitation();
    // this.visualState = 2;
    console.log('Updating source', br);
    this.source = br;
  }

  updateEntry (entry: models.BibliographicEntry) {
    // the check on entry causes the infamous ExpressionChangedAfterItWasSet exception
    // this.showCitation()
    // if (entry) {
    //     this.visualState = 1;
    // } else {
    //     this.visualState = 0;
    // }
    console.log('Updating with new entry', entry);
    this.entry = entry;
    // reset resource, since we selected a different entry
    this.target = null;
  }

  updateTarget (br: TypedResourceView) {
    // this.enableCitation();
    // this.visualState = 2;
    console.log('Updating target', br);
    this.target = br;
  }


  /* Are the functions below used? */

  // roundUp(num, precision) {
  //     return Math.ceil(num * precision) / precision;
  // }

  // pathStart() {
  //     console.log('pathStart');
  // }

  // pathSelectResource() {
  //     console.log('pathSelectResource');
  // }

  // pathEditAndSubmit() {
  //     console.log('pathEditAndSubmit');
  // }
}
