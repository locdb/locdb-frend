
import { ViewChild, Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';
import { LocdbService } from '../locdb.service';
import {Observable} from 'rxjs/Rx';
import { SimpleChanges } from '@angular/core';
import { EntryListComponent } from './entry-list/entry-list.component';
import { DisplayComponent } from './display/display.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rou-scan-inspector',
  templateUrl: './router-scan-inspector.component.html',
  styleUrls: ['./inspector.css']
})
export class RouterScanInspectorComponent implements OnInit, OnChanges {
  // @Input() scan: models.Scan = null;
  // @Input() resource: TypedResourceView;
  // if sorry_text is set it is shows instead of the app display in the card body
  @ViewChild('display') display;
  title = 'Scan Inspector';
  sorry_text = '';
  _id: string;
  scan: models.Scan = null;
  scan_content_type = '';
  resource: TypedResourceView;
  parent: TypedResourceView;
  //entries: models.BibliographicEntry[] = [];
  refs: Array<models.BibliographicEntry> = [];
  scanIsVisible = true;
  // @Output() entry: EventEmitter<models.BibliographicEntry> = new EventEmitter();
  entry: models.BibliographicEntry; // EventEmitter<models.BibliographicEntry> = new EventEmitter();
  selected_entry_display: models.BibliographicEntry;
  loading = false;
  embodiment_id: string;
  scan_id: string;
  imgheight: Number = 0;
  selected_entry_list: models.BibliographicEntry;
  pdf_src: string;

  constructor(private location: Location, private locdbService: LocdbService, private route: ActivatedRoute, private router: Router) { }

  display_trigger_selected_entry(entry: models.BibliographicEntry) {
    this.entry = entry;
    this.selected_entry_display = entry;
  }
  list_trigger_selected_entry(entry: models.BibliographicEntry) {
    this.entry = entry;
    this.selected_entry_list = entry;
  }

  findScanById(
    scan_id: string,
    embodiments: Array<models.ResourceEmbodiment>
  ): models.Scan | null {
    // goes through all embodiments and returns the matching scan
    for (const embodiment of embodiments) {
      for (const scan of embodiment.scans) {
        if (scan._id === scan_id) {
          return scan;
        }
      }
    }
    return null;
  }


  ngOnInit() {
    console.log('ScanInspector onInit');
    this._id = this.route.snapshot.params.resid;
    this.scan_id = this.route.snapshot.params.scanid;
    // load Bibliographic resource because only id is passed along the route


    // Retrieve child and then parent resource
    this.locdbService.getBibliographicResource(this._id).subscribe((trv) => {
      this.resource = trv;
      if (this.resource.partOf) {
        this.locdbService.getBibliographicResource(this.resource.partOf).subscribe(
          (parent_trv) => this.parent = parent_trv,
          (error) => console.log('Error occurred while retrieving parent resource', error)
        )

      }
      // extract the correct scan
      this.scan = this.findScanById(this.scan_id, this.resource.embodiedAs);
    },
      (error) => {
        console.log('Error occurred while retrieving resource', error);
      }
    );

    // Get entries for specific scan
    this.locdbService.getToDoBibliographicEntries(this.scan_id).subscribe(
      // DO NOT extract them from resource
        (entries) => {this.refs = entries},
      (error) => {
        this.sorry_text = 'Could not retrieve bibliographic entries for scan\n';
        console.log('Error occurred while retrieving entries for scan', error);
      }
    );
    // Probe scan image for content type
    this.locdbService.checkScanImage(this.scan_id).subscribe(
      (data) => { this.scan_content_type = data.headers.get('content-type').split('/')[0]
        console.log('Scan content type: ', this.scan_content_type)
      },
      (err) => {
        this.sorry_text = 'Scan image not found ' + this.scan_id + '\n';
        console.log('err, loading url', err);
        // this.scan_content_type = "image"
      }
    );
  } // end of ngOnInit
    //this.locdbService.getBibliographicResource(this._id).subscribe((res) => {
    //  this.resource = res
    //  console.log("Resource ", res)
    //  for(let part of res.parts){
    //    if (part.ocrData) {
    //      this.refs.push(part)
    //    }
    //  }
    //  let embodiments_with_scans = res.embodiedAs.filter((embo) => embo.scans.length > 0)
    //  for (let embodiment_with_scans of embodiments_with_scans){
    //    console.log("embo_with_scans ", embodiment_with_scans)
    //    // get scan_ids from the resource
    //    let ewsScansLength = embodiment_with_scans.scans.length
    //    if (ewsScansLength>0){
    //      this.scan_id = embodiment_with_scans.scans[ewsScansLength-1]._id
    //      this.scanName = embodiment_with_scans.scans[ewsScansLength-1].scanName
    //      console.log("Scan_id ", this.scan_id)
    //      console.log("ScanName ", this.scanName)
    //      // check wether scan is an image or something else
    //      this.locdbService.checkScanImage(this.scan_id).subscribe(data => {
    //          this.scan_content_type = data.headers.get("content-type").split('/')[0]
    //          console.log("Scan content type: ", this.scan_content_type)
    //    },
    //    (err) => { this.sorry_text = "Scan image not found " + this.scan_id;
    //                console.log("err, loading url", err);
    //                //this.scan_content_type = "image"
    //              });
    //}
  //}
    //if(!this.scan_id){
    //  this.sorry_text = "No scans attached"
    //}
    //},
    //(err) => { this.sorry_text = "No resource found with id " + this._id;
    //console.log("err, no br") });

    //this.route
    //  .queryParams
    //  .subscribe(params => {
    //    // Defaults to 0 if no query param provided.
    //    const list = params['list'] || '0';
    //    console.log("got params", list)
    //    if(list == '1'){
    //      if(this.scanIsVisible){
    //        this.location.back();
    //      }
    //      this.scanIsVisible = false

    //    }
    //    })

  //}

  ngOnChanges(changes: SimpleChanges | any) {
  }

  getScanImage() {
    let scan = this.locdbService.getScan(this.scan_id);
    return scan
    }

  // showrefs() {
  //   this.router.navigate(['/linking/RefsInspector/', this._id]);
  // }

  forwardEntry(entry: models.BibliographicEntry) {
    this.entry = entry
  }

  showScan() {
    this.scanIsVisible = true;
  }

  hideScan() {
    this.scanIsVisible = false;
  }

  newEntry() {
    console.log("new entry")
    this.router.navigate(['/edit/'],{ queryParams: { resource: this.resource._id, entry: "create" } });
    // this.refs.push(this.locdbService.newBibliographicEntry())
  }

  updateTarget(e){
    console.log("eee", e)
  }

  setHeight(height: Number){
    this.imgheight = height

  }

  async triggerEdit(params){
    await this.router.navigate([], {
        queryParams: {list: 1}
    });
    console.log("Edit: ", params)
    this.router.navigate(['/edit/'],{ queryParams: params});

  }
  zoomIn(){
    if (this.scan_content_type == 'pdf'){

    }
    else {
      this.display.zoomIn();
    }

  }
  zoomOut(){
    if (this.scan_content_type == 'pdf'){

    }
    else {
      this.display.zoomOut();
    }
  }
  zoomReset(){
    if (this.scan_content_type == 'pdf'){

    }
    else {
      this.display.zoomReset();
    }
  }



}
