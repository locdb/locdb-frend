import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { BibliographicResource, TypedResourceView, ResourceEmbodiment} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Provenance, enums, MetaData, enum_values, models} from '../locdb';

interface Tracking {
  [key: string ]: boolean;
}

type ScanContext = [TypedResourceView, TypedResourceView, models.ResourceEmbodiment] | [TypedResourceView, models.ResourceEmbodiment ]
type RefsContext = [TypedResourceView, TypedResourceView] | [TypedResourceView]




@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit, OnChanges {
  @Output() refsWithContext: EventEmitter<[Array<models.BibliographicEntry>, RefsContext] | null> = new EventEmitter();
  @Output() scanWithContext: EventEmitter<[models.Scan, ScanContext] | null> = new EventEmitter()
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
    this.tracking[enums.status.valid] = true;
    this.tracking[enums.status.notOcrProcessed] = false;
    this.tracking[enums.status.ocrProcessing] = false;
  }

  ngOnChanges() {
    this.todos = [];
    let statuses: Array<enums.status> = [];
    for (const status in this.tracking) {
      if (this.tracking[status]) {
        statuses.push(<enums.status>status);
      }
    }
    this.locdbService.getAgenda(statuses).subscribe(
      (todos) => { this.todos = todos; this.loading = false },
      (err) => { this.loading = false; }
    );
  }


  refresh() {
    this.ngOnChanges();
  }

  inspectRefs(resource:TypedResourceView, parent?:TypedResourceView) {
    if (parent){
      this.refsWithContext.emit([resource.parts, [parent, resource]]);
    } else {
      this.refsWithContext.emit([resource.parts, [resource]])
    }
  }

  inspectScan(scan: models.Scan, embodiment: models.ResourceEmbodiment,
              resource: TypedResourceView, parent?: TypedResourceView) {
    if (parent) {
      this.scanWithContext.emit([scan, [parent, resource, embodiment]])
    } else {
      this.scanWithContext.emit([scan, [resource, embodiment]])
    }
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
