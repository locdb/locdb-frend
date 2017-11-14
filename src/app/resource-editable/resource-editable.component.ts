import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
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
  selector: 'locdb-resource-editable',
  templateUrl: './resource-editable.component.html',
  styleUrls: ['./resource-editable.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResourceEditableComponent implements OnInit {

  @Input() resource: BibliographicResource | ProvenResource | ToDo = null;
  @Input() selected: boolean;
  submitted = false

  constructor() { }

  ngOnInit() {
    console.log("", this.selected)
  }

showForm(val: boolean) {
    // Display the form or stop displaying it
    this.submitted = !val;
    console.log("", this.selected)
}


}
