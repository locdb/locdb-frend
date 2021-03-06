
import { ViewChild, Component, OnInit, Input, Output, OnChanges, AfterViewInit, EventEmitter} from '@angular/core';
import { models, enums, TypedResourceView, gatherScans } from '../locdb';
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
export class RouterScanInspectorComponent implements OnInit {
  // Do we need this?
  // enables method invocation on child to connect the buttons on this component
  // to the logic in the child component
  @ViewChild('display') display;
  // get rid of condition changed while checking error
  // still there...
  initialized = false;
  title = 'Scan Inspector';
  // if sorry_text is set it is shows instead of the app display in the card body
  sorry_text = '';

  /* Resource for showing its metadata and accessing its embodiments */
  resource: TypedResourceView;

  /* (optional) the container resource */
  parentResource: TypedResourceView;

  /* Currently displayed references (should always correspond to scan) */
  private _refs: Array<models.BibliographicEntry> = [];
  /* setter and getter to enable filtering without loosing the actual data */
  get refs() {
      // return Filtered entries
      return this.filterEntries(this._refs)
  }
  set refs(refs: Array<models.BibliographicEntry>) {
    this._refs = refs
    // Always refresh filter options when references are updated
    this.refreshFilterOptions()
  }

  /* Flag whether the scan or the digital references list is shown */
  scanIsVisible = true;


  /* Currently active entry, is passed down to the app-display and
  app-entry-list components */
  entry: models.BibliographicEntry;

  /* Indicates loading */
  loading = false;

  /* Image height, to be set by the display component */
  imgheight: Number = 600;

  /* Keep track of all associated scans for convenient switching */
  allScans: Array<models.Scan>;

  /* Bound to current Page of Pagination, gets updated when list of scans is retrieved
   * to match the index of the provided scanId*/
  currentPage = 0;

  /* The URL that corresponds to currently active scan */
  scanUrl: string;
  /* A flag to determine whether the scan is displayable (is not a pdf) */
  scanIsDisplayable = true;
  /* set attributes from ocrData to filter from
  NOTE: attributes to filter by still have to be set manually,
  because not all attributes are relevant or are to specific to filter by */
  filter_attributes = ['detector', 'namer', 'date']
  /* these objects store the filter functions and selected options */
  filter_options = {}
  selection = {}

  boxEditMode = false
  boxStatus = 'up to date'
  editModeFilter = false

  /* Overwrite setter such that scanIsDisplayable is always set correctly */
  private _scan: models.Scan = null;
  get scan(): models.Scan { return this._scan; }
  set scan(newScan: models.Scan) {
    this._scan = newScan;
    // Scan is not (only by fallback) properly displayable when its a pdf
    this.scanIsDisplayable = !newScan.scanName.endsWith('.pdf');
    // Super important: also update the URL
    // getScanURL prefixes the id with the base hostname and composes the URL
    this.scanUrl = this.locdbService.getScanURL(newScan._id);
  }



  constructor(private location: Location,
    private locdbService: LocdbService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngAfterViewInit(){
    this.initialized = true
  }

  /* apply the filter functions */
  filterEntries(entries: models.BibliographicEntry[]) {
    // console.log("filter Entries: ", entries)
    if (entries !== null && entries !== undefined) {
      let filtered_entries = entries.filter(e => e !== null && e !== undefined)
      /* allways drop status obsolete */
      filtered_entries = entries.filter(e => e.status !== 'OBSOLETE')
      // console.log('before filtering: ', filtered_entries)
      for (const attr of this.filter_attributes) {
        // console.log('[Debug][scan-inspector]', attribute, this.selection[attribute])
          filtered_entries = filtered_entries.filter(this.search_filter(attr,
            this.selection[attr]))
      }
      // console.log('after filtering: ', filtered_entries)
      return filtered_entries;
    }
  }

  search_filter(selection_type: string, selection_name: string) {
    const filter_name = selection_name
    const type = selection_type
    if (this.filter_options[type] === undefined){
      return e => true
    }
    return this.filter_options[type]
                    .find(e => {return e.name === filter_name})
                    .filter
  }
  /* extract filter options and generate the necessary filterfunctions */
  refreshFilterOptions() {
    /* inititialize filter_options */
    /* INIT HERE, else the values accumulate, e.g. when switching pages */
    for (const attribute of this.filter_attributes) {
      this.filter_options[attribute] = [{name: 'All', filter: e => true}]
      this.selection[attribute] = 'All'
    }
    for (const current_entry of this.refs) {
        for (const attribute of this.filter_attributes) {
          const value = current_entry.ocrData[attribute]
          if (value && this.filter_options[attribute].every(y => y.name !== value)) {
            this.filter_options[attribute].push({name: value,
                  filter: x => x ? x.ocrData[attribute] === value : false})}}
        }
    for (const attribute of this.filter_attributes) {
      this.filter_options[attribute].sort((e1, e2) => ( e1.name < e2.name ||
                  e1.name === 'All' && e2.name !== 'All' ? -1 : 1))
    }
  }

  /* This method is called when the user clicks on a specific bibliographic entry either in the scan view or in the list view.
   * It is good that both views operate on the same selection, such that one can toggle the view while the same entry stays active.
   */
  selectEntry(entry: models.BibliographicEntry) {
    this.entry = entry;
  }

  ngOnInit() {
    // console.log('ScanInspector onInit');
    /* Get arguments from route */
    const resourceId = this.route.snapshot.params.resid;
    const scanId = this.route.snapshot.params.scanid;

    // Fetch the resource and its container from the backend
    this.locdbService.getBibliographicResource(resourceId).subscribe((trv) => {
      this.loading = true;
      console.log('[scan-inspector][info] scan inspector received from ids in URL: resource:', this.resource)
      // console.log('scans: ', trv.embodiedAs)
      if (trv.partOf) {
        this.locdbService.getBibliographicResource(trv.partOf).subscribe(
          (parent_trv) => {
            this.parentResource = parent_trv;
            console.log('[scan-inspector][info] scan inspector received from ids in URL: parent_resource:', this.parentResource)
          },
          (error) => console.log('[scan-inspector][error] Error occurred while retrieving parent resource', error)
        )
      }
      this.allScans = gatherScans(trv.embodiedAs, s => s.status !== enums.status.obsolete);
      // find index of desired scan in id
      const scan_idx = this.allScans.findIndex(scan => scan._id === scanId )
      console.log('[scan-inspector][info] Finding the index', scanId, 'in', this.allScans, ':', scan_idx);
      // If found, select scan else default to first one
      this.scan = scan_idx > 0 ? this.allScans[scan_idx] : this.allScans.length ? this.allScans[0] : null;
      // increment by one to obtain the correct current page
      this.currentPage = scan_idx + 1;
      console.log('[scan-inspector][info] scan inspector received from ids in URL: scan:', this.scan);
      this.resource = trv;
      this.loading = false;
    },
      (error) => {
        this.loading = false;
        this.sorry_text = 'An error occurred. could not retrieve resource.';
        console.log('[scan-inspector][error] Error occurred while retrieving resource', error);
      }
    );
    // Fetch the scans associated with scan id (can be performed in parallel to resource retrieval
    this.fetchEntriesForScan(scanId);

  }

  /* Given a scanId, fetches all associated entries from the backend */
  fetchEntriesForScan(scanId: string): void {
    // fetching new Entries (e.g. on page change, invalidates the current entry //
    this.entry = null;
    console.log('[scan-inspector][info] Fetching entries for scan with id', scanId);
    this.locdbService.getToDoBibliographicEntries(scanId).subscribe(
      // DO NOT extract them from resource
      (entries) => {
        this.refs = entries.filter(x => x.status !== enums.status.obsolete);
        this.selectFirst(entries); // here we select an appropriate entry from the new list
        console.log('[scan-inspector][info] scan inspector received from scan_id: entries:', this.refs)
      },
      (error) => {
        this.refs = [];
        this.sorry_text = 'Could not retrieve bibliographic entries for scan\n';
        console.log('[scan-inspector][error]  Error occurred while retrieving entries for scan', error);
      }
    );
  }

  selectFirst(entries: Array<models.BibliographicEntry>): void {
    const entryToSelect = entries.find(e => e !== enums.status.valid);
    console.log('[scan-inspector][info] Selecting first entry by heuristic', entryToSelect);
    this.selectEntry(entryToSelect);
  }

  /** Triggered on button press for adding a new Entry */
  newEntry() {
    this.router.navigate(['/edit/'], { queryParams: { resource: this.resource._id, entry: 'create' } });
  }
  setHeight(height: Number) {
    this.imgheight = height;
  }

  // does this need to be async?
  async triggerEdit(params) {
    await this.router.navigate([], {
        queryParams: {list: 1}
    });
    // console.log('[debug] Edit: ', params);
    this.router.navigate(['/edit/'], { queryParams: params });

  }

  /** This handler is called, when the user selects a page from the pagination */
  pageChanged(event: PageChangedEvent): void {
    // We take care of updating the scan and fetching its entries
    this.scan = this.allScans[event.page - 1];
    this.fetchEntriesForScan(this.scan._id);
    // We navigate, but the ngOnInit will *not* be called again, since the component is already initialized
    this.router.navigate(['/linking/ScanInspector/', this.resource._id, this.scan._id]);
    //console.log('[Debug][pageChanged] allScans:', this.allScans)
    //console.log('[Debug][pageChanged] Set page:', event.page, this.scan)
  }

  // Switch between Scan view and Reference list View
  showScan() {
    this.scanIsVisible = true;
  }

  hideScan() {
    this.scanIsVisible = false;
  }
  // Switch between Scan view and Reference list View END

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
  zoomOnSelected(){
    if (this.scanIsDisplayable) {
      this.display.zoomOnSelected();
    }
  }

  saveBoxes(exit) {
    if (this.scanIsDisplayable) {
      this.display.saveBoxes();
    }
    if(exit){
      this.toggleBoxEditMode()
    }
  }
  // Zooming methods END

  setMode(mode: string) {
    if(!this.boxEditMode){
      this.toggleBoxEditMode()
    }

    if (this.scanIsDisplayable) {
      this.display.setMode(mode);
    }
  }

  toggleBoxEditMode(){
    this.zoomReset()
    this.boxEditMode = !this.boxEditMode
    if (this.scanIsDisplayable) {
      this.display.setMode('select');
      this.display.reload_rects()
    }
    window.scrollTo(0,0);
  }

  getMode(mode: string) {
    if (this.scanIsDisplayable && this.display) {
      return this.display.editMode;
    }
    return 'select';
  }

  async deleteEntry(entry: models.BibliographicEntry) {
    // console.log('[scan-inspector][Debug] entry to delete: ', entry)

    // this function needs to be syncronized with saveBoxes()@display.component.ts
    // await this.locdbService
    //   .deleteBibliographicEntry(entry).subscribe(
    //   (ret) => console.log('[scan-inspector][info] Successesfully delete entry: ', ret),
    //   (error) => alert('[scan-inspector][Error] Error while deleting Entry: ' + error.message)
    // );
    const refs_id = this._refs.findIndex(e => e._id === entry._id)
    // console.log('[scan-inspector][Debug] ID of entry to delete:', refs_id)
    this._refs.splice(refs_id, 1)
  }

  updateEntry(tuple: [models.BibliographicEntry, string]) {
    const [newEntry, oldId] = tuple;
    // console.log('[Scan-inspector][Debug]', tuple, this._refs)

    if (!oldId) {
      // OldId is '' or null, we create a **new** entry
      this._refs.push(newEntry);
    } else {
      const idx = this._refs.findIndex(e => e._id === oldId);
      if (idx >= 0) {
        this._refs[idx] = newEntry;
      } else {
        // old id for some reason not found
        // Just add it no matter what
        this._refs.push(newEntry);
      }

    }
    // It *is* convenient, when only one entry is adapted.
    // Thus leave it in
    this.entry = newEntry;
  }

}
