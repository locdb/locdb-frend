import { Component, OnInit, OnDestroy, OnChanges,
  Input, Output, EventEmitter, ViewChildren, ViewChild} from '@angular/core';
import { SimpleChanges } from '@angular/core';
import {ElementRef} from '@angular/core';

import { models } from '../../locdb';
import { LocdbService } from '../../locdb.service';
import { ScanListService } from '../router-scan-inspector.service'

import { PopoverModule } from 'ngx-popover/index';

import { Observable } from 'rxjs';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

import { ScanService } from '../../typescript-angular-client/api/scan.service';

// Display component consists of file upload, todo item selection and actual
// display of the scan

@Component({
    // moduleId: module.id,
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.css'],
    providers: [ LocdbService ]
})

export class DisplayComponent implements OnInit, OnChanges, OnDestroy {
    // @Input() todo: ToDoScans;
    @ViewChild('zoomSVG') zoomSVG: ElementRef;
    @ViewChild('svgroot') svgroot: ElementRef;
    @Input() img_src = '';
    private _entries = []
    @Input() boxEditMode = false;
    boxHeight = 750
    @Input() set entries(entries: models.BibliographicEntry[]){
      // check if new entries arrived
      if(entries.length == this._entries.length &&
        entries.every(e => this._entries.includes(e))){
       }
       else {
          this._entries = entries
          this.reload_rects()
    }
    }
    get entries(): models.BibliographicEntry[]{
      return this._entries
    }

    _selectedEntry: models.BibliographicEntry = null;
    get selectedEntry() {
      return this._selectedEntry;
    }
    @Input() set selectedEntry(val: models.BibliographicEntry) {
      this._selectedEntry = val;
    }

    title = 'Scan Display';
    currentIndex = 0;
    selection: any;

    rects: Rect[] = [];
    imgX = 3000;    // initvalues no relevance if new picture is set
    imgY = 3000;
    baseX = 0;
    baseY = 0;
    clientX = 0;
    clientY = 0;
    zoomFactor = 1.0;
    editMode = 'select';
    first_init = true;

    @Output() imglength: EventEmitter<Number> = new EventEmitter();
    @Output() entry: EventEmitter<models.BibliographicEntry> = new EventEmitter();
    @Output() deleteEntry: EventEmitter<models.BibliographicEntry> = new EventEmitter();
    @Output() updateEntry: EventEmitter<[models.BibliographicEntry, string]> =
              new EventEmitter();

  constructor(
    private scanService: ScanService,
    private locdbService: LocdbService,
    private _hotkeysService: HotkeysService,
    private scanListService: ScanListService) {
    }

    initInteract(){
      this.scanListService.initInteract()
    }

    zoomIn(): void {
      // this.zoom.scaleBy(this.selection, 1.2)
      this.clientY = this.svgroot.nativeElement.parentNode.clientHeight
      this.clientX = this.svgroot.nativeElement.parentNode.clientWidth
      const threshold = 2
      if ( this.zoomFactor < threshold) {
        this.zoomFactor += 0.1
      }

    }

    zoomOut(): void {
      if (this.zoomFactor > 1.0) {
        this.zoomFactor -= 0.1
      }
      this.clientX = this.svgroot.nativeElement.parentNode.clientWidth
      this.clientY = this.svgroot.nativeElement.parentNode.clientHeight
    }

    zoomReset(): void {
      this.zoomFactor = 1.0
      this.clientX = this.svgroot.nativeElement.parentNode.clientWidth
      this.clientY = this.svgroot.nativeElement.parentNode.clientHeight
      this.setScrolls(0, 0, 50)
    }

    zoomOnSelected(){
      let svgWidth = this.svgroot.nativeElement.parentNode.clientWidth || this.svgroot.nativeElement.width.baseVal.value
      let svgHeight = this.svgroot.nativeElement.parentNode.clientHeight || this.svgroot.nativeElement.height.baseVal.value

      const clientToImageWidthRatio = this.imgX / svgWidth
      const clientToImageHeightRatio = this.imgY / svgHeight
      // console.log(svgroot)
      this.clientY = this.svgroot.nativeElement.parentNode.clientHeight
      this.clientX = this.svgroot.nativeElement.parentNode.clientWidth
      const selectedBoxCoords = this.selectedEntry.ocrData.coordinates.split(' ')
      console.log('[display][debug] imgX: ',this.imgX)
      console.log('[display][debug] BoxWidth ', selectedBoxCoords[2])
      this.zoomFactor = this.imgX / (+selectedBoxCoords[2] - +selectedBoxCoords[0])
      this.zoomFactor *= 0.95
      const translateX = this.clientX * (this.zoomFactor-1) /2
      const translateY = this.clientY * (this.zoomFactor-1) /2
      console.log('[display][debug] Zoom factor: ',this.zoomFactor)
      console.log('[display][debug] Selected box coords : ', selectedBoxCoords)
      console.log('[display][debug] clientToImageRatios: ', clientToImageWidthRatio, clientToImageHeightRatio)
      console.log('[display][debug] Translate: ', translateX, translateY)
      console.log('[display][debug] svgWidth, svgHeight ', svgWidth, svgHeight)

      this.setScrolls(+selectedBoxCoords[0] * 0.95 * svgWidth * this.zoomFactor / this.imgX ,
                      +selectedBoxCoords[1] * 0.95 * svgHeight * this.zoomFactor / this.imgY,
                      100)
    }

    /* async workaround, because new Scrollbars have to be present before scrollTop and scrollLeft
    can be properly set ... */
    async setScrolls(x, y, d){
      console.log('[display][debug] ScrollTo: ', x, y)
      await this.delay(d)
      this.svgroot.nativeElement.parentNode.parentNode.scrollLeft  = x;
      this.svgroot.nativeElement.parentNode.parentNode.scrollTop  = y;
    }
    async delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }

    async saveBoxes() {
      // console.log(this.entries[0].scanId)
      console.log('[Display][info] Saving coordinates')
      const rects_copy = Object.assign([], this.rects)
      let deletionCounter = 0
      let updateCounter = 0
      for (const rect of this.zoomSVG.nativeElement.querySelectorAll('rect')) {
        const id = rect.getAttribute('id')
        const x = Math.round(rect.getAttribute('x'))
        const y = Math.round(rect.getAttribute('y'))
        const w = Math.round(rect.getAttribute('width'))
        const h = Math.round(rect.getAttribute('height'))
        const markedForDeletion = rect.style.display === 'none'
        // check first if entry is up for deletion
        if(markedForDeletion){
          // ignore unsaved added entries
          if(rects_copy[id].entry._id){
            deletionCounter += 1
            console.log('Emit Delete.')
            await this.locdbService
              .deleteBibliographicEntry(rects_copy[id].entry).toPromise().then(
              (ret) => console.log('[scan-inspector][info] Successesfully delete entry: ', ret),
              (error) => alert('[scan-inspector][Error] Error while deleting Entry: ' + error.message)
            );
            this.deleteEntry.emit(rects_copy[id].entry)
          }
        }
        else {
          const pristine = rects_copy[id].isPristine(x, y, w, h)
          if (!pristine) {
            // console.log('[Display][Debug] Detected a change', this.rects[id].toString());
            rects_copy[id].saveCoordinates(x, y, w, h);
            const scan_id = rects_copy[id].entry.scanId;
            const coords = rects_copy[id].toString();
            console.log('[Display][Debug] Uploading coordinates:', coords)
            updateCounter += 1
            const entry_id = rects_copy[id].entry._id || undefined;
            await this.scanService.correctReferencePosition(scan_id, coords, entry_id)
              .retryWhen(errors => {console.log('[locdbService][Error] retrying', id);
                                     let retries = 0;
                                     return errors.delay(750).map(error => {
                                     if (retries++ === 5) {
                                       throw error;
                                     }
                                       return error;})})
              .toPromise().then(
                (newEntry) => {rects_copy[id].entry = newEntry,
                                console.log('[Display][info] Correction successfull, recieved entry: ', newEntry),
                              this.updateEntry.emit([newEntry, entry_id])},
                (error) => alert('[Display][error] Error while uploading new coordinates: ' + error.message)
              );
          }
        }
      }
      console.log(`[Display][info] entries deleted: ${deletionCounter}, entries updated: ${updateCounter}`)
    }

    ngOnChanges(changes: SimpleChanges | any) {
    }

    reload_rects() {
      console.log('[Display][Debug] Reloading rects ... ')
      // Input todo and this method should replace manual calling of updateDisplay
      if (this.entries && this.entries.length) {
          // extract rectanlges and so on
          // there can be empty coordinate fields! we need to filter first
          this.rects = this.entries.filter(
              e => e.ocrData.coordinates && this.validateCoordinates(e.ocrData.coordinates)
          ).map(this.rectFromEntry);
          const firstUnprocessed = this.rects.find(r => !r.entry.references);
      }
      else{
        this.rects = []
      }
    }

    ngOnInit() {
        // console.log('[Display][Debug] Image source:', this.img_src)
        this._hotkeysService.add(new Hotkey('j', (event: KeyboardEvent): boolean => {
            let current = this.rects.findIndex(r => r.entry === this.selectedEntry);
            if (current === -1 || current >= this.rects.length - 1) { return false }; // not in array or at bounds
            current += 1
            this.onSelect(this.rects[current]);
            return false;
        }, [], 'one rectangle upward'));
        this._hotkeysService.add(new Hotkey('k', (event: KeyboardEvent): boolean => {
            let current = this.rects.findIndex(r => r.entry === this.selectedEntry);
            if (current === -1 || current <= 0) { return false }; // not in array or at bounds
            current -= 1
            this.onSelect(this.rects[current]);
            return false;
        }, [], 'one rectangle downward'));
        this._hotkeysService.add(new Hotkey('del', (event: KeyboardEvent): boolean => {
          console.log('[Display][Debug] delete pressed.')
          this.deleteRectAndEntry(this.selectedEntry)
          return false;
        }, [], 'Delete selected entry'));
        this._hotkeysService.add(new Hotkey('s', (event: KeyboardEvent): boolean => {
          this.saveBoxes()
          return false;
        }, [], 'Save entries'));
        this.boxHeight = window.innerHeight*0.8
    }

    onSelect(rect: Rect) {
      console.log(rect)
        // console.log('[Display][Debug] onselect called', this.editMode);
        if(this.editMode == 'add'){
          // console.log('[Display][Debug] onSelect in add Mode')
        }
        else if(this.editMode == 'delete'){
          // console.log('[Display][Debug] onSelect in delete Mode')
        }
        else if(this.editMode == 'select'){
          if(rect.entry._id){
            // console.log('[Display][Debug] Selected Entry id: ', rect.entry._id)
            this.selectedEntry = rect.entry;
            this.entry.next(rect.entry);
        }
          else{
            console.log('[Display][Debug] Selected Entry has no ID.')
          }
        }
        else{
          console.log('[Display][Error] Unknown edit mode' + this.editMode)
        }
    }

    setMode(mode: string){
      this.editMode = mode
    }

    clicked(evt){
      // console.log(evt.composedPath()[0].nodeName)
      const element = evt.composedPath()[0]
      const svg = evt.composedPath().find(e => e.nodeName == 'svg')
      // console.log(svg)
      let svgWidth = svg.parentNode.clientWidth || svg.width.baseVal.value
      let svgHeight = svg.parentNode.clientHeight || svg.height.baseVal.value
      const clientToImageWidthRatio = this.imgX / svgWidth
      const clientToImageHeightRatio = this.imgY / svgHeight

      if(element.nodeName === 'image' && this.editMode == 'add'){

        let e = evt.target;
        let dim = e.getBoundingClientRect();
        let x = evt.clientX - dim.left;
        let y = evt.clientY - dim.top;
        // alert("x: "+x+" y:"+y);
        // console.log(evt)
        // console.log(evt.path)
        // console.log(evt.path[0].nodeName)
        // console.log(e.getBoundingClientRect())
        // console.log(x, y)
        // console.log(x, y, clientToImageWidthRatio, clientToImageHeightRatio)
        this.newRectAndEntry(x * clientToImageWidthRatio, y * clientToImageHeightRatio)

        }
      else if (element.nodeName === 'rect' && this.editMode == 'delete'){
        console.log(element)
        const id = element.id
        this.deleteRectAndEntry(this.rects[id].entry)
        }
    }

    markRect(event){
      // console.log("Markme", event)
      const element = event.composedPath()[0]
      element.style.fill = 'rgb(0,0,0)'
      element.style.stroke = 'rgb(0,0,0)'
      // event.path[0].style['fill-opacity'] = '0.9'
      // event.path[0].style['stroke-opacity'] = '1'
    }

    unmarkRect(event){
      // console.log("Unmarkme", event)
      const element = event.composedPath()[0]
      element.style.fill = ''
      element.style.stroke = ''
      element.style['fill-opacity'] = ''
      element.style['stroke-opacity'] = ''
    }

    // TODO: take care of creating entry in entries too
    newRectAndEntry(x: number, y: number){
      const scanId = this.img_src.split('/').pop()
      // console.log('create on coordinates ', x, y)
      const coords = `${Math.round(x)} ${Math.round(y)} ${Math.round(x+300)} ${Math.round(y+125)}`
      // console.log('coords: ', coords)
      const entry = {ocrData: {coordinates: coords},
                    scanId: scanId}
      // console.log(entry)
      this.rects.push(new Rect(entry).markAsNew())
      // this.entries.push(entry)
    }

    deleteRectAndEntry(entry: models.BibliographicEntry){
      // const rectToDelete = this.rects[id]
      if (confirm(`Delete entry ${entry.bibliographicEntryText || entry.ocrData.coordinates}?`)) {
        // console.log('[Display][Debug] delete: ', this.rects[id])

        // console.log('[Display][Debug] Deleted rect', this.rects.splice(id, 1))
        // console.log('[Display][Debug] Deleted entry', this.entries.splice(id, 1))
        // console.log('[Display][Debug] Deleted entry', this.entries[id])
        if (entry) {
          const rects_id = this.rects.findIndex(e => e.entry.ocrData.coordinates === entry.ocrData.coordinates)
          this.rects[rects_id].markForDeletion()
          console.log(this.rects)
          //this.deleteEntry.emit(entry)
        }

      }

    }

    validateCoordinates(coordinates: string): boolean {
        return coordinates.split(' ').length >= 4
    }

    rectFromEntry(entry: models.BibliographicEntry): Rect {
        // returns null when coordinates string is empty
        return new Rect(entry)
    }

    realImgDimension(url) {
        const i = new Image();
        i.src = url;
        return {
            naturalWidth: i.width,
            naturalHeight: i.height
        };
    }

    imageOnload() {
        const realDim = this.realImgDimension(this.img_src);
        console.log('[Display][debug]Image Loaded, Dimensions: ', realDim); // e.g 4299, 3035
        this.imgX = realDim.naturalWidth;
        this.imgY = realDim.naturalHeight;
        this.imglength.emit(this.imgY)
        if ((this.imgX + this.imgY) <= 0) {
            console.log('Image size = 0', realDim);
        }
        if (this.first_init) {
          this.initInteract()
          this.first_init = false
        }
        this.reload_rects();
    }

    ngOnDestroy() {
        for (const combo of ['j', 'k']) {
            const hk = this._hotkeysService.get(combo)
            this._hotkeysService.remove(hk);
        }
    }

}

class Rect {
  /*
   * Don’t ever use the types Number, String, Boolean, or Object. These types
   * refer to non-primitive boxed objects that are almost never used
   * appropriately in JavaScript code.
   * From: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html
   * */
    x: number;
    y: number;
    height: number;
    width: number;
    entry: models.BibliographicEntry;
    active = true;
    new = false

    constructor(entry: models.BibliographicEntry) {
      const values = entry.ocrData.coordinates.split(' ')
      this.x = parseInt(values[0], 10);
      this.y = parseInt(values[1], 10);
      this.width = parseInt(values[2], 10)  - parseInt(values[0], 10);
      this.height = parseInt(values[3], 10) - parseInt(values[1], 10);
      this.entry = entry;
    }


    toString() {
      const x1 = this.x;
      const y1 = this.y;
      const x2 = this.x + this.width;
      const y2 = this.y + this.height;
      // Do not do string addition by accident
      const coords = `${x1} ${y1} ${x2} ${y2}`;
      return coords;
    }

    saveCoordinates(x: number, y: number, width: number, height: number) {
      this.x = Math.round(x)
      this.y = Math.round(y)
      this.width = Math.round(width)
      this.height = Math.round(height)
      // console.log('x', x, 'y',
            // y, 'pristine?', pristine, 'width', width, 'height', height)
      // console.log('entry', this.entry)
    }

    isPristine(x: number, y: number, width: number, height: number) {
      // is this ok?
      if (this.new){
        console.log('[display][info] Pristine check: skipped')
        return false
      }
      console.log('[display][info] Pristine check', this.x, x, this.y, y, this.width, width, this.height, height)
      return this.x === x && this.y === y && this.width === width && this.height === height
    }

    markAsNew(){
      this.new = true
      return this
    }
    markForDeletion(){
      console.log('Marked for deletion: ' + this.entry.bibliographicEntryText)
      this.active = false
    }

    markedForDeletion(): boolean{
      return !this.active
    }

}
