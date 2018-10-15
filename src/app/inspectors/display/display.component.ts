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

// interface BibliographicEntry {
// // we can use an interface to add propertys
//     rect: rect;
// }

export class DisplayComponent implements OnInit, OnChanges, OnDestroy {
    private zoomSVG: any;
    @ViewChild('zoomSVG') set content(content: any) {
        this.zoomSVG = content;
    }

    // @Input() todo: ToDoScans;

    @Input() img_src = '';
    private _entries = []
    @Input() set entries(entries: models.BibliographicEntry[]){
     console.log("set entries")
      if(entries.length == this._entries.length &&
        entries.every(e => this._entries.includes(e))){
         console.log("old == new")
       }
       else {
        console.log("old != new")
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

    @Output() imglength: EventEmitter<Number> = new EventEmitter();
    @Output() entry: EventEmitter<models.BibliographicEntry> = new EventEmitter();

    @ViewChild('svgroot') svgroot:ElementRef;

  constructor(
    private scanService: ScanService,
    private locdbService: LocdbService, private _hotkeysService: HotkeysService) {
    }

    // TODO: https://github.com/interactjs/website/blob/master/source/javascripts/star.js

    initInteract(imgWidth, imgHeight){
      // get the interact variable from the parent window
      // console.log('imgWidth', imgWidth)
      // console.log('imgHeight', imgHeight)
      // console.log('screenWidth: ', this.svgroot)
      // console.log('screenWidth: ', this.svgroot.nativeElement.clientWidth)
      // console.log('screenHeight:', this.svgroot.nativeElement.scrollHeight)
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
          // console.log(imgWidth)
          // console.log(imgHeight)
          let target = event.target,
              x = (parseFloat(target.getAttribute('x')) || 0),
              y = (parseFloat(target.getAttribute('y')) || 0);
          // console.log(target.id, x,y, event.deltaRect, event.rect)
        //
          // update the element's style
          // console.log(event)
          let svg = target.parentNode.parentNode
          const clientToImageWidthRatio = imgWidth / svg.clientWidth
          const clientToImageHeightRatio = imgHeight / svg.clientHeight
          // console.log(svg.clientWidth, clientToImageWidthRatio)
          // console.log(svg.clientHeight, clientToImageHeightRatio)
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


          // target.style.webkitTransform = target.style.transform =
          //     'translate(' + x + 'px,' + y + 'px)';
          // target.x = x;
          // target.y = y

        target.setAttribute('width', width * clientToImageWidthRatio);
        target.setAttribute('height', height * clientToImageHeightRatio);
        target.setAttribute('x', x);
        target.setAttribute('y', y);

        // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
         })
         .on('dragmove', function (event){
           let target = event.target,
           x = (parseFloat(target.getAttribute('x')) || 0),
           y = (parseFloat(target.getAttribute('y')) || 0);

           let svg = target.parentNode.parentNode
           const clientToImageWidthRatio = imgWidth / svg.clientWidth
           const clientToImageHeightRatio = imgHeight / svg.clientHeight

           x += event.dx * clientToImageWidthRatio;
           y += event.dy * clientToImageHeightRatio;


           // target.style.webkitTransform = target.style.transform =
           //     'translate(' + x + 'px,' + y + 'px)';
           // target.x = x;
           // target.y = y
           target.setAttribute('x', x);
           target.setAttribute('y', y);
           // console.log(target.id, x,y, event.deltaRect, event.rect)
           // console.log(event)
        });
    }
    initSVGZoom() {
        console.log('[Display] init Zoom')
        // let zoom = d3.zoom().on('zoom', function () {
        //     svgContainer.attr('transform', 'translate(' +
        //                       d3.event.transform.x + ', ' + d3.event.transform.y +
        //                       ')scale(' + d3.event.transform.k + ')')
        // })
        // .scaleExtent([1, 5])
        // .translateExtent([[0, 0], [this.imgX, this.imgY]])
        // .duration(250);
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
      console.log('click')
      console.log(this.rects.map(e => e.entry.ocrData.coordinates))
      for (const rect of this.zoomSVG.nativeElement.querySelectorAll('rect')) {
        const id = rect.getAttribute('id')
        const x = rect.getAttribute('x')
        const y = rect.getAttribute('y')
        const w = rect.getAttribute('width')
        const h = rect.getAttribute('height')
        const prestine = this.rects[id].isPrestine(x, y, w, h)
        console.log('x', x, 'y', y, 'width', w, 'height', h, 'prestine', prestine)
        console.log(this.rects[id].toString())
        if (!prestine) {
          console.log('Detected a change');
          this.rects[id].saveCoordinates(x, y, w, h);
          const scan_id = this.rects[id].entry.scanId;
          const coords = this.rects[id].toString();
          this.scanService.correctReferencePosition(scan_id, coords).subscribe(
            (newEntry) => this.rects[id].entry = newEntry,
            (error) => alert('OCR component yielded error')
          );
        }
        // console.log('id', id, 'x', x, 'y',
        // y, 'prestine?', 'width', w, 'height', h,
        // this.rects[id].x == x && this.rects[id].y == y &&
        // this.rects[id].width == w && this.rects[id].height == h? true : false)
      }
      console.log(this.rects.map(e => e.entry.ocrData.coordinates))
      // this.reload_rects()

    }
    ngOnChanges(changes: SimpleChanges | any) {
    }

    reload_rects() {
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
        console.log('Image source:', this.img_src)
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
    }

    onSelect(rect: Rect) {
        console.log('[display] onselect called');
        this.selectedEntry = rect.entry;
        this.entry.next(rect.entry);
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

    constructor(entry?: models.BibliographicEntry) {
      if (entry) {
        this.setByEntry(entry)
      }
    }

    setByEntry(entry) {
      const values = entry.ocrData.coordinates.split(' ')
        this.x = values[0] as number;
        this.y = values[1] as number;
        this.width = (values[2] as number)  - (values[0] as number),
        this.height = (values[3] as number) - (values[1] as number),
        this.entry = entry;
    }

    toString() {
      const coords = this.x + ' ' + this.y  + ' ' + (this.width + this.x) + ' ' + (this.height + this.y);
      console.log('Update with', coords);
      return coords;
    }

    saveCoordinates(x: number, y: number, width: number, height: number) {
      this.x = Math.round(x)
      this.y = Math.round(y)
      this.width = Math.round(width)
      this.height = Math.round(height)
      // console.log('x', x, 'y',
            // y, 'prestine?', prestine, 'width', width, 'height', height)
      // console.log('entry', this.entry)
    }

    isPrestine(x: number, y: number, width: number, height: number) {
      // is this ok?
      console.log(this.x, x, this.y, y, this.width, width, this.height, height)
      return this.x === x && this.y === y &&
              this.width === width && this.height === height
    }

}
