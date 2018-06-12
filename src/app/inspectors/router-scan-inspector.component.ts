
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
  sorry_text = "";
  _id: string;
  scan: models.Scan = null;
  scan_content_type: string = "";
  resource: TypedResourceView;
  //entries: models.BibliographicEntry[] = [];
  refs: Array<models.BibliographicEntry> = [];
  scanIsVisible = true;
  // @Output() entry: EventEmitter<models.BibliographicEntry> = new EventEmitter();
  entry: models.BibliographicEntry; //EventEmitter<models.BibliographicEntry> = new EventEmitter();
  selected_entry_display: models.BibliographicEntry;
  display_trigger_selected_entry(entry: models.BibliographicEntry){
    this.entry= entry;
    this.selected_entry_display = entry;
  }
  selected_entry_list: models.BibliographicEntry;
  list_trigger_selected_entry(entry: models.BibliographicEntry){
    this.entry= entry;
    this.selected_entry_list = entry;
  }
  loading = false;
  embodiment_id: string;
  scan_id: string;
  scanName: string;
  imgheight: Number = 0


  constructor(private location: Location, private locdbService: LocdbService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    console.log('ScanInspector onInit');
    this._id = this.route.snapshot.params.id;
    console.log("Resource laden... ")
    // load Bibliographic resource because only id is passed along the route
    this.locdbService.getBibliographicResource(this._id).subscribe((res) => {
      this.resource = res
      console.log("Resource ", res)
      for(let part of res.parts){
        if(part.ocrData){
          this.refs.push(part)
        }
      }
      let embodiments_with_scans = res.embodiedAs.filter((embo) => embo.scans.length > 0)
      for (let embodiment_with_scans of embodiments_with_scans){
        console.log("embo_with_scans ", embodiment_with_scans)
        // get scan_ids from the resource
        let ewsScansLength = embodiment_with_scans.scans.length
        if (ewsScansLength>0){
          this.scan_id = embodiment_with_scans.scans[ewsScansLength-1]._id
          this.scanName = embodiment_with_scans.scans[ewsScansLength-1].scanName
          console.log("Scan_id ", this.scan_id)
          console.log("ScanName ", this.scanName)
          // check wether scan is an image or something else
          this.scan_content_type = this.scanName.split('.')[1].trim()
          console.log("content type:", "'" + this.scan_content_type + "'")
        //   this.locdbService.checkScanImage(this.scan_id).subscribe(data => {
        //       this.scan_content_type = data.headers.get("content-type").split('/')[0]
        //       console.log("Scan content type: ", this.scan_content_type)
        //       console.log("Scan type from name: ", this.scanName.split('.')[1])
        // },
        // (err) => { this.sorry_text = "Scan image not found " + this.scan_id;
        //             console.log("err, loading url", err);
        //             //this.scan_content_type = "image"
        //           });
    }
  }
    if(!this.scan_id){
      this.sorry_text = "No scans attached"
    }
    },
    (err) => { this.sorry_text = "No resource found with id " + this._id;
    console.log("err, no br") });

    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        const list = params['list'] || '0';
        console.log("got params", list)
        if(list == '1'){
          if(this.scanIsVisible){
            this.location.back();
          }
          this.scanIsVisible = false

        }
        })

  }

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
      this.display.zoomIn();
  }
  zoomOut(){
      this.display.zoomOut();
  }
  zoomReset(){
      this.display.zoomReset();
  }

}
