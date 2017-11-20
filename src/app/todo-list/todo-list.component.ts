import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { BibliographicResource, ToDo, ToDoParts, ToDoScans, ToDoStates } from '../locdb';
import { LocdbService } from '../locdb.service';
import { Provenance } from '../locdb';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnChanges {

  @Input() state: ToDoStates;
  @Output() todo: EventEmitter<ToDoScans | BibliographicResource> = new EventEmitter();
  @Output() resourceTrack: EventEmitter<BibliographicResource[] | ToDo[]> = new EventEmitter();
  todos: ToDo[];
  states = ToDoStates;
  provenance = Provenance;
  loading = false;
  constructor(private locdbService: LocdbService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.loading = true;
    this.todos = [];
    this.locdbService.getToDo(this.state).subscribe(
      (todos) => { this.todos = todos; this.loading = false },
      (err) => { this.loading = false; }
    );
  }


  deleteScan(scan: ToDoScans, parent: ToDo | ToDoParts) {
    console.log('Deleting scan', scan);
    this.locdbService.deleteScan(scan).subscribe(
      (success) => {
        parent.scans.splice(parent.scans.indexOf(scan), 1);
        console.log('scan', scan, 'deleted');
      },
      (error) => {
        console.log('error deleting scan', scan);
      }
    );
  }


  refresh() {
    this.ngOnChanges();
  }


  onSelectScan(scan: ToDoScans, resource: BibliographicResource[] | ToDo[]) {
    // called when pressing on a scan todo item
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
      console.log("resourceTrack: ", resource)
      this.resourceTrack.next(resource)
    }
  }

  onSelectExternal(resource: ToDo) {
    // called when pressing on an external todo item
    console.log('onselect external')
    this.todo.next(resource);
  }


  emit(scanOrResource: ToDoScans | ToDo) {
    this.todo.next(scanOrResource);
  }

  // 2 methods to delete after chagnes
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

  guard(t: ToDo) {
    /* is there anything to display? */
    if (!t) { return false; }
    if (t.parts && t.parts.length) { return true; }
    if (t.scans && t.scans.length) { return true; }
    if (t.children) {
      // any children satisfies condition above?
      return !t.children.every((child) => !this.guard(child));
    }
    return false;
  }
}
