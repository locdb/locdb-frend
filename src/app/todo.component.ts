import { Component, Output, EventEmitter, OnInit } from '@angular/core';


import { ToDo, ToDoParts, ToDoScans, ToDoStates} from './locdb';
// import { MOCK_TODOBRS } from './mock-todos';

import { LocdbService } from './locdb.service';

@Component({
  selector: 'app-todo',
  templateUrl: 'todo.component.html',
  providers: [ LocdbService ],
  styleUrls: ['./locdb.css']
})

export class TodoComponent implements OnInit {
  title = 'Todo Management';
  state: ToDoStates = ToDoStates.ocr;
  states = ToDoStates;

  @Output() todo: EventEmitter<ToDoScans> = new EventEmitter();

  constructor ( private locdbService: LocdbService ) {}

  onSelect(scan: ToDoScans): void {
    console.log('onSelect: ', scan)
    if ( scan.status === ToDoStates.nocr ) {
      console.log('Starting processing');
      scan.status = ToDoStates.iocr;
      this.locdbService.triggerOcrProcessing(scan._id).subscribe(
        (success) => scan.status = ToDoStates.ocr,
        (err) => console.log(err)
      )
    } else {
      console.log('Todo item selected', scan);
      this.todo.next(scan);
    }
  }

  ngOnInit() {
    // console.log('Retrieving TODOs from backend');
  }

  setState(state: ToDoStates) {
    this.state = state;
  }

}
