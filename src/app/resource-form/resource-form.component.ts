import { BibliographicResource, BibliographicEntry, AgentRole, ResponsibleAgent, ToDo, ROLES, Identifier } from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component( {
    selector: 'app-resource-form',
    templateUrl: './resource-form.component.html',
    styleUrls: ['./resource-form.component.css']
})

export class ResourceFormComponent implements OnInit, OnChanges  {

    // if this is a string, we can try to dereference it from the back-end
    @Input() resource: BibliographicResource | ToDo;


    @Input() resource_id: string = null;

    // this should not be here, the resource should only rely on itself and not
    // some entries TODO FIXME
    // @Input() exSuggests: any[];
    @Input() selected = false;
    oldresource: BibliographicResource;

    resourceForm: FormGroup;
    contributorsForms: FormGroup[] = [];
    embodiments: FormGroup[] = [];
    submitted = true;
    parts: FormGroup[] = [];



    // roles: string[] = ['CORPORATE','PUBLISHER', 'author']; // <-- to Locdb.ts as class?
    // roles: string[] = AgentRole.ROLES;
    roles: string[] =  ROLES;

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
            resourcenumber: 0,
            publicationyear: '',
            partof: '',
            contributors: this.fb.array([])
        });
    }

    ngOnInit()  {
        if (!this.resource && this.resource_id)  {
            // if resource is not initialised itself but an id is given
            // try to retrieve resource by id from the back-end
            console.log('Fetching resource', this.resource_id, 'from back-end.');
            this.locdbService.bibliographicResource(this.resource_id).subscribe(
                (res) =>  { this.resource = res }
            );
        }
    }

    // clean array treatment
    setContributors(roles: AgentRole[]) {
        const contribFGs = roles.map(
            arole => this.fb.group(
                {role: arole.roleType, name: arole.heldBy.nameString }
            )
        );
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
        const contribFGs = ids.map(
            identifier => this.fb.group(
                {literalValue: identifier.literalValue,
                    scheme: identifier.scheme }
            )
        );
        const idsFormArray = this.fb.array(contribFGs);
        this.resourceForm.setControl('identifiers', idsFormArray);
    }

    get identifiers(): FormArray {
        return this.resourceForm.get('identifiers') as FormArray;
    }

    addIdentifier() {
        // reference from getter above
        this.contributors.push(this.fb.group(new Identifier()));
    }

    ngOnChanges()  {
        // This is called when the model changes, not the form
        // TODO FIXME yes it does get called, since the resource is bound to the form
        // maybe it is enough to shift this code to OnInit
        // if (!this.resourceForm || !this.resource)  {
        //     return;
        // }
        this.resourceForm.reset( {
            title: this.resource.title,
            subtitle: this.resource.subtitle,
            resourcetype: this.resource.type,
            edition: this.resource.edition,
            resourcenumber: this.resource.number,
            publicationyear: this.resource.publicationYear,
            partof: this.resource.partOf,
                // ...
        });
        // new clean set contribs
        this.setContributors(this.resource.contributors);
        this.setIdentifiers(this.resource.identifiers);
    }

    addContributorField() {
        // only used by modal variant
        const conForm: FormGroup =  this.fb.group( {
            role: 'author',
            name: '',
        });

        this.contributorsForms.push(conForm);
    }

    delContributorField(pos: number) {
        // only used by modal variant
        this.contributorsForms.splice(pos, 1);
    }

    onSubmit() {
        this.resource = this.prepareSaveResource();
        this.submitted = true;
        if (this.resource.status !== 'EXTERNAL') {
            console.log('Sending resource updates to backend!', this.resource);
            // resource does not have an internal identifier
            // only store in memory for now (until commit is called)
            this.locdbService.putBibliographicResource(this.resource).subscribe((rval) => console.log('Yay. submitted', rval));
        } else {
            console.log('Saving external resource updates in the frontend');
        }
        this.ngOnChanges(); // as suggested by https://angular.io/guide/reactive-forms
    }

    revert() {
        this.ngOnChanges()
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


    prepareSaveResource(): BibliographicResource  {
        // Form values need deep copy, else shallow copy is enough
        const formModel = this.resourceForm.value;
        const contributors: AgentRole[] = []
        const contribsDeepCopy = formModel.contributors.map(
            (elem: {name: string, role: string }) => this.reconstructAgentRole(elem.name, elem.role)
        );
        const resource: BibliographicResource =  {
            _id: this.resource._id,
            identifiers: this.resource.identifiers, // TODO needs to come from form model, when changeable
            type: formModel.resourcetype as string || '',
            title: formModel.title as string || '',
            subtitle: formModel.subtitle as string || '',
            edition: formModel.edition as string || '',
            number: formModel.resourcenumber as number || 0,
            contributors: contribsDeepCopy,
            publicationYear: formModel.publicationyear as string || '',
            partOf: formModel.partof as string || '',
            // warning: no deep copy (but this ok as long as not editable)
            embodiedAs: this.resource.embodiedAs,
            parts: this.resource.parts,
            cites: this.resource.cites,
            status: this.resource.status
        }
        // TODO FIXME
        // if (this.resource.hasOwnProperty('children')) {
        //    resource = <ToDo> resource;
        //    // in case were dealing with ToDo item resources, we need to aswell copy children
        //    resource.children = this.resource.children;
        // }
        return resource;
    }

    saveEntries() {
        // UNUSED See :code:`prepareSaveResource` instead
        this.oldresource = JSON.parse(JSON.stringify(this.resource));

        // correctness check eg. all Roles set

        if (this.resourceForm.value.title) {
            this.resource.title = this.resourceForm.value.title;
        }
        if (this.resourceForm.value.resourcetype) {
            this.resource.type = this.resourceForm.value.resourcetype;
        }
        if (this.resourceForm.value.subtitle) {
            this.resource.subtitle = this.resourceForm.value.subtitle;
        }
        if (this.resourceForm.value.edition) {
            this.resource.edition = this.resourceForm.value.edition;
        }
        if (this.resourceForm.value.resourcenumber) {
            this.resource.number = this.resourceForm.value.resourcenumber;
        }
        if (this.resourceForm.value.publicationyear) {
            this.resource.publicationYear = this.resourceForm.value.publicationyear;
        }
        if (this.resourceForm.value.partof) {
            this.resource.partOf = this.resourceForm.value.partof;
        }


        //   roleidentifiers: con.identifiers,
        //    resagentidentifiers: con.heldBy.identifiers,
        //    nameString: con.heldBy.nameString,
        //    givenName: con.heldBy.givenName,
        //     familyName: con.heldBy.familyName,

        const agents: AgentRole[] = [];
        for (const conForm of this.contributorsForms) {
            const agent = new AgentRole();
            agent.identifiers = [];
            let resAgent = new ResponsibleAgent();
            resAgent.identifiers = [];
            if (conForm.value.name) {
                resAgent.nameString = conForm.value.name;
                resAgent.identifiers = conForm.value.resagentidentifiers;
                if (conForm.value.givenName) {
                    resAgent.givenName = conForm.value.givenName;
                }
                if (conForm.value.familyName) {
                    resAgent.familyName = conForm.value.familyName;
                }
            } else {
                resAgent = null;
            }

            // console.log('conForm: ', conForm);
            agent.roleType = conForm.value.role;
            if (conForm.value.roleidentifiers) {
                agent.identifiers = conForm.value.roleidentifiers;
            }
            if (resAgent) {
                agent.heldBy = resAgent;
            }
            agents.push(agent);
        }

        this.resource.contributors = agents;
        console.log('Resource ready to save: ', this.resource);
        console.log('Input Resource: ', this.oldresource);
        // AgentRole Objects have ids, that are not defined in class and can not be restored
        console.log('' + (this.resource === this.oldresource));
        // resource ready to send, closing form on send?

        // parts and embodiments are displayed, but not saved yet.
        // what of them schould be displayed and be editable? schould it be possible to make new entries?
        // this.toggleEdit();
    }

    // toggleEdit(event?: any) {
    //     console.log('toggleEdit');
    //     this.editable = !this.editable;
    // }
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

    short(br: BibliographicResource) {
        // A shorthand name for accordion heading
        let s = br.title
        if (br.publicationYear) {
            s += ` (${br.publicationYear})`
        }
        if (br.status === 'EXTERNAL') {
            s += ` [${br.identifiers[br.identifiers.length - 1].scheme}]`
        }
        return s;
    }

}
