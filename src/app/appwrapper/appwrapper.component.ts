import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToDo, ToDoParts, ToDoScans, BibliographicEntry, BibliographicResource } from '../locdb';
import { LocdbService } from '../locdb.service';
import { FeedService } from '../feed.service';
//import { environment } from 'environments/environment';

interface Track {
  todo: ToDo,
  part: ToDoParts,
}
@Component({
  selector: 'app-wrap',
  templateUrl: './appwrapper.component.html',
  providers: [ LocdbService, FeedService ]
})

/** Main App Component for whole LOCDB Frontend */
export class AppwrapperComponent implements OnInit {
  title = 'LOC-DB Frontend';
  source: BibliographicResource = null;
  todo: ToDoScans | ToDo = null;
  resourceTrack: Track;
  entry: BibliographicEntry = null;
  target: BibliographicResource = null;
  constructor (private locdbService: LocdbService ) {}

  ngOnInit() {
    // this.visualState = 0;
  }

  updateTodo(todo: ToDoScans | ToDo) {
    // this.visualState = 0;
    this.todo = todo;
  }

  updateTrack(resources: any[]){
    this.resourceTrack = { todo: resources[0], part: resources[1] };
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
