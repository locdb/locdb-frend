import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { TypedResourceView } from '../locdb';


// DO WE REALLY NEED THIS wrapper?



/* Key idea:
 *
 * Provide a form for one resource at a time, but retain a reference to an 'alternate'.
 * The 'alternate' resource is the container resource (parent) if the child is active and vice versa
 */
@Component({
  selector: 'app-resource-pair-form',
  templateUrl: './resource-pair-form.component.html',
  styleUrls: ['./resource-form.component.css']
})
export class ResourcePairFormComponent implements OnInit {

  @Input() resource: TypedResourceView;
  @Input() alternate: TypedResourceView;

  activeResource: TypedResourceView;

  @Output() resourceChange = new EventEmitter<TypedResourceView>();
  @Output() alternateChange = new EventEmitter<TypedResourceView>();

  constructor() { }

  ngOnInit() {

  }

  onResourceChange() {

  }

  onAlternateChange() {

  }

}

