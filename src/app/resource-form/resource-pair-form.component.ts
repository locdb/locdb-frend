import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { TypedResourceView, models } from '../locdb';
import { LocdbService } from '../locdb.service';
import { BibliographicResourceService, } from '../typescript-angular-client/api/api';

/* Typeahead for changing the container */
import { Observable } from 'rxjs/Rx'
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
// import { PublisherPipe } from '../pipes/publisher.pipe';
// import { StandardPipe } from '../pipes/type-pipes';
import { ContainerPipe } from '../pipes/container.pipe';

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

  // Keep the last alternate stored, so that we can go back
  lastAlternate: TypedResourceView;

  // Detemine whether 'resource' or 'alternate' is active
  alternateIsActive = false;
  // Show input field to link to another container
  isLinking = false;
  // Show spinning wheel
  isLoading = false;
  // data source for container suggestions
  dataSource:  Observable<any>;
  // The initial value for changing containers
  typeaheadPlaceholder = 'Search for containers, press enter to confirm.';
  // The value (double-bound) input field
  asyncSelected = '';



  @Output() resourceChange = new EventEmitter<TypedResourceView>();
  @Output() alternateChange = new EventEmitter<TypedResourceView>();

  constructor(private brService: BibliographicResourceService,
  private locdbService: LocdbService) {
    this.dataSource = Observable.create((observer: any) => {
      // runs on every search
      observer.next(this.asyncSelected)
    }).mergeMap((token: string) => this.getStatesAsObservable(token)).map( r =>
      r.map( pair => new TypeaheadObj(pair[0], pair[1]))
    )
  }


  ngOnInit() {
  }

  onResourceChange(event: TypedResourceView) {
    this.resource = event;
    this.resourceChange.emit(event);
  }

  onAlternateChange(event: TypedResourceView) {
    console.log('On Alternate Change:', event);
    this.alternate = event;
    this.alternateChange.emit(event);
  }

  getStatesAsObservable(token: string): Observable<any> {
    return this.locdbService.suggestionsByQuery(token, false, 0);
  }

  typeaheadOnSelect(e: TypeaheadMatch) {
    console.log('typeaheadOnSelect', e);
    this.brService.get(e.item.id).subscribe(
      (resource) => this.alternate = new TypedResourceView(resource),
      (error) => alert('Could not retrieve container data.')
    )
    this.isLinking = false;
  }

  toggleAlternate() {
    this.alternateIsActive = !this.alternateIsActive;
  }


  fixPartOf () {
    /* Link resource to its container
     * The container is either stored as 'alternate' already, or if 'alternate' is null, it will be cleared.
     */

    // guard
    if (!this.resource) { return; }
    if (!this.resource._id) { alert('Please migrate the resource first.'); return; }

    // if alternate is not present, the resource should be marked standalone
    let targetId = '';

    if (!!this.alternate) {
      // alternate resource is present, make partOf point to this.
      if (!this.alternate._id) { alert('Please migrate the container first.'); return; }
      targetId = this.alternate._id;
    }

    const oldPartOf = this.resource.data.partOf;

    // link resource to its container


    // ONLY change the partof property ( + add type which is mandatory always )
    const updates: models.BibliographicResource = { type: this.resource.type, partOf: targetId }



    this.isLoading = true;
    this.brService.update(this.resource._id, updates).subscribe(
      (response) => { this.resource = new TypedResourceView(response); this.isLoading = false; },
      (error) => {
        alert('An unexpected error occurred: ' + error.message);
        // undo changes on error, such that user can try again.
        this.resource.data.partOf = oldPartOf;
        this.isLoading = false;
      }
    )
  }

  createNewContainer() {
    this.alternate = new TypedResourceView({});
  }

  disconnectFromAlternate() {
    this.alternateIsActive = false;
    this.lastAlternate = this.alternate;
    this.alternate = null;
  }

  reconnectToLastAlternate() {
    this.alternate = this.lastAlternate;
    this.lastAlternate = null;
  }

}

class TypeaheadObj {
   id: string;
   name: string;

   constructor(resource: TypedResourceView, container: TypedResourceView | null) {
     // Here is important logic
     // The goal is to identify possible containers
     if (!container) {
       // When no parent is give, the child is a stand-alone which can be a potential container
       this.id = resource._id;
       this.name = resource.toString();
       if (resource.publicationDate) {
         this.name = resource.publicationDate.getFullYear() + ' - ' + this.name;
       }
     } else {
       // Both resource and container are given.
       // In this case, the child **MAY NOT BE** a container
       // because we are dealing with a two level hierarchy.
       this.id = container._id;
       this.name = container.toString();
       if (container.publicationDate) {
         this.name = container.publicationDate.getFullYear() + ' - ' + this.name;
       }
     }
   }

   public toString (): string {
      return this.name;
   }
}
