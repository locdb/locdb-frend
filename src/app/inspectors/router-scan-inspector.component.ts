
import { ViewChild, Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';
import { LocdbService } from '../locdb.service';
import {Observable} from 'rxjs/Rx';
import { SimpleChanges } from '@angular/core';
import { EntryListComponent } from './entry-list/entry-list.component';
import { DisplayComponent } from './display/display.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ScanListService } from './router-scan-inspector.service'

@Component({
  selector: 'app-rou-scan-inspector',
  templateUrl: './router-scan-inspector.component.html',
  styleUrls: ['./inspector.css']
})
export class RouterScanInspectorComponent implements OnInit, OnChanges {
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

  totalScans = 0;

  constructor(private location: Location,
              private locdbService: LocdbService,
              private route: ActivatedRoute,
              private router: Router,
              private scanListService: ScanListService) {
    console.log(scanListService.scans)
              }

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
          console.log("Write scans into ListService", embodiment.scans)
          this.scanListService.scans = embodiment.scans.filter(e => e.status === 'OCR_PROCESSED')
          this.totalScans = this.scanListService.totalScans
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
      // console.log('scans: ', trv.embodiedAs)
      if (this.resource.partOf) {
        this.locdbService.getBibliographicResource(this.resource.partOf).subscribe(
          (parent_trv) => this.parent = parent_trv,
          (error) => console.log('Error occurred while retrieving parent resource', error)
        )

      }
      // extract the correct scan
      this.scan = this.findScanById(this.scan_id, this.resource.embodiedAs);
      console.log(this.scanListService.scans)
      this.reloadScan()
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
      (data) => { this.scan_content_type = data.headers.get('content-type').split('/')[1]
        console.log('Scan content type: ', this.scan_content_type)
      },
      (err) => {
        this.sorry_text = 'Scan image not found ' + this.scan_id + '\n';
        console.log('err, loading url', err);
        // this.scan_content_type = "image"
      }
    );
  }

  reloadScan() {
    console.log('ScanInspector reloadScan');
    this._id = this.route.snapshot.params.resid;
    this.scan_id = this.route.snapshot.params.scanid;
    // load Bibliographic resource because only id is passed along the route
      // extract the correct scan
    this.scan = this.findScanById(this.scan_id, this.resource.embodiedAs);
    // Probe scan image for content type
    this.locdbService.checkScanImage(this.scan_id).subscribe(
      (data) => { this.scan_content_type = data.headers.get('content-type').split('/')[1]
        console.log('Scan content type: ', this.scan_content_type)
      },
      (err) => {
        this.sorry_text = 'Scan image not found ' + this.scan_id + '\n';
        console.log('err, loading url', err);
        // this.scan_content_type = "image"
      }
    );
  }

  ngOnChanges(changes: SimpleChanges | any) {
  }

  getScanImage() {
    const scan = this.locdbService.getScan(this.scan_id);
    // console.log("load img", scan)
    return scan
    }

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
    console.log('new entry');
    this.router.navigate(['/edit/'], { queryParams: { resource: this.resource._id, entry: 'create' } });
  }

  updateTarget(e) {
    console.log('eee', e);
  }

  setHeight(height: Number) {
    this.imgheight = height;
  }

  async triggerEdit(params) {
    await this.router.navigate([], {
        queryParams: {list: 1}
    });
    console.log('Edit: ', params);
    this.router.navigate(['/edit/'], { queryParams: params });

  }
  zoomIn() {
    if (this.scan_content_type !== 'pdf') {
      this.display.zoomIn();
    }

  }
  zoomOut() {
    if (this.scan_content_type !== 'pdf') {
      this.display.zoomOut();
    }
  }
  zoomReset() {
    if (this.scan_content_type !== 'pdf') {
      this.display.zoomReset();
    }
  }

  get paginationPos() {
    return this.scanListService.pos;
  }

  set paginationPos(p: number) {
    /* always use triple equals for comparison by value */
    if (p !== this.scanListService.pos) {
      this.scanListService.pos = p
      this.router.navigate(['/linking/ScanInspector/', this._id, this.scanListService.scan._id]);
      this.reloadScan();
    }
  }



}
