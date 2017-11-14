import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {
    BibliographicResource,
    BibliographicEntry,
    ProvenResource,
    AgentRole,
    ResponsibleAgent,
    ToDo,
    ROLES,
    Identifier,
    RESOURCE_TYPES
} from '../locdb';

@Component({
  selector: 'locdb-resource-accordion-group',
  templateUrl: './resource-accordion-group.component.html',
  styleUrls: ['./resource-accordion-group.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResourceAccordionGroupComponent implements OnInit {

  @Input() resources: BibliographicResource[] | ProvenResource[] | ToDo[] = null;
 selectedResource = null
  constructor() { }

  ngOnInit() {
  }


  onSelect(br?: ProvenResource): void {
          console.log('Suggestion emitted', br);
          this.selectedResource = br;
          //this.committed = false;
          //this.suggest.emit(br);
      }
}
