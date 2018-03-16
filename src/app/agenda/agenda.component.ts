import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { LocdbService } from '../locdb.service';
import { TypedResourceView, enums, enum_values, models} from '../locdb';
import { TodoComponent } from './todo.component'

interface Tracking {
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
  todos: TypedResourceView[];
  // provenance = Provenance;
  loading = false;
  // selectedResource : TypedResourceView;
  tracking: Tracking = {};
  statuses: Array<string> = enum_values(enums.status);
  title = "Agenda";

  constructor(private locdbService: LocdbService) { }

  ngOnInit() {
    this.loading = true;
    // reasonable defaults
    this.tracking[enums.status.ocrProcessed] = true;
    this.tracking[enums.status.external] = true;
    this.tracking[enums.status.valid] = false;
    this.tracking[enums.status.notOcrProcessed] = false;
    this.tracking[enums.status.ocrProcessing] = false;
  }

  ngOnChanges() {
    console.log("Fetching Todos from Backend");
    this.todos = [];
    let statuses: Array<enums.status> = [];
    for (const status in this.tracking) {
      if (this.tracking[status]) {
        statuses.push(<enums.status>status);
      }
    }
    this.locdbService.getToDo(statuses).subscribe(
      (todos) => { this.todos = todos; this.loading = false },
      (err) => { this.loading = false; }
    );
  }


  refresh() {
    this.ngOnChanges();
  }

  inspectRefs(resource:TypedResourceView, parent?:TypedResourceView) {
    this.refsWithContext.emit([resource.parts, { mode: 'refs', source: resource, parent: parent || null}]);
  }

  inspectScan(scan: models.Scan, embodiment: models.ResourceEmbodiment,
              resource: TypedResourceView, parent?: TypedResourceView) {
    this.scanWithContext.emit([scan, { mode: 'scan', source: resource, embodiment: embodiment, parent:parent || null }])
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
