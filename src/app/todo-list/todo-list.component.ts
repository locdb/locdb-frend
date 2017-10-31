import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ToDo, ToDoScans, ToDoStates } from '../locdb';
import { LocdbService } from '../locdb.service';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['../locdb.css', './todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnChanges {

  @Input() state: ToDoStates;
  @Output() todo: EventEmitter<ToDoScans> = new EventEmitter();
  todos: ToDo[];
  loading = false;
  constructor(private locdbService: LocdbService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.loading = true;
    this.todos = [];
    this.locdbService.getToDo(this.state).subscribe(
      (todos) => { this.todos = todos; this.loading = false }
    );
  }

  reload() {
    this.ngOnChanges();
  }


  printState(scan: ToDoScans) {
    if (scan.status === ToDoStates.ocr) { return 'OCR processed' } ;
    if (scan.status === ToDoStates.nocr) { return  'not OCR processed '};
    if (scan.status === ToDoStates.iocr) { return 'OCR processing' };
    if (scan.status === ToDoStates.ext)  { return 'external' };
    return scan.status
  }

  trimHash(identifier: string) {
    // heuristic :)
    return identifier.slice(0, 7);
  }

  onSelect(todoscan: any) {
    this.todo.next(todoscan);
  }

}
