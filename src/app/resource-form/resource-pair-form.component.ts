import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { TypedResourceView, models } from '../locdb';
import { BibliographicResourceService, } from '../typescript-angular-client/api/api';

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

  // Detemine whether 'resource' or 'alternate' is active
  alternateIsActive = false;

  @Output() resourceChange = new EventEmitter<TypedResourceView>();
  @Output() alternateChange = new EventEmitter<TypedResourceView>();

  constructor(private brService: BibliographicResourceService) { }

  ngOnInit() {
  }

  onResourceChange(event: TypedResourceView) {
    this.resource = event;
    this.resourceChange.emit(event);
  }

  onAlternateChange(event: TypedResourceView) {
    this.alternate = event;
    this.alternateChange.emit(event);
  }

  toggleAlternate() {
    this.alternateIsActive = !this.alternateIsActive;
  }


  fixPartOf () {
    /* Link
     *
     */

    // guard
    if (!this.resource || !this.alternate) { return; }
    if (!this.alternate._id) { alert('Please migrate the container first.'); return; }

    // link resource to its container
    this.resource.data.partOf = this.alternate._id;
    this.brService.update(this.resource._id, <models.BibliographicResource>this.resource.data).subscribe(
      (response) => { this.resource = new TypedResourceView(response); },
      (error) => { alert('An unexpected error occurred: ' + error.msg) }
    )
  }

}

