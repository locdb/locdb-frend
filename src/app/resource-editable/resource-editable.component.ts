import { Component, OnInit, Input } from '@angular/core';
import { BibliographicResource, ProvenResource, ToDo } from '../locdb';


/* What was View Encapsulation for? */

@Component({
  selector: 'app-resource-editable',
  templateUrl: './resource-editable.component.html',
  styleUrls: ['./resource-editable.component.css'],
})
export class ResourceEditableComponent implements OnInit {
  @Input() resource: BibliographicResource | ProvenResource | ToDo = null;
  @Input() editing = false;

  constructor() { }

  ngOnInit(){ }


  showForm(val: boolean) {
    // Display the form or stop displaying it
    this.editing = val;
  }


}
