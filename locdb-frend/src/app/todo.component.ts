import { Component, Output, EventEmitter, OnInit } from '@angular/core';


import { ToDo, ToDoParts, ToDoScans } from './locdb';
import { MOCK_TODOBRS } from './mock-todos';

import { LocdbService } from './locdb.service';

@Component({
  selector: 'todolist',
  templateUrl: 'todo.component.html' ,
  providers: [ LocdbService ]
})

export class TodoComponent implements OnInit {
  title = 'Select todo item';
  scans: ToDoScans[] = TodoComponent.extractScans(MOCK_TODOBRS);
  selectedTodo: ToDoScans;
  @Output() eventEmitter: EventEmitter<string> = new EventEmitter();

  constructor ( private locdbService: LocdbService ) {}

  onSelect(todo: ToDoScans): void {
    this.selectedTodo = todo;
    console.log('Todo item selected', todo._id);
    this.eventEmitter.next(todo._id);
  }

  ngOnInit() {
    console.log('Retrieving TODOs from backend');
    this.locdbService.getToDo(false).subscribe( todos => this.scans = TodoComponent.extractScans(todos) )
  }

  private static extractScans(todos: Array<ToDo>): ToDoScans[] {
    if (!todos) return [];
    console.log("Input to extractScans:", todos);
    let flat_scans: ToDoScans[] = todos.map(
      t => <ToDoParts[]>t.parts
    ).reduce(
      (acc,val) => acc.concat(val)
    ).map(
      p => <ToDoScans[]>p.scans
    ).reduce(
      (acc,val) => acc.concat(val)
    )
    console.log("Extracted flat list of scans:", flat_scans);
    return flat_scans;
  }
}
