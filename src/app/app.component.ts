import { Component, OnInit} from '@angular/core';

import { ToDo, ToDoParts, ToDoScans, BibliographicEntry, BibliographicResource } from './locdb';
import { LocdbService } from './locdb.service';

import { environment } from 'environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [ LocdbService ]
})

/** Main App Component for whole LOCDB Frontend */
export class AppComponent implements OnInit {
    title = 'LOC-DB Extrapolite';
    source: BibliographicResource = null;
    todo: ToDoScans | ToDo = null;
    entry: BibliographicEntry = null;
    target: BibliographicResource = null;
    feeds: any = null;
    environment = environment;
    constructor ( private locdbService: LocdbService ) {}

    ngOnInit() {
        // this.visualState = 0;
    }

    updateFeeds(event){
      console.log("updateFeeds: ", event);
      this.feeds = event
    }


    updateTodo(todo: ToDoScans | BibliographicResource) {
        // this.visualState = 0;
        this.todo = todo;
    }


    updateSource (br: BibliographicResource) {
        // this.enableCitation();
        // this.visualState = 2;
        console.log('Updating source', br);
        this.source = br;
    }

    updateEntry (entry: BibliographicEntry) {
        // the check on entry causes the infamous ExpressionChangedAfterItWasSet exception
        // this.showCitation()
        // if (entry) {
        //     this.visualState = 1;
        // } else {
        //     this.visualState = 0;
        // }
        console.log('Updating with new entry', entry);
        this.entry = entry;
        // reset resource, since we selected a different entry
        this.target = null;
    }

    updateTarget (br: BibliographicResource) {
        // this.enableCitation();
        // this.visualState = 2;
        console.log('Updating target', br);
        this.target = br;
    }


    /* Are the functions below used? */

    // roundUp(num, precision) {
    //     return Math.ceil(num * precision) / precision;
    // }

    // pathStart() {
    //     console.log('pathStart');
    // }

    // pathSelectResource() {
    //     console.log('pathSelectResource');
    // }

    // pathEditAndSubmit() {
    //     console.log('pathEditAndSubmit');
    // }
}
