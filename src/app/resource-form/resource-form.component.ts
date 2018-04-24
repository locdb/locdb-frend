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
    @Input() resource: TypedResourceView //BibliographicResource | ProvenResource | ToDo = null;
    @Output() resourceChange = new EventEmitter<TypedResourceView>();

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
        console.log("ngOnChanges", this.resource);
    }

    onSubmit(resourceCopy) {
        // need to first store locally until saved
        this.submitting = true;
        this.locdbService.maybePutResource(resourceCopy).subscribe(
            (r) =>  {
                // here better than this.resource = r, since reference is retained
                Object.assign(this.resource, r);
                this.ngOnChanges();
                this.submitting = false;
                this.submitted = true;
                this.submitStatus.emit(false);

            },
            (err) => { console.log('error submitting resource', err) ;
                this.submitting = false });
    }

    cancel() {
        this.submitted = true; // effectively closes the form
        this.submitStatus.emit(false)
    }


    deleteResource() {
        // Deletes the whole currently selected resouces
        if (confirm('Are you sure to delete resource ' + this.resource._id)) {
            this.locdbService.deleteBibliographicResource(this.resource).subscribe(
                (res) => {console.log('Deleted'); this.resource = null; this.resourceChange.emit(this.resource)},
                (err) => {alert("Error deleting resource " + this.resource._id)}
            );
        }

    }

    showForm(val: boolean) {
        // Display the form or stop displaying it
        this.submitted = !val;
    }

    short() {
        // A shorthand name for accordion heading
        if (this.resource) {
            // resource already present
            const br = this.resource;
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
