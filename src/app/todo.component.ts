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
  title = 'Todo Management';
  scans: ToDoScans[];// = TodoComponent.extractScans(MOCK_TODOBRS);
  unprocessed: ToDoScans[];
  selectedTodo: ToDoScans;
  @Output() todo: EventEmitter<ToDoScans> = new EventEmitter();

  constructor ( private locdbService: LocdbService ) {}

  onSelect(todo: ToDoScans): void {
    this.selectedTodo = todo;
    console.log('Todo item selected', todo._id);
    this.todo.next(todo);
  }

  ngOnInit() {
    console.log('Retrieving TODOs from backend');
    // this.locdbService.getToDo(false).subscribe( todos => this.scans = TodoComponent.extractScans(todos) );
    this.fetchScans();
  }

  fetchScans() {
    this.locdbService.getToDo(true).subscribe( (todos) => {this.scans = TodoComponent.extractScans(<ToDo[]>todos)});
    this.locdbService.getToDo(false).subscribe( (todos) => {this.unprocessed = TodoComponent.extractScans(<ToDo[]>todos)});
  }

  prettyStatus(scan: ToDoScans) {
    if ( scan.status === "OCR_PROCESSED" )
      return "OCR";
    if ( scan.status === "NOT_OCR_PROCESSED" )
      return "not OCR";
    return "Processing"
  }

  processScan(scan: ToDoScans) {
    if ( scan.status === "NOT_OCR_PROCESSED" )
    {
      scan.status = "OCR_PROCESSING";
      this.locdbService.triggerOcrProcessing(scan._id).subscribe(
        (message) => scan.status = "OCR_PROCESSED"
      ) 
    }
    else
    {
      alert("Already processing...")
    }
  }

  private static extractScans(todos: ToDo[]): ToDoScans[] {
    console.log("Input to extractScans", todos);
    // if (!todos) return [];
    // let flat_scans: ToDoScans[] = [];
    // // Ugly loop //
    // for (let todo of todos) {
    //   for (let child of todo.children) {
    //     for (let scan of child.scans) {
    //       flat_scans.push(scan);
    //     }
    //   }
    // }
    //    Fancy function //
    let flat_scans: ToDoScans[] = todos.map(
      t => <ToDoParts[]>t.children
    ).reduce(
      (acc,val) => acc.concat(val)
    ).map(
      p => <ToDoScans[]>p.scans
    ).reduce(
      (acc,val) => acc.concat(val)
    )
    console.log("Extracted flat list of scans", flat_scans);
    return flat_scans;
  }
}
