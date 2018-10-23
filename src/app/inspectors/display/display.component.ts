import { Component, OnInit, OnDestroy, OnChanges,
  Input, Output, EventEmitter, ViewChildren, ViewChild} from '@angular/core';
import { SimpleChanges } from '@angular/core';
import {ElementRef} from '@angular/core';

import { models } from '../../locdb';
import { LocdbService } from '../../locdb.service';

import * as d3 from 'd3';
import { PopoverModule } from 'ngx-popover/index';

import { Observable } from 'rxjs';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

import { ScanService } from '../../typescript-angular-client/api/scan.service';

import * as interact from 'interact.js';
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
    private zoomSVG: any;
    @ViewChild('zoomSVG') set content(content: any) {
        this.zoomSVG = content;
    }

    // @Input() todo: ToDoScans;
    @Input() img_src = '';
    private _entries = []
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
    get selectedEntry(){
      if(this._selectedEntry)
      return this._selectedEntry
    }
    @Input() set selectedEntry(val: models.BibliographicEntry){
      if(val)
      this._selectedEntry = val
    }

    title = 'Scan Display';
    currentIndex = 0;
    zoom: any;
    selection: any;

    rects: Rect[] = [];
    imgX = 3000;    // initvalues no relevance if new picture is set
    imgY = 3000;

    editMode = 'select'

    @Output() imglength: EventEmitter<Number> = new EventEmitter();
    @Output() entry: EventEmitter<models.BibliographicEntry> = new EventEmitter();
    @Output() deleteEntry: EventEmitter<models.BibliographicEntry> = new EventEmitter();
    @Output() updateEntry: EventEmitter<[models.BibliographicEntry, string]> =
              new EventEmitter();

    @ViewChild('svgroot') svgroot: ElementRef;

  constructor(
    private scanService: ScanService,
    private locdbService: LocdbService,
    private _hotkeysService: HotkeysService) {
    }

    // TODO: https://github.com/interactjs/website/blob/master/source/javascripts/star.js

    initInteract(imgWidth, imgHeight) {
      interact('.resizeable-rect')
        .draggable({
          restrict: {
            restriction: 'parent',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
        })
        .resizable({
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },

          // keep the edges inside the parent
          restrictEdges: {
            outer: 'parent',
            endOnly: true,
          },

          // minimum size
          restrictSize: {
            min: { width: 100, height: 50 },
          },

          inertia: true,
        })
        .on('resizemove', function (event) {
          const min_width = 50
          const min_height = 20
          let target = event.target,
              x = (parseFloat(target.getAttribute('x')) || 0),
              y = (parseFloat(target.getAttribute('y')) || 0);
          // update the element's style
          let svg = target.parentNode.parentNode
          let svgWidth = svg.parentNode.clientWidth || svg.width.baseVal.value
          let svgHeight = svg.parentNode.clientHeight || svg.height.baseVal.value
          const clientToImageWidthRatio = imgWidth / svgWidth
          const clientToImageHeightRatio = imgHeight / svgHeight
          let width  = event.rect.width;
          let height = event.rect.height;
          let deltaLeft = event.deltaRect.left;
          let deltaTop = event.deltaRect.top;

          if(width < min_width){
            width = min_width
            deltaLeft = 0
          }
          if(height < min_height){
            height = min_height
            deltaTop = 0
          }
               // translate when resizing from top or left edges
          x += deltaLeft * clientToImageWidthRatio;
          y += deltaTop * clientToImageHeightRatio;

        target.setAttribute('width', width * clientToImageWidthRatio);
        target.setAttribute('height', height * clientToImageHeightRatio);
        target.setAttribute('x', x);
        target.setAttribute('y', y);
})
         .on('dragmove', function (event){
           let target = event.target,
           x = (parseFloat(target.getAttribute('x')) || 0),
           y = (parseFloat(target.getAttribute('y')) || 0);

           let svg = target.parentNode.parentNode
           let svgWidth = svg.parentNode.clientWidth || svg.width.baseVal.value
           let svgHeight = svg.parentNode.clientHeight || svg.height.baseVal.value
           const clientToImageWidthRatio = imgWidth / svgWidth
           const clientToImageHeightRatio = imgHeight / svgHeight

           x += event.dx * clientToImageWidthRatio;
           y += event.dy * clientToImageHeightRatio;

           target.setAttribute('x', x);
           target.setAttribute('y', y);
        });
    }
    initSVGZoom() {
        console.log('[Display] init Zoom')
        let zoom = d3.zoom().on("zoom", function () {
          svgContainer.attr("transform", d3.event.transform)
        })
        .scaleExtent([1, 5])
        .translateExtent([[0, 0], [this.imgX, this.imgY]])
        .duration(250);
        let svgContainer = d3.select(this.zoomSVG.nativeElement);
        this.selection = svgContainer
            .attr('width', '100%')
            .attr('height', '100%')
            .call(zoom)
            .on("dblclick.zoom", null)
            .on("wheel.zoom", null);
        this.zoom = zoom;
    }

    zoomIn(){
      this.zoom.scaleBy(this.selection, 1.2)
    }
    zoomOut(){
      this.zoom.scaleBy(this.selection, 0.8)
    }
    zoomReset(){
      this.selection.transition().duration(500).call(this.zoom.transform, d3.zoomIdentity);
    }

    saveBoxes() {
      // console.log(this.entries[0].scanId)
      console.log('[Display][Debug] Saving coordinates')
      for (const rect of this.zoomSVG.nativeElement.querySelectorAll('rect')) {
        const id = rect.getAttribute('id')
        const x = Math.round(rect.getAttribute('x'))
        const y = Math.round(rect.getAttribute('y'))
        const w = Math.round(rect.getAttribute('width'))
        const h = Math.round(rect.getAttribute('height'))
        const pristine = this.rects[id].isPristine(x, y, w, h)
        if (!pristine) {
          console.log('[Display][Debug] Detected a change', this.rects[id].toString());
          this.rects[id].saveCoordinates(x, y, w, h);
          const scan_id = this.rects[id].entry.scanId;
          const coords = this.rects[id].toString();
          console.log('[Display][Debug] Uploading coordinates:', coords)
          const entry_id = this.rects[id].entry._id || undefined;
          this.scanService.correctReferencePosition(scan_id, coords, entry_id).subscribe(
            (newEntry) => {this.rects[id].entry = newEntry,
                            console.log(newEntry),
                          this.updateEntry.emit([newEntry, entry_id])},
            (error) => alert('Error while uploading new coordinates: ' + error.message)
          );
        }
      }
    }

    ngOnChanges(changes: SimpleChanges | any) {
    }

    reload_rects() {
      console.log('[Display][Debug] reload rects')
      // Input todo and this method should replace manual calling of updateDisplay
      if (this.entries && this.entries.length) {
          // extract rectanlges and so on
          // there can be empty coordinate fields! we need to filter first
          this.rects = this.entries.filter(
              e => e.ocrData.coordinates && this.validateCoordinates(e.ocrData.coordinates)
          ).map(this.rectFromEntry);
          const firstUnprocessed = this.rects.find(r => !r.entry.references);
      }
    }

    ngOnInit() {
        console.log('[Display][Debug] Image source:', this.img_src)
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
    }

    onSelect(rect: Rect) {
        console.log('[Display][Debug] onselect called', this.editMode);
        if(this.editMode == 'add'){
          console.log('[Display][Debug] onSelect in add Mode')
        }
        else if(this.editMode == 'delete'){
          console.log('[Display][Debug] onSelect in delete Mode')
        }
        else {
          if(rect.entry._id){
            console.log('[Display][Debug] Selected Entry id: ', rect.entry._id)
            this.selectedEntry = rect.entry;
            this.entry.next(rect.entry);
        }
          else{
            console.log('[Display][Debug] Selected Entry has no ID.')
          }
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
        // console.log(element)
        const id = element.id
        this.deleteRectAndEntry(this.entries[id])
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
      this.rects.push(new Rect(entry))
      // this.entries.push(entry)
    }

    deleteRectAndEntry(entry: models.BibliographicEntry){
      // const rectToDelete = this.rects[id]
      if(confirm(`Delete entry ${entry.bibliographicEntryText}?`)){
        // console.log('[Display][Debug] delete: ', this.rects[id])

        // console.log('[Display][Debug] Deleted rect', this.rects.splice(id, 1))
        // console.log('[Display][Debug] Deleted entry', this.entries.splice(id, 1))
        // console.log('[Display][Debug] Deleted entry', this.entries[id])
        if(entry){
          this.deleteEntry.emit(entry)
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
        console.log('Image Loaded, Dimensions: ', realDim); // e.g 4299, 3035
        this.imgX = realDim.naturalWidth;
        this.imgY = realDim.naturalHeight;
        this.imglength.emit(this.imgY)
        if ((this.imgX + this.imgY) <= 0) {
            console.log('Image size = 0', realDim);
        }
        this.initInteract(this.imgX, this.imgY)
        this.reload_rects();
        // this.initSVGZoom();
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
      console.log('Pristine check', this.x, x, this.y, y, this.width, width, this.height, height)
      return this.x === x && this.y === y && this.width === width && this.height === height
    }

}
