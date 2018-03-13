import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { BibliographicResource, ToDo, TypedResourceView, ResourceEmbodiment} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Provenance, enums, MetaData } from '../locdb';

interface Tracking {
  [key: string ]: boolean;
}

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit, OnChanges {

  @Output() resourceTrack: EventEmitter<MetaData[]> = new EventEmitter();
  todos: ToDo[];
  provenance = Provenance;
  loading = false;
  selectedResource : TypedResourceView;
  tracking: Tracking = {};

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
  }
}
