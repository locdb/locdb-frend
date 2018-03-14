import { Component, Input, Output, EventEmitter} from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';
import { LocdbService } from '../locdb.service';


@Component({
  selector: 'app-embodiment',
  templateUrl: './embodiment.component.html',
  providers: [ LocdbService ],
  styleUrls: ['./embodiment.component.css']
})
export class TodoComponent {
  @Input() todo : TypedResourceView;
  @Output() scan: EventEmitter<[models.ResourceEmbodiment, models.Scan]> = new EventEmitter();
  @Output() references: EventEmitter<Array<models.BibliographicEntry>> = new EventEmitter();

  constructor() {}


  inspectReferences(){
    this.references.emit(this.todo.parts);
  }

  inspectScan(embodiment_scan: [models.ResourceEmbodiment, models.Scan]) {
    this.scan.emit([embodiment_scan[0], embodiment_scan[1]]);
  }


}
