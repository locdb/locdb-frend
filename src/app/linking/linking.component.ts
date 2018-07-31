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

  sub;
  constructor (private locdbService: LocdbService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        console.log(params)
        // Defaults if no query param provided.
        this.tracking[enums.status.notOcrProcessed] = params['NOT_OCR_PROCESSED'] == "true" || false;
        this.tracking[enums.status.ocrProcessing] = params['OCR_PROCESSING'] == "true" || false;
        this.tracking[enums.status.ocrProcessed] = params['OCR_PROCESSED'] == "true" || false;
        this.tracking[enums.status.external] = params['EXTERNAL'] == "true" || false;

      })
  }

  stringToBool(s: string){
    return s == "true"
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
}
