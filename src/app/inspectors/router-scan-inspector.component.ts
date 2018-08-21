
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
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

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

  /* Resource for showing its metadata and accessing its embodiments */
  resource: TypedResourceView;
  /* (optional) the container resource */
  parentResource: TypedResourceView;
  /* Currently displayed references (should always correspond to scan) */
  refs: Array<models.BibliographicEntry> = [];
  /* Flag whether the scan or the digital references list is shown */
  scanIsVisible = true;
  // @Output() entry: EventEmitter<models.BibliographicEntry> = new EventEmitter();
  //
  //
  entry: models.BibliographicEntry; // EventEmitter<models.BibliographicEntry> = new EventEmitter();
  selected_entry_display: models.BibliographicEntry;
  loading = false;
  // embodiment_id: string; // unused??
  imgheight: Number = 0;
  selected_entry_list: models.BibliographicEntry;

  allScans: Array<models.Scan>;

  currentPage = 0;

  /* The resource id */
  private resourceId: string;

  /*
   * Overwrite scan_id setter such that scanUrl always point to the correct URL
   */
  scanUrl: string;
  private _scanId: string;
  get scanId() { return this._scanId; }
  set scanId(newId: string) {
    this._scanId = newId;
    /* getScanURL prefixes the id with the base hostname and composes the URL */
    this.scanUrl = this.locdbService.getScanURL(newId);
  }

  /* A flag to determine whether the scan is displayable (is not a pdf) */
  scanIsDisplayable = true;
  /* Overwrite setter such that scanIsDisplayable is always set correctly */
  private _scan: models.Scan = null;
  get scan(): models.Scan { return this._scan; }
  set scan(newScan: models.Scan) {
    this._scan = newScan;
    // Scan is not (only by fallback) properly displayable when its a pdf
    this.scanIsDisplayable = !newScan.scanName.endsWith('.pdf');

    // Super important: also update to the new scan id
    this.scanId = newScan._id;
  }



  constructor(private location: Location,
    private locdbService: LocdbService,
    private route: ActivatedRoute,
    private router: Router) {
  }


  display_trigger_selected_entry(entry: models.BibliographicEntry) {
    this.entry = entry;
    this.selected_entry_display = entry;
  }
  list_trigger_selected_entry(entry: models.BibliographicEntry) {
    this.entry = entry;
    this.selected_entry_list = entry;
  }

  select(entry: models.BibliographicEntry) {
    this.entry = entry;
  }

  // /**
  //  * Finds a scan in a list of embodiments WITHOUT side-effects.
  //  * */
  // findScanById(
  //   scan_id: string,
  //   embodiments: Array<models.ResourceEmbodiment>
  // ): models.Scan | null {
  //   // goes through all embodiments and returns the matching scan
  //   for (const embodiment of embodiments) {
  //     for (const scan of embodiment.scans) {
  //       if (scan._id === scan_id) {
  //         console.log('[debug] Write scans into ListService', embodiment.scans)
  //         // scans may not only come from a single embodiment
  //         this.scanListService.scans = embodiment.scans.filter(e => e.status === 'OCR_PROCESSED')
  //         console.log('[debug] Initial Index scanlistservice', this.scanListService.scans.indexOf(scan))
  //         this.scanListService.pos = this.scanListService.scans.indexOf(scan) + 1
  //         // this.totalScans = this.scanListService.totalScans
  //         if (this.totalScans > 1){
  //           this.paginationInitialized = true;
  //         }
  //         return scan;
  //       }
  //     }
  //   }
  //   return null;
  // }

  gatherScans(embodiments: Array<models.ResourceEmbodiment>): Array<models.Scan> {
    const allScans: Array<models.Scan> = [];
    for (const embodiment of embodiments) {
      for (const scan of embodiment.scans) {
        allScans.push(scan)
      }
    }
    return allScans;
  }


  ngOnInit() {
    console.log('ScanInspector onInit');
    this.resourceId = this.route.snapshot.params.resid;
    this.scanId = this.route.snapshot.params.scanid;

    // Fetch the resource and its container from the backend
    this.locdbService.getBibliographicResource(this.resourceId).subscribe((trv) => {
      console.log('[debug] scan inspector received from ids in URL: resource:', this.resource)
      // console.log('scans: ', trv.embodiedAs)
      if (trv.partOf) {
        this.locdbService.getBibliographicResource(trv.partOf).subscribe(
          (parent_trv) => {
            this.parentResource = parent_trv;
            console.log('[debug] scan inspector received from ids in URL: parent_resource:', this.parentResource)
          },
          (error) => console.log('[error] Error occurred while retrieving parent resource', error)
        )
      }
      this.allScans = this.gatherScans(trv.embodiedAs);
      const scan_idx = this.allScans.findIndex(scan => scan._id === this.scanId )
      console.log('Finding the index', this.scanId, 'in', this.allScans, ':', scan_idx);
      // If found, select scan else default to first one
      this.scan = scan_idx > 0 ? this.allScans[scan_idx] : this.allScans.length ? this.allScans[0] : null
      // increment by one to obtain the correct current page
      this.currentPage = scan_idx + 1;
      // this.scanListService.scans = this.allScans;
      // extract the correct scan
      // this.scan = this.findScanById(this.scanId, trv.embodiedAs);
      console.log('[debug] scan inspector received from ids in URL: scan:', this.scan)
      this.resource = trv;
    },
      (error) => {
        console.log('[error] Error occurred while retrieving resource', error);
      }
    );
    // Fetch the scans associated with scan id (can be performed in parallel to resource retrieval
    this.fetchEntriesForScan(this.scanId);
  }

  fetchEntriesForScan(scanId: string): void {
    console.log('Fetching entries for scan with id', scanId);
    this.locdbService.getToDoBibliographicEntries(scanId).subscribe(
      // DO NOT extract them from resource
        (entries) => {this.refs = entries
        console.log('[debug] scan inspector received from scan_id: entries:', this.refs)},
      (error) => {
        this.sorry_text = 'Could not retrieve bibliographic entries for scan\n';
        console.log('[error] Error occurred while retrieving entries for scan', error);
      }
    );
  }


  // reloadScan() {
  //   console.log('ScanInspector reloadScan');
  //   this.resourceId = this.route.snapshot.params.resid;
    // this.scanId = this.route.snapshot.params.scanid;
    // load Bibliographic resource because only id is passed along the route
      // extract the correct scan
    // this.scan = this.findScanById(this.scanId, this.resource.embodiedAs);
    // Probe scan image for content type
    // this.locdbService.getScan(this.scan_id, 'response').subscribe(
    //   (data) => { this.scan_content_type = data.headers.get('content-type').split('/')[1]
    //     console.log('[info] Scan content type: ', this.scan_content_type)
    //   },
    //   (err) => {
    //     this.sorry_text = 'Scan image not found ' + this.scan_id + '\n';
    //     console.log('[error] err, loading url', err);
    //     // this.scan_content_type = "image"
    //   }
    // );
  // }

  ngOnChanges(changes: SimpleChanges | any) {
    // console.log('[debug:ngOnChanges]', changes);
    // Retrieve child and then parent resource

    // Get entries for specific scan
    // TODO: entries have to be filtered here,
    // DEBUG: why are entries not accordingly supplied to scan_id from backend?
    // Probe scan image for content type
    // this.locdbService.getScan(this.scan_id, 'response').subscribe(
    //   (data) => { this.scan_content_type = data.headers.get('content-type').split('/')[1]
    //     console.log('Scan content type: ', this.scan_content_type)
    //   },
    //   (err) => {
    //     this.sorry_text = 'Scan image not found ' + this.scan_id + '\n';
    //     console.log('[error] err, loading url', err);
    //     // this.scan_content_type = "image"
    //   }
    // );
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
    this.router.navigate(['/edit/'], { queryParams: { resource: this.resource._id, entry: 'create' } });
  }
  setHeight(height: Number) {
    this.imgheight = height;
  }

  async triggerEdit(params) {
    await this.router.navigate([], {
        queryParams: {list: 1}
    });
    console.log('[debug] Edit: ', params);
    this.router.navigate(['/edit/'], { queryParams: params });

  }
  async triggerNewScanId(scanid) {
    // ensure that new scanid is passed to reloadScan() via URL due to asyncronity of navigate()
    await this.router.navigate(['/linking/ScanInspector/', this.resourceId, scanid]);
    // this.reloadScan();
  }

  // page changed handler
  pageChanged(event: PageChangedEvent): void {
    // also: router navigate here?
    this.scan = this.allScans[event.page - 1];
    this.fetchEntriesForScan(this.scan._id);
    this.router.navigate(['/linking/ScanInspector/', this.resourceId, this.scan._id]);
  }

  // Zooming methods
  zoomIn() {
    if (this.scanIsDisplayable) {
      this.display.zoomIn();
    }

  }
  zoomOut() {
    if (this.scanIsDisplayable) {
      this.display.zoomOut();
    }
  }
  zoomReset() {
    if (this.scanIsDisplayable) {
      this.display.zoomReset();
    }
  }

}
