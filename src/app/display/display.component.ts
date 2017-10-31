import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChildren, ViewChild} from '@angular/core';
import { SimpleChanges } from '@angular/core';

import { ToDo, ToDoParts, ToDoScans, BibliographicEntry, BibliographicResource } from '../locdb';
import { LocdbService } from '../locdb.service';

import { environment } from 'environments/environment';
import * as d3 from 'd3';
import { PopoverModule } from 'ngx-popover/index';

import { Observable } from 'rxjs/Observable';

// Display component consists of file upload, todo item selection and actual
// display of the scan

@Component({
    moduleId: module.id,
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.css'],
    providers: [ LocdbService ]
})

// interface BibliographicEntry {
// // we can use an interface to add propertys
//     rect: rect;
// }

export class DisplayComponent implements OnInit, OnChanges {
    private zoomSVG: any;
    @ViewChild('zoomSVG') set content(content: any) {
        this.zoomSVG = content;
    }

    // @Input() todo: ToDoScans;

    @Input() img_src: string;
    @Input() entries: BibliographicEntry[];

    selectedEntry: BibliographicEntry = null;

    title = 'Scan Display';
    currentIndex = 0;
    zoom: any;

    rects: Rect[] = [];
    imgX = 1500;    // initvalues no relevance if new picture is set
    imgY = 1500;

    @Output() entry: EventEmitter<BibliographicEntry> = new EventEmitter();

    constructor( private locdbService: LocdbService) { }

    initSVGZoom() {
        const zoom = d3.zoom().on('zoom', function () {
            svgContainer.attr('transform', 'translate(' +
                              d3.event.transform.x + ', ' + d3.event.transform.y +
                              ')scale(' + d3.event.transform.k + ')')
        })
        .scaleExtent([1, 5])
        .translateExtent([[0, 0], [this.imgX, this.imgY]])
        .duration(250);
        const svgContainer = d3.select(this.zoomSVG.nativeElement);
        svgContainer.attr('width', '100%').attr('height', '100%').call(zoom);
        this.zoom = zoom;
    }


    ngOnChanges() {
        // Input todo and this method should replace manual calling of updateDisplay
        if (this.entries && this.entries.length) {
            // extract rectanlges and so on
            // this.extractRects(this.entries);
            // there can be empty coordinate fields! we need to filter first
            this.rects = this.entries.filter(
                e => this.validateCoordinates(e.ocrData.coordinates)
            ).map(this.rectFromEntry);
        }
    }

    // these should go over to entry-list.ts
    newCustomEntry() {
        // unused but should be used //
        this.entry.next(new BibliographicEntry());
    }

    next(diff: number) {
        // unused //
        // we could make more use of it, when we check for status = -1
        this.currentIndex = Math.abs((this.entries.length + this.currentIndex + diff) % this.entries.length);
        const entry = this.entries[this.currentIndex];
        console.log('Emission of entry at index ' + this.currentIndex, entry);
        this.entry.next(entry);
    }

    ngOnInit() {

    }

    onSelect(rect: Rect) {
        this.selectedEntry = rect.entry;
        this.entry.next(rect.entry);
    }

    validateCoordinates(coordinates: string): boolean {
        return coordinates.split(' ').length >= 4
    }

    rectFromEntry(entry: BibliographicEntry): Rect {
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
        if ((this.imgX + this.imgY) <= 0) {
            console.log('Image size = 0', realDim);
        }
        this.initSVGZoom();
    }
}

class Rect {
    x: number;
    y: number;
    height: number;
    width: number;
    entry: BibliographicEntry;
}
