import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { ToDo, ToDoParts, ToDoScans, BibliographicEntry, BibliographicResource } from '../locdb';
import { LocdbService } from '../locdb.service';

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
  displayActive: boolean = false;
  title: string = 'Display';
  currentIndex: number = 0;
  resourceses: BibliographicResource[];
  @Output() resource: EventEmitter<BibliographicResource> = new EventEmitter();

  constructor( private locdbService: LocdbService) { }

  updateDisplay(newTodo: ToDoScans) {
    // this method is called when a todo item is selected
    console.log("newTodo: ", newTodo);
    this.displaySource = this.locdbService.getScan(newTodo._id);
    this.displayActive = true;
    this.locdbService.getToDoBibliographicResources(newTodo._id)
      .subscribe( (res) => this.resourcesesArrived(res) ) ;
  }

  resourcesesArrived(resourceses) {
    this.resourceses = resourceses;
    this.currentIndex = 0;
    this.resource.next(resourceses[0]);
  }

  onSelect(entry: any) {
    // selection of an entry of one todo item
    this.resource.next(entry);
  }

  newCustomEntry() {
    this.resource.next(new BibliographicResource());
  }

  next(diff: number) {
    this.currentIndex = Math.abs((this.resourceses.length + this.currentIndex + diff) % this.resourceses.length);
    let resource = this.resourceses[this.currentIndex];
    console.log('Emission of entry at index ' + this.currentIndex, resource);
    this.resource.next(this.resourceses[this.currentIndex]);
  }

  ngOnInit() {

  }

  clear() {
    this.displaySource = null;
    this.displayActive = false;
    console.log('Emission of null to clear');
    this.resource.next(null); // reset view
  }

}
