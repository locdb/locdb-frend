import {
    BibliographicResource,
    BibliographicEntry,
    ProvenResource,
    AgentRole,
    ResponsibleAgent,
    ToDo,
    ROLES,
    Identifier,
    ToDoResource,
    RESOURCE_TYPES
} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component( {
    selector: 'app-resource-form',
    templateUrl: './resource-form.component.html',
    styleUrls: ['./resource-form.component.css']
})

export class ResourceFormComponent implements OnInit, OnChanges  {

    // if this is a string, we can try to dereference it from the back-end
    @Input() resource: BibliographicResource | ProvenResource | ToDoResource = null;

    // this should not be here, the resource should only rely on itself and not
    // some entries TODO FIXME
    // @Input() exSuggests: any[];
    @Input() selected = false;
    @Output() submitStatus: EventEmitter<boolean> = new EventEmitter();
    oldresource: BibliographicResource;

    resourceForm: FormGroup;
    embodiments: FormGroup[] = [];
    submitted = true;

    submitting = false; // tracks submission status to disable button
    parts: FormGroup[] = [];



    // roles: string[] = ['CORPORATE','PUBLISHER', 'author']; // <-- to Locdb.ts as class?
    // roles: string[] = AgentRole.ROLES;
    roles: string[] =  ROLES;
    resourceTypes: string[] = RESOURCE_TYPES;

    constructor(
        private fb: FormBuilder,
        private locdbService: LocdbService
    ) { this.createForm(); }

    createForm()  {
        this.resourceForm = this.fb.group( {
            title: '',
            resourcetype: '',
            subtitle: '',
            edition: '',
            resourcenumber: '',
            publicationyear: '',
            // partof: '',
            containerTitle: '',
            contributors: this.fb.array([]),
            identifiers: this.fb.array([]),
        });
    }

    ngOnInit()  {
        // if (!this.resource && this.resource_id)  {
        //     // if resource is not initialised itself but an id is given
        //     // try to retrieve resource by id from the back-end
        //     console.log('Fetching resource', this.resource_id, 'from back-end.');
        //     this.locdbService.bibliographicResource(this.resource_id).subscribe(
        //         (res) =>  { this.resource = res }
        //     );
        // }
    }

    // clean array treatment
    setContributors(roles: AgentRole[]) {
        const contribFGs = roles ? roles.map(
            arole => this.fb.group(
                {role: arole.roleType, name: arole.heldBy.nameString }
            )
        ) : [];
        const contribFormArray = this.fb.array(contribFGs);
        this.resourceForm.setControl('contributors', contribFormArray);
    }

    get contributors(): FormArray {
        return this.resourceForm.get('contributors') as FormArray;
    }

    addContributor() {
        // reference from getter above
        this.contributors.push(this.fb.group({role: '', name: ''}));
    }

    removeContributor(index: number) {
        this.contributors.removeAt(index);
    }

    // clean array treatment end
    setIdentifiers(ids: Identifier[]) {
        const identsFGs = ids ? ids.map(
            identifier => this.fb.group(
                {literalValue: identifier.literalValue,
                    scheme: identifier.scheme }
            )
        ) : [];
        const idsFormArray = this.fb.array(identsFGs);
        this.resourceForm.setControl('identifiers', idsFormArray);
    }

    get identifiers(): FormArray {
        return this.resourceForm.get('identifiers') as FormArray;
    }

    addIdentifier() {
        // reference from getter above
      this.identifiers.push(this.fb.group({scheme: '', literalValue: ''}));
    }

    removeIdentifier(index: number) {
        this.identifiers.removeAt(index);
    }

    ngOnChanges()  {
        if (!this.resource) {
            return; // only resource identifier given for now
        }
        this.resourceForm.reset( {
            title: this.resource.title,
            subtitle: this.resource.subtitle,
            resourcetype: this.resource.type,
            edition: this.resource.edition,
            resourcenumber: this.resource.number,
            publicationyear: this.resource.publicationYear,
            containerTitle: this.resource.containerTitle
        });
        // new clean set contribs
        this.setContributors(this.resource.contributors);
        this.setIdentifiers(this.resource.identifiers);
    }

    onSubmit() {
        // need to first store locally until saved
        this.submitting = true;
        const resourceCopy = this.prepareSaveResource();
        this.locdbService.maybePutResource(resourceCopy).then(
            r =>  {
                this.resource = r;
                this.ngOnChanges();
                this.submitting = false;
                this.submitted = true;
                this.submitStatus.emit(false);

            }
        ).catch(err => this.submitting = false);
    }

    revert() {
        this.ngOnChanges()
    }


    cancel() {
        this.submitted = true; // effectively closes the form
        this.submitStatus.emit(false)
    }

    reconstructAgentRole(name: string, role: string): AgentRole {
        const agentRole = {
            identifiers: [],
            roleType: role,
            heldBy: {
                identifiers: [],
                roleType: role,
                givenName: '',
                familyName: '',
                nameString: name,
            }
        }
        return agentRole;
    }

    reconstructIdentifier(scheme: string, value: string): Identifier {
      const identifier = {
        scheme: scheme,
        literalValue: value,
      }
      return identifier;
    }

    prepareSaveResource(): BibliographicResource  {
        // Form values need deep copy, else shallow copy is enough
        const formModel = this.resourceForm.value;
        const contributors: AgentRole[] = []
        const contribsDeepCopy = formModel.contributors.map(
            (elem: {name: string, role: string }) => this.reconstructAgentRole(elem.name, elem.role)
        );
        const identsDeepCopy = formModel.identifiers.map(
          (id: {scheme: string, literalValue: string} ) => this.reconstructIdentifier(id.scheme, id.literalValue)
        );
        const resource: BibliographicResource =  new BibliographicResource({
            _id: this.resource._id,
            identifiers: identsDeepCopy,
            type: formModel.resourcetype as string || '',
            title: formModel.title as string || '',
            subtitle: formModel.subtitle as string || '',
            edition: formModel.edition as string || '',
            containerTitle: formModel.containerTitle as string || '',
            number: formModel.resourcenumber as string || '',
            contributors: contribsDeepCopy,
            publicationYear: formModel.publicationyear as string || '',
            // partOf: formModel.partof as string || '',
            // warning: retain internal identifiers (dont show primary keys to the user)
            // not editable, but copied values
            partOf: this.resource.partOf,
            embodiedAs: this.resource.embodiedAs,
            parts: this.resource.parts,
            cites: this.resource.cites,
            status: this.resource.status
        });
        return resource;
    }

    // ** THE FOLLOWING CODE MIGHT GO TO SUGGESTIONS **
    // loadExtenalSuggestions() {
    //     // search for external Suggestions with entry emitted by app-display (current active entry)
    //     console.log('[ResourceForm] loadExtenalSuggestions(): ', this.entry);
    //     const searchentry = JSON.parse(JSON.stringify(this.entry));
    //     // set new title to search with
    //     searchentry.ocrData.title = this.resourceForm.value.title;
    //     console.log('[ResourceForm] loadExtenalSuggestions(): ',
    //         this.resourceForm.value.title, '; searchentry.ocrData.title',
    //         searchentry);
    //     this.locdbService.suggestions(searchentry, true).subscribe( (sgt) => this.saveExternal(sgt) );
    // }
    // inMerge(r: any) {
    //     // empty fields are filled with information from selected external resource if possible
    //     console.log('[ResourceForm] inMerge(): ', this.resource, '; Clicked External Entry: ',  r);
    //     /* ---------------------*/
    //     // depending on import type (BibResource/ocrData) two differend imports
    //     // BibResource
    //     const title = r.title;
    //     const authors = [];
    //     for (const contributor of r.contributors) {
    //         const name = contributor.heldBy.nameString;
    //         let role = contributor.roleType;
    //         if (ROLES.indexOf(role) >= 0) {
    //             console.log('Role of external Resource found');
    //         } else {
    //             role = 'author';
    //         }
    //         authors.push( {name: name, role: role});
    //     }

    //     if (this.resourceForm.value.title === '') {
    //         this.resourceForm.patchValue( {
    //             title: title,
    //         });
    //     }
    //     // add authors if not in list already
    //     for (const author of authors) {
    //         const name = author.name; // author for ocrData.authors
    //         const role = author.role; // dummy for ocrData

    //         let isListed = false;

    //         for (const con of this.contributorsForms) {
    //             if (con.value.name === name) {
    //                 isListed = true;
    //                 break;
    //             }
    //         }
    //         if (!isListed) {
    //             // this.resourceForm.patchValue( {});
    //             const conForm: FormGroup =  this.fb.group( {
    //                 role: role,
    //                 name: name,
    //             })
    //             this.contributorsForms.push(conForm);
    //         }
    //     }
    // }
    // onSelect()  {
    //     console.log('[ResourceForm] inMerge(): ', 'onSelect select');

    // }

    deleteResource() {
        // Deletes the whole currently selected resouces
        if (confirm('Are you sure to delete resource ' + this.resource._id)) {
            this.locdbService.deleteBibliographicResource(this.resource).subscribe((res) => console.log('Deleted'));
            this.resource = null;
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
            if (br.publicationYear) {
                s += ` (${br.publicationYear})`
            }
            if (br.status === 'EXTERNAL') {
                s += ` [${br.type}]`
            }
            return s;
        }
    }

}
