import { Component, Output, EventEmitter, OnInit } from '@angular/core';


import { BibliographicResource, ToDo, ToDoParts, ToDoScans, ToDoStates} from './locdb';
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

  @Output() todo: EventEmitter<ToDoScans | BibliographicResource> = new EventEmitter(true);
  @Output() resourceTrack: EventEmitter<BibliographicResource[] | ToDo[]> = new EventEmitter();

  constructor ( private locdbService: LocdbService ) {}

  pipe(scanOrResource: ToDoScans | BibliographicResource): void {
    this.todo.emit(scanOrResource)
  }

  tpipe(track:  BibliographicResource[] | ToDo[]){
      this.resourceTrack.emit(track)
  }

  ngOnInit() {
    // console.log('Retrieving TODOs from backend');
  }

  setState(state: ToDoStates) {
    this.state = state;
  }

}
