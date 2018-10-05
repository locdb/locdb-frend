import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { LocdbService } from '../locdb.service';
import { TypedResourceView, enums, enum_values, models} from '../locdb';
import { TodoComponent } from './todo.component'
import { ActivatedRoute, Router } from '@angular/router';

export interface Tracking {
  [key: string ]: boolean;
}



export interface Context {
  mode: 'refs' | 'scan';
  parent: TypedResourceView | null;
  source: TypedResourceView;
  embodiment?: models.ResourceEmbodiment;
}


@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit, OnChanges {
  @Output() refsWithContext: EventEmitter<[Array<models.BibliographicEntry>, Context]> = new EventEmitter();
  @Output() scanWithContext: EventEmitter<[models.Scan, Context]> = new EventEmitter()
  @Input() set routerTracking(rtracking: Tracking){
    console.log('rt: ', rtracking)
    if(!(typeof rtracking === 'undefined')){
      this.loading = true;
      this.tracking[enums.status.ocrProcessed] = rtracking[enums.status.ocrProcessed];
      this.tracking[enums.status.external] = rtracking[enums.status.external]
      this.tracking[enums.status.valid] = false;
      this.tracking[enums.status.notOcrProcessed] = rtracking[enums.status.notOcrProcessed]
      this.tracking[enums.status.ocrProcessing] = rtracking[enums.status.ocrProcessing]
      this.fetchTodos()
    }
  }
  todos: TypedResourceView[];
  // provenance = Provenance;
  loading = false;
  // selectedResource : TypedResourceView;
  tracking: Tracking = {};
  statuses: Array<string> = enum_values(enums.todoStatus);
  title = 'Agenda';

  /* A human-readable version of our internal statuses */
  statusMap = {};

  constructor(private locdbService: LocdbService, private router: Router, private route: ActivatedRoute) {
    this.statusMap = {};
    this.statusMap[enums.status.valid] = 'Validated';
    this.statusMap[enums.status.notOcrProcessed] = 'Waiting';
    this.statusMap[enums.status.ocrProcessing] = 'In Queue';
    this.statusMap[enums.status.ocrProcessed] = 'Ready';
    this.statusMap[enums.status.external] = 'Electronic Journals';
  }

  ngOnInit() {

  }

  ngOnChanges() {
  }

  fetchTodos() {
    console.log('Fetching Todos from Backend', this.tracking);
    this.todos = [];
    const statuses: Array<enums.status> = [];
    for (const status in this.tracking) {
      if (this.tracking[status]) {
        statuses.push(<enums.status>status);
      }
    }
    this.locdbService.getToDo(statuses).subscribe(
      (todos) => { this.todos = this.sortChildrenByPage(todos); this.loading = false; console.log('Todos', todos) },
      (err) => { console.log(err); this.loading = false; }
    );
  }

  sortChildrenByPage(todos: Array<TypedResourceView>) {
    for (const todo of todos) {
      if (todo.children) {
        // in-place sort
        todo.children.sort((a, b) => a.embodiedAs[0].firstPage - b.embodiedAs[0].firstPage);
      }
    }
    return todos;
  }


  refresh(status) {

    console.log('status: ', status);
    this.tracking[status] = !this.tracking[status]
    const queryParams = {
      NOT_OCR_PROCESSED: this.tracking['NOT_OCR_PROCESSED'],
      OCR_PROCESSING: this.tracking['OCR_PROCESSING'],
      OCR_PROCESSED: this.tracking['OCR_PROCESSED'],
      EXTERNAL: this.tracking['EXTERNAL']
    }
    this.router.navigate(['/resolve/'], {queryParams: queryParams});
    this.fetchTodos()
  }

  inspectRefs(resource: TypedResourceView) {
    // this.refsWithContext.emit([resource.parts, { mode: 'refs', source: resource, parent: parent || null}]);
    this.router.navigate(['/linking/RefsInspector/', resource._id]);
  }

  inspectScan(scan: models.Scan, resource: TypedResourceView) {
    // this.scanWithContext.emit([scan, { mode: 'scan', source: resource, embodiment: embodiment, parent:parent || null }])
    console.log('[debug] in agenda.inspectScan: scan:', scan,  'resource:', resource);
    this.router.navigate(['/linking/ScanInspector/', resource._id, scan._id]);
  }


  // guard(t: ToDo | ToDoParts ) {
  //   /* Guard needs rework */
  //   /* is there anything to display? */
  //   if (!t) { return false; }
  //   // if (t.parts && t.parts.length) { return true; }
  //   if ((<ToDoParts>t).scans && (<ToDoParts>t).scans.length) { return true; }
  //   if ((<ToDo>t).children) {
  //     // any children satisfies condition above?
  //     return !(<ToDo>t).children.every((child) => !this.guard(child));
  //   }
  //   return false;
  // }
}
