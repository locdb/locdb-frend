import { Component, Output, EventEmitter, OnInit } from '@angular/core';


import { ToDo, ToDoParts, ToDoScans } from './locdb';
// import { MOCK_TODOBRS } from './mock-todos';

import { LocdbService } from './locdb.service';

@Component({
  selector: 'app-todo',
  templateUrl: 'todo.component.html' ,
  providers: [ LocdbService ]
})

export class TodoComponent implements OnInit {
  title = 'Todo Management';
  // scans: ToDoScans[];// = TodoComponent.extractScans(MOCK_TODOBRS);
  // scans: ScanEntries[];
  // unprocessed: ToDoScans[];
  // unprocessed: ScanEntries[];

  selectedTodo: ToDoScans;
  todolist: ToDo[] = [];
  unprocessed: ToDo[] = [];

  @Output() todo: EventEmitter<Object> = new EventEmitter();
  // @Output() todo: EventEmitter<ToDoScans> = new EventEmitter();

  constructor ( private locdbService: LocdbService ) {}

  onSelect(scan: ToDoScans): void {
    if ( scan.status === 'NOT_OCR_PROCESSED' ) {
      console.log('Starting processing');
      scan.status = 'OCR_PROCESSING';
      this.locdbService.triggerOcrProcessing(scan._id).subscribe(
        (success) => scan.status = 'OCR_PROCESSED',
        (err) => console.log(err)
      )
    } else {
      this.selectedTodo = scan;
      console.log('Todo item selected', scan._id);
<<<<<<< HEAD
      this.todo.next({"scan": scan, "id": scan._id});
      // this.todo.next(scan);
=======
      // TODO FIXME this gets passed to display component
      // and the entries corresponding to its identifier are looked up
      // there might be a cleaner alternative
      this.todo.next(scan);
>>>>>>> 91e6bf0cbc3fca6b625487649e9df3fb76abe0d9
    }
  }

  onSelectNew(scan: ToDoScans): void {
    console.log(scan)
  }

  ngOnInit() {
    // console.log('Retrieving TODOs from backend');
    this.fetchTodos();
  }

  fetchTodos() {
    console.log('Fetching todo scans from backend');
    this.locdbService.getToDo(true).subscribe( (todos) => {this.todolist = <ToDo[]>todos} );
    this.locdbService.getToDo(false).subscribe( (todos) => {this.unprocessed = <ToDo[]>todos} );
  }

  all_todos() {
    return this.todolist.concat(this.unprocessed)
  }


  prettyStatus(scan: ToDoScans) {
    if ( scan.status === 'OCR_PROCESSED' ) {
      return 'OCR processed';
    }
    if ( scan.status === 'NOT_OCR_PROCESSED' ) {
      return 'not OCR processed';
    }
    return 'Processing'
  }

  processScan(scan: ToDoScans) {
    if ( scan.status === 'NOT_OCR_PROCESSED' ) {
      console.log('Starting processing');
      scan.status = 'OCR_PROCESSING';
      this.locdbService.triggerOcrProcessing(scan._id).subscribe(
        (message) => scan.status = 'OCR_PROCESSED'
      )
    } else {
      alert('Already processing...')
    }
  }

  printme(p){
    console.log(p)
  }
}
