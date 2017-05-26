import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { ToDo, ToDoParts, ToDoScans, BibliographicEntry, BibliographicResource } from '../locdb';
import { LocdbService } from '../locdb.service';

import { environment } from 'environments/environment';

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
    displaySource: string;
    displayActive = false;
    title = 'Scan Display';
    currentIndex = 0;
    entries: BibliographicEntry[];

    rects: rect[] = [];
    imgX = 500;    // initvalues no relevance if new picture is set
    imgY = 500;

    @Output() entry: EventEmitter<BibliographicEntry> = new EventEmitter();

    constructor( private locdbService: LocdbService) { }

    updateDisplay(newTodo: ToDoScans) {
        // this method is called when a todo item is selected
        console.log('newTodo: ', newTodo);
        this.displaySource = this.locdbService.getScan(newTodo._id);
        this.displayActive = true;
        this.locdbService.getToDoBibliographicEntries(newTodo._id).subscribe( (res) => this.entriesArrived(res) ) ;
    }

    entriesArrived(entries) {
        console.log("Entries arrive: ", entries);
        this.entries = entries;
        this.extractRects(this.entries);
        console.log("DisplaySource: ", this.realImgDimension(this.displaySource));
        this.currentIndex = 0;
        this.entry.next(entries[0]);
    }

    onSelect(entry: any) {
        // selection of an entry of one todo item
        this.entry.next(entry);
    }

    newCustomEntry() {
        this.entry.next(new BibliographicEntry());
    }

    next(diff: number) {
        this.currentIndex = Math.abs((this.entries.length + this.currentIndex + diff) % this.entries.length);
        let entry = this.entries[this.currentIndex];
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

    rectLink(i: number){
        console.log("Display: Clicked Rect " + i);
        this.currentIndex = i
        let entry = this.entries[this.currentIndex];
        console.log('Emission of entry at index ' + this.currentIndex, entry);
        this.entry.next(entry);
    }
    
    extractRects(entries){
        for (let e of entries){
        //console.log("Entrie.OCRData.coordinates: ", e.coordinates);
        let coords = e.ocrData.coordinates;
        let rectField = coords.split(" ");
        this.rects.push({
            x: Number(rectField[0]),
            y: Number(rectField[1]),
            width: Number(rectField[2])-Number(rectField[0]),
            height: Number(rectField[3])-Number(rectField[1]),
        });
        }
    }
    
    realImgDimension(url) {
    var i = new Image();
    i.src = url;
    return {
        naturalWidth: i.width, 
        naturalHeight: i.height
        };
    }
    
    imageOnload(){
        console.log("Image Loaded, Dimensions: ", this.realImgDimension(this.displaySource));
    
        let realDim = this.realImgDimension(this.displaySource);
        this.imgX = realDim.naturalWidth;
        this.imgY = realDim.naturalHeight;
        if((this.imgX + this.imgY) <= 0)
            console.log("Image size = 0", realDim);
    }

}

class rect {
    x: number;
    y: number;
    height: number;
    width: number;
}
