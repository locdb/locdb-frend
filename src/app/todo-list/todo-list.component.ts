import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { BibliographicResource, ToDo, ToDoParts, ToDoScans, TypedResourceView} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Provenance, enums } from '../locdb';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnChanges {

  @Input() state: enums.status;
  @Output() todo: EventEmitter<ToDoScans | BibliographicResource> = new EventEmitter();
  @Output() resourceTrack: EventEmitter<BibliographicResource[] | ToDo[]> = new EventEmitter();
  todos: ToDo[];
  provenance = Provenance;
  loading = false;
  selectedResource : TypedResourceView;

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


  deleteScan(scan: ToDoScans, parent: ToDoParts) {
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


  onSelectScan(scan: ToDoScans, trace: BibliographicResource[] | ToDo[]) {
    // called when pressing on a scan todo item
    if ( scan.status === enums.status.notOcrProcessed ) {
      console.log('Starting processing');
      scan.status = enums.status.ocrProcessing;
      this.locdbService.triggerOcrProcessing(scan._id).subscribe(
        (success) => scan.status = enums.status.ocrProcessed,
        (err) => console.log(err)
      )
    } else {
      console.log('Todo item selected', scan);
      this.todo.next(scan);
      console.log('resourceTrack: ', trace)
      this.resourceTrack.next(trace)
    }
  }

  onSelectExternal(resource: ToDo, trace: BibliographicResource[]) {
    // called when pressing on an external todo item
    console.log('onselect external');
    this.todo.next(resource);
    this.resourceTrack.next(trace);
  }


  emit(scanOrResource: ToDoScans | ToDo) {
    this.todo.next(scanOrResource);
  }

  onSelect(br?: TypedResourceView): void {
      this.selectedResource = br;
    }

  // 2 methods to delete after chagnes
  printState(scan: ToDoScans) {
    if (scan.status === enums.status.ocrProcessed) { return 'OCR processed' } ;
    if (scan.status === enums.status.notOcrProcessed) { return  'not OCR processed '};
    if (scan.status === enums.status.ocrProcessing) { return 'OCR processing' };
    if (scan.status === enums.status.external)  { return 'external' };
    return scan.status
  }

  trimHash(identifier: string) {
    // heuristic :)
    return identifier.slice(0, 7);
  }

  guard(t: ToDo | ToDoParts ) {
    /* Guard needs rework */
    /* is there anything to display? */
    if (!t) { return false; }
    // if (t.parts && t.parts.length) { return true; }
    if ((<ToDoParts>t).scans && (<ToDoParts>t).scans.length) { return true; }
    if ((<ToDo>t).children) {
      // any children satisfies condition above?
      return !(<ToDo>t).children.every((child) => !this.guard(child));
    }
    return false;
  }}
