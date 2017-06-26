import { Component, Output, EventEmitter, OnInit } from '@angular/core';


import { ToDo, ToDoParts, ToDoScans } from './locdb';
import { MOCK_TODOBRS } from './mock-todos';

import { LocdbService } from './locdb.service';

@Component({
  selector: 'app-todo',
  templateUrl: 'todo.component.html' ,
  providers: [ LocdbService ]
})

export class TodoComponent implements OnInit {
  title = 'Todo Management';
  // scans: ToDoScans[];// = TodoComponent.extractScans(MOCK_TODOBRS);
  scans: ScanEntries[];
  // unprocessed: ToDoScans[];
  // unprocessed: ScanEntries[];

  selectedTodo: ToDoScans;
  todolist: ToDo[] = [];
  unprocessed: ToDo[] = [];

  @Output() todo: EventEmitter<ToDoScans> = new EventEmitter();


  private static extractScans(todos: ToDo[]): ScanEntries[] {
    // private static extractScans(todos: ToDo[]): ToDoScans[] {
    console.log('DEPRECATION WARNING');
    console.log('Input to extractScans', todos);
    // if (!todos) return [];
    // let flat_scans: ToDoScans[] = [];
    const flat_scans: ScanEntries[] = [];
    // Ugly loop //
    for (const todo of todos) {
      console.log(todo);
      console.log(todo._id);
      const scanentry = new ScanEntries(todo._id)
      for (const child of todo.children) {
        console.log(child);
        for (const scan of child.scans) {
          scanentry.scans.push(scan);
        }
      }
      flat_scans.push(scanentry);
    }
    //    Fancy function //
    // let flat_scans: ToDoScans[] = todos.map(
    //   t => <ToDoParts[]>t.children
    // ).reduce(
    //   (acc,val) => acc.concat(val)
    // ).map(
    //   p => <ToDoScans[]>p.scans
    // ).reduce(
    //   (acc,val) => acc.concat(val)
    // )
    console.log('Extracted flat list of scans', flat_scans);
    return flat_scans;
  }

  constructor ( private locdbService: LocdbService ) {}

  onSelect(scan: ToDoScans): void {
    if ( scan.status === 'NOT_OCR_PROCESSED' ) {
      console.log('Starting processing');
      scan.status = 'OCR_PROCESSING';
      this.locdbService.triggerOcrProcessing(scan._id).subscribe(
        (message) => scan.status = 'OCR_PROCESSED'
      )
    } else {
      this.selectedTodo = scan;
      console.log('Todo item selected', scan._id);
      this.todo.next(scan);
    }
  }

  ngOnInit() {
    console.log('Retrieving TODOs from backend');
    this.fetchScans();
  }

  fetchScans() {
    console.log('Fetching todo scans from backend');
    // this.locdbService.getToDo(true).subscribe( (todos) => {this.scans = TodoComponent.extractScans(<ToDo[]>todos);
    //   console.log('fetch scans', todos);
    // } );
    // this.locdbService.getToDo(false).subscribe( (todos) => {this.unprocessed = TodoComponent.extractScans(<ToDo[]>todos)} );
        this.locdbService.getToDo(true).subscribe( (todos) => {this.todolist = <ToDo[]>todos} );
        this.locdbService.getToDo(false).subscribe( (todos) => {this.unprocessed = <ToDo[]>todos} );
  }

  all_todos() {
    return this.todolist.concat(this.unprocessed);
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

  printit(a: any) {
    console.log('----------------------------------------');
    console.log(a);
  }

  onclickheading() {
    console.log('asd');
  }

}

class ScanEntries {
  scans: ToDoScans[] = [];
  rootresourceid: string;
  isCollapsed = true;
  constructor(r: string) {
    this.rootresourceid = r;
  }
}
