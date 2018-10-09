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
    @Input() entries: models.BibliographicEntry[] = [];

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

    constructor( private locdbService: LocdbService, private _hotkeysService: HotkeysService) {
    }

    // TODO: https://github.com/interactjs/website/blob/master/source/javascripts/star.js

    initInteract(imgWidth, imgHeight){
      // get the interact variable from the parent window
      console.log('imgWidth', imgWidth)
      console.log('imgHeight', imgHeight)
      console.log('screenWidth: ', this.svgroot)
      console.log('screenWidth: ', this.svgroot.nativeElement.clientWidth)
      console.log('screenHeight:', this.svgroot.nativeElement.scrollHeight)


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
          console.log(imgWidth)
          console.log(imgHeight)
          let target = event.target,
              x = (parseFloat(target.getAttribute('x')) || 0),
              y = (parseFloat(target.getAttribute('y')) || 0);
          console.log(target.id, x,y, event.deltaRect, event.rect)
        //
          // update the element's style
          console.log(event)
          let svg = target.parentNode.parentNode
          const clientToImageWidthRatio = imgWidth / svg.clientWidth
          const clientToImageHeightRatio = imgHeight / svg.clientHeight
          console.log(svg.clientWidth, clientToImageWidthRatio)
          console.log(svg.clientHeight, clientToImageHeightRatio)
          target.style.width  = event.rect.width * clientToImageWidthRatio + 'px';
          target.style.height = event.rect.height * clientToImageHeightRatio + 'px';

          // translate when resizing from top or left edges
          x += event.deltaRect.left * clientToImageWidthRatio;
          y += event.deltaRect.top * clientToImageHeightRatio;


          // target.style.webkitTransform = target.style.transform =
          //     'translate(' + x + 'px,' + y + 'px)';
          // target.x = x;
          // target.y = y
        target.setAttribute('x', x);
        target.setAttribute('y', y);
          target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
         })
         .on('dragmove', function (event) {
           let target = event.target,
               x = (parseFloat(target.getAttribute('x')) || 0),
               y = (parseFloat(target.getAttribute('y')) || 0);
           console.log(target.id, x,y, event.deltaRect, event.rect)
           console.log(event)
        });
    }

    initSVGZoom() {
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


    ngOnChanges(changes: SimpleChanges | any) {
        // Input todo and this method should replace manual calling of updateDisplay
        // console.log('ngOnChanges in display');
        if (this.entries && this.entries.length) {
            // extract rectanlges and so on
            // this.extractRects(this.entries);
            // there can be empty coordinate fields! we need to filter first
            this.rects = this.entries.filter(
                e => e.ocrData.coordinates && this.validateCoordinates(e.ocrData.coordinates)
            ).map(this.rectFromEntry);
            const firstUnprocessed = this.rects.find(r => !r.entry.references);
            // this.selectedEntry = firstUnprocessed.entry;
            // this.entry.next(this.selectedEntry);
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
        this.selectedEntry = rect.entry;
        this.entry.next(rect.entry);
    }

    validateCoordinates(coordinates: string): boolean {
        return coordinates.split(' ').length >= 4
    }

    rectFromEntry(entry: models.BibliographicEntry): Rect {
        const values = entry.ocrData.coordinates.split(' ')
        const rect = {
                x: Number(values[0]),
                y: Number(values[1]),
                width: Number(values[2])  - Number(values[0]),
                height: Number(values[3]) - Number(values[1]),
                entry: entry
            }
        // returns null when coordinates string is empty
        return rect;
    }

    // extractRects(entries) {
    //     this.rects = [];
    //     for (const e of entries){
    //         // console.log("Entrie.OCRData.coordinates: ", e.coordinates);
    //         const coords = e.ocrData.coordinates;
    //         const rectField = coords.split(' ');
    //         this.rects.push({

    //             // x1 y1 x2 y2
    //             x: Number(rectField[0]),
    //             y: Number(rectField[1]),
    //             width: Number(rectField[2])  - Number(rectField[0]),
    //             height: Number(rectField[3]) - Number(rectField[1]),
    //             state: e.references ? 1 : -1

    //         });
    //         console.log(rectField);
    //         console.log(this.rects[this.rects.length - 1]);
    //     }
    // }

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
        // this.initSVGZoom();
    }

    ngOnDestroy() {
        for (const combo of ['j', 'k']) {
            const hk = this._hotkeysService.get(combo)
            this._hotkeysService.remove(hk);
        }
    }

    resize(e){
      console.log("Resize image event: ", e)
    }
}

class Rect {
    x: number;
    y: number;
    height: number;
    width: number;
    entry: models.BibliographicEntry;
}
