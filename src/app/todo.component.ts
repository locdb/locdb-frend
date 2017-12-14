import { Component, Output, EventEmitter, OnInit } from '@angular/core';


import { BibliographicResource, ToDo, ToDoParts, ToDoScans, ToDoStatus} from './locdb';
// import { MOCK_TODOBRS } from './mock-todos';

import { LocdbService } from './locdb.service';

@Component({
  selector: 'app-todo',
  templateUrl: 'todo.component.html',
  providers: [ LocdbService ],
  styleUrls: []
})

export class TodoComponent implements OnInit {
  title = 'Todo Management';
  state: ToDoStatus = ToDoStatus.ocr;
  states = ToDoStatus;

  @Output() todo: EventEmitter<ToDoScans | BibliographicResource> = new EventEmitter(true);
  @Output() resourceTrack: EventEmitter<BibliographicResource[] | ToDo[]> = new EventEmitter();

  constructor ( private locdbService: LocdbService ) {}

  pipe(scanOrResource: ToDoScans | BibliographicResource): void {
    this.todo.emit(scanOrResource)
  }

  tpipe(track:  BibliographicResource[] | ToDo[]) {
      this.resourceTrack.emit(track)
  }

  ngOnInit() {
    // console.log('Retrieving TODOs from backend');
  }

  setState(state: ToDoStatus) {
    this.state = state;
  }

}
