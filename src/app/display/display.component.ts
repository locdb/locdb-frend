import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ViewChild} from '@angular/core';

import { ToDo, ToDoParts, ToDoScans, BibliographicEntry, BibliographicResource } from '../locdb';
import { LocdbService } from '../locdb.service';

import { environment } from 'environments/environment';
import * as d3 from 'd3';
import { PopoverModule } from 'ngx-popover/index';

// Display component consists of file upload, todo item selection and actual
// display of the scan

@Component({
    moduleId: module.id,
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.css'],
    providers: [ LocdbService ]
})

export class DisplayComponent implements OnInit {
    private zoomSVG: any;
    @ViewChild('zoomSVG') set content(content: any) {
        this.zoomSVG = content;
    }

    displaySource: string;
    displayActive = false;
    title = 'Scan Display';
    currentIndex = 0;
    entries: BibliographicEntry[];
    clickedRect = false;
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

    updateDisplay(newTodo: ToDoScans) {
        // this method is called when a todo item is selected
        console.log('newTodo: ', newTodo);
        this.displaySource = this.locdbService.getScan(newTodo._id);
        this.displayActive = true;
        this.locdbService.getToDoBibliographicEntries(newTodo._id).subscribe( (res) => this.entriesArrived(res) ) ;
    }

    entriesArrived(entries) {
        console.log('ENTRIES ARRIVED ===');
        // make entry_id an input property and move this code to ngOnChange()
        this.entries = entries;
        this.extractRects(this.entries);
        console.log(this.rects);
        // we could find the first one with status: not processed
        this.currentIndex = 0;
        this.entry.next(entries[0]);
    }

    onSelect(entry: any) {
        // selection of an entry of one todo item
        this.entry.next(entry);
    }

    newCustomEntry() {
        // unused but should be used //
        this.entry.next(new BibliographicEntry());
    }

    next(diff: number) {
        // unused //
        this.currentIndex = Math.abs((this.entries.length + this.currentIndex + diff) % this.entries.length);
        const entry = this.entries[this.currentIndex];
        console.log('Emission of entry at index ' + this.currentIndex, entry);
        this.entry.next(entry);
    }

    ngOnInit() {

    }

    clear() {
        this.displaySource = null;
        this.displayActive = false;
        console.log('Emission of null to clear');
        this.rects = [];
        this.entry.next(null); // reset view
    }

    rectLink(i: number) {
        this.rects[i].state = 0
        this.clickedRect = true;
        console.log('Display: Clicked Rect ' + i);
        this.currentIndex = i
        const entry = this.entries[this.currentIndex];
        console.log('Emission of entry at index ' + this.currentIndex, entry);
        this.entry.next(entry);
    }

    extractRects(entries) {
        this.rects = [];
        for (const e of entries){
            // console.log("Entrie.OCRData.coordinates: ", e.coordinates);
            const coords = e.ocrData.coordinates;
            const rectField = coords.split(' ');
            this.rects.push({
                // x1 y1 x2 y2
                // x: Number(rectField[0]),
                // y: Number(rectField[1]),
                // width: Number(rectField[2])  - Number(rectField[0]),
                // height: Number(rectField[3]) - Number(rectField[1]),
                //
                // x1 x2 y1 y2
                x: Number(rectField[0]),
                y: Number(rectField[2]),
                width: Number(rectField[1])  - Number(rectField[0]),
                height: Number(rectField[3]) - Number(rectField[2]),
                state: e.references ? 1 : -1
            });
        }
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
        const realDim = this.realImgDimension(this.displaySource);
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
    state = 0;
    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        state?: number
    ) {}
}
