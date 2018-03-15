import { Component, Input, Output, EventEmitter} from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';
import { LocdbService } from '../locdb.service';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  providers: [ LocdbService ],
})
export class TodoComponent {
  @Input() todo : TypedResourceView;
  @Output() scan: EventEmitter<[models.ResourceEmbodiment, models.Scan]> = new EventEmitter();
  @Output() refs: EventEmitter<Array<models.BibliographicEntry>> = new EventEmitter();

  constructor() {}


  inspectReferences(){
    this.refs.emit(this.todo.parts);
  }

  inspectScan(embodiment_scan: [models.ResourceEmbodiment, models.Scan]) {
    this.scan.emit([embodiment_scan[0], embodiment_scan[1]]);
  }


}
