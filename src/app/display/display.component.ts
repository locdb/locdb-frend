import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { ToDo, ToDoParts, ToDoScans } from '../locdb';
import { LocdbService } from '../locdb.service';

// Display component consists of file upload, todo item selection and actual
// display of the scan

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})

export class DisplayComponent implements OnInit {
  // @Input() src: string;
  displaySource: string;
  displayActive: boolean = false;
  title: string = "Display";
  @Output() entry: EventEmitter<string> = new EventEmitter();

  constructor( private locdbService: LocdbService) { }

  updateDisplay(newTodo: ToDoScans) {
    console.log(newTodo);
    this.displaySource = this.locdbService.getScan(newTodo._id);
    console.log(this.displaySource);
    this.displayActive = true;
  }

  onSelect(entry: any) {
    // not called
    this.entry.next(entry);
  }

  ngOnInit() {

  }

  clear() {
    this.displaySource = null;
    this.displayActive = false;
  }

}
