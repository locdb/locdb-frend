import {
    models,
    TypedResourceView,
    enums,
    enum_values,
    isoFullDate
} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';

@Component( {
    selector: 'app-resource-form',
    templateUrl: './resource-form.component.html',
    styleUrls: ['./resource-form.component.css']
})

export class ResourceFormComponent implements OnInit, OnChanges  {

    // if this is a string, we can try to dereference it from the back-end

    @Input() resources: [TypedResourceView, TypedResourceView];
    @Output() resourcesChange = new EventEmitter<[TypedResourceView, TypedResourceView]>();

    // this should not be here, the resource should only rely on itself and not
    // some entries TODO FIXME
    // @Input() exSuggests: any[];
    @Input() selected = false;
    @Output() submitStatus: EventEmitter<boolean> = new EventEmitter();

    submitted = true;
    submitting = false; // tracks submission status to disable button


    constructor(
        private locdbService: LocdbService
    ) { }

    ngOnInit()  {
    }

    ngOnChanges()  {
        // console.log("ngOnChanges", this.resources[0]);
    }

    onSubmit(resourceCopy) {

      console.log("trigger resource form")
        // need to first store locally until saved
        this.submitting = true;
        this.locdbService.maybePutResource(resourceCopy).subscribe(
            (r) =>  {
                // here better than this.resource = r, since reference is retained
                Object.assign(this.resources[0], r);
                this.ngOnChanges();
                this.submitting = false;
                this.submitted = true;
                this.submitStatus.emit(false);

            },
            (err) => { console.log('error submitting resource', err) ;
                this.submitting = false });

        if(!this.checkParent(this.resources[1], resourceCopy)){
          console.log("requesting new parent")
          this.locdbService.bibliographicResource(resourceCopy.partOf).subscribe(
            (trv) => {
              // is null parent correct here or should we also retrieve it
              this.resources[1] = trv
            },
            (err) => { console.log('Invalid resourceCopy.partOf', resourceCopy.partOf) });
        }
    }

    cancel() {
        this.submitted = true; // effectively closes the form
        this.submitStatus.emit(false)
    }

    checkParent(parent: TypedResourceView, resource: TypedResourceView) {
      if (parent){
        if (resource.partOf){
          console.log(parent, resource)
          return resource.partOf ==  parent._id
        }
        else{
          return false
        }
      }
      else {
        if (resource.partOf){
          return false
        }
        else{
          return true
        }
      }
    }


    deleteResource() {
        // Deletes the whole currently selected resouces
        if (confirm('Are you sure to delete resource ' + this.resources[0]._id)) {
            this.locdbService.deleteBibliographicResource(this.resources[0]).subscribe(
                (res) => {console.log('Deleted'); this.resources[0] = null;}, // this.resourceChange.emit(this.resources[0])},
                (err) => {alert("Error deleting resource " + this.resources[0]._id)}
            );
        }

    }

    showForm(val: boolean) {
        // Display the form or stop displaying it
        this.submitted = !val;
    }

    short() {
        // A shorthand name for accordion heading
        if (this.resources[0]) {
            // resource already present
            const br = this.resources[0];
            let s = br.title;
            if (br.publicationDate) {
                s += ` (${br.publicationDate})`
            }
            if (br.status === 'EXTERNAL') {
                s += ` [${br.type}]`
            }
            return s;
        }
    }

}
