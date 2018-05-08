import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { models, enums, enum_values, TypedResourceView } from '../locdb';
import { LocdbService } from '../locdb.service';
import { Context, Tracking } from '../agenda/agenda.component';
import { AgendaComponent } from '../agenda/agenda.component';
import { Router, ActivatedRoute} from '@angular/router';

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
  tracking: Tracking = {};

  constructor (private locdbService: LocdbService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.getTrackingFromRoute()

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

  testRefs(){
    this.router.navigate(['/linking/RefsInspector/', "5ab4c039e841b54dabf4d427"]);
  }
  testScans(){
    this.router.navigate(['/linking/ScanInspector/', "5ab4c039e841b54dabf4d427"]);
  }
  getTrackingFromRoute(){
    let statuses = enum_values(enums.todoStatus);;
    let tracking: Tracking = {};
    let bin = this.route.snapshot.params['bin']
    let pos = 0;
    for (let status of statuses){
      if (bin.charAt(pos) == '1'){
        tracking[status] = true; //this.route.snapshot.params[status];
      }else{
        tracking[status] = false;}
        pos += 1
      // console.log("status", status)
    }
    // console.log("tracking", tracking)
    this.tracking = tracking;
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
