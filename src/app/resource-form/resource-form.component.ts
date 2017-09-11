import { BibliographicResource, BibliographicEntry, AgentRole, ResponsibleAgent, ROLES } from '../locdb';
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
    @Input() resource: BibliographicResource;
    @Input() folded = false;

    @Input() exSuggests: any[];

    @Input() resource_id: string = null;

     @Input() entry: BibliographicEntry;
    oldresource: BibliographicResource;

    resourceForm: FormGroup;
    contributorsForms: FormGroup[] = [];
    embodiments: FormGroup[] = [];
    editable = false;
    parts: FormGroup[] = [];



    // roles: string[] = ['CORPORATE','PUBLISHER', 'author']; // <-- to Locdb.ts as class?
    // roles: string[] = AgentRole.ROLES;
    roles: string[] =  ROLES;

    constructor( private fb: FormBuilder, private locdbService: LocdbService)  { this.createForm(); }


    createForm()  {
        this.resourceForm = this.fb.group( {
            title: '',
            resourcetype: '',
            subtitle: '',
            edition: '',
            resourcenumber: 0,
            publicationyear: 0,
                partof: '',
        });
        console.log('roles:', this.roles);
    }

    toggleFolding()  {
        this.folded = !this.folded;
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

    ngOnChanges()  {
        if (!this.resourceForm || !this.resource)  {
            return;
        }
        console.log('ResourceForm ngOnChanges(): ', this.resource);
        this.resourceForm.reset( {
            title: this.resource.title,
            resourcetype: this.resource.type,
            subtitle: this.resource.subtitle,
            edition: this.resource.edition,
            resourcenumber: this.resource.number,
            publicationyear: this.resource.publicationYear,
                partof: this.resource.partOf,
                // ...
        });
        //  set Contributors
        this.contributorsForms = [];
        for (const con of this.resource.contributors) {
            const conForm: FormGroup =  this.fb.group( {
                role: con.roleType,
                name: con.heldBy.nameString,

                roleidentifiers: con.identifiers,
                resagentidentifiers: con.heldBy.identifiers,
                givenName: con.heldBy.givenName,
                familyName: con.heldBy.familyName,
            })
            console.log(conForm.value.role);
            this.contributorsForms.push(conForm);
        }
        this.embodiments = []
        // set Embodiments
        if (this.resource.embodiedAs)  {
            for (const emb of this.resource.embodiedAs) {
                const embForm: FormGroup =  this.fb.group( {
                    typeMongo: emb.typeMongo,
                    format: emb.format,
                        firstPage: emb.firstPage,
                        lastPage: emb.lastPage,
                        url: emb.url,
                        // scans?: ToDoParts[];
                })
                this.embodiments.push(embForm);
            }
        }
        this.parts = [];
        // set parts
        if (this.resource.parts)  {
            for (const part of this.resource.parts) {
                const partForm: FormGroup =  this.fb.group( {
                    id: part._id,
                    bibliographicEntryText: part.bibliographicEntryText,
                    references: part.references,
                    // coordinates: part.coordinates, << removed for now, is part of ocrData
                    scanId: part.scanId,
                    status: part.status,
                    // added
                    // identifiers: part.identifiers; // <-- Array
                })
            }
        }

        console.log('exSuggests ', this.exSuggests);
    }

    addContributorField() {
        const conForm: FormGroup =  this.fb.group( {
            role: 'author',
            name: '',
        });

        this.contributorsForms.push(conForm);
    }

    delContributorField(pos: number) {
        this.contributorsForms.splice(pos, 1);
    }

    dropboxitemselected(conForm: FormGroup, s: string) {
        // console.log('Role:', s);
        // console.log('conForm:', conForm);
        console.log('Role ' + s + ' selected.');
        conForm.patchValue( {
            role: s
        });
    }
    onSubmit() {
        // this.saveEntries();
        this.resource = this.prepareSaveResource();
        this.toggleEdit();
        console.log('Sending resource to backend!', this.resource);
        this.locdbService.putBibliographicResource(this.resource).subscribe((rval) => console.log('Yay. submitted', rval));
    }

    resetEntries() {
        this.ngOnChanges()
    }


    prepareSaveResource(): BibliographicResource  {
        /* Saves the form value into the captured resource */
        /* not sure if rewrite of method below */
        const formModel = this.resourceForm.value;
        const contributors: AgentRole[] = []
        for (const conForm of this.contributorsForms)  {
            const conFormModel = conForm.value;
            const role: AgentRole =  {
                roleType:  conFormModel.role,
                identifiers: [],
                heldBy : <ResponsibleAgent> {
                    identifiers: [],
                    nameString: conFormModel.name,
                    givenName: '',
                    familyName: '',
                }
            };
            contributors.push(role);
        }

        const resource: BibliographicResource =  {
            _id: this.resource._id,
            identifiers: this.resource.identifiers,
            type: formModel.resourcetype as string || '',
            title: formModel.title as string || '',
            subtitle: formModel.subtitle as string || '',
            edition: formModel.edition as string || '',
            number: formModel.resourcenumber as number || 0,
            contributors: contributors,
            publicationYear: formModel.publicationyear as number || 0,
            partOf: formModel.partof as string || '',
            // warning: no deep copy (but this ok as long as not editable)
            embodiedAs: this.resource.embodiedAs,
            parts: this.resource.parts,
        }
        return resource;
    }

    saveEntries() {
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
    toggleEdit(event?: any) {
        console.log('toggleEdit');
        this.editable = !this.editable;
        // if(this.editable)
        //     this.editable=false;
        // else
        //     this.editable=true;
    }
    saveExternal(sgt) {
        this.exSuggests = sgt
        console.log('Recieved External: ', this.exSuggests);
    }
    loadExtenalSuggestions() {
        // search for external Suggestions with entry emitted by app-display (current active entry)
        console.log('[ResourceForm] loadExtenalSuggestions(): ', this.entry);
        const searchentry = JSON.parse(JSON.stringify(this.entry));
        // set new title to search with
        searchentry.ocrData.title = this.resourceForm.value.title;
        console.log('[ResourceForm] loadExtenalSuggestions(): ',
            this.resourceForm.value.title, '; searchentry.ocrData.title',
            searchentry);
        this.locdbService.suggestions(searchentry, true).subscribe( (sgt) => this.saveExternal(sgt) );
    }
    inMerge(r: any) {
        // empty fields are filled with information from selected external resource if possible
        console.log('[ResourceForm] inMerge(): ', this.resource, '; Clicked External Entry: ',  r);
        /* ---------------------*/
        // depending on import type (BibResource/ocrData) two differend imports
        // BibResource
        const title = r.title;
        const authors = [];
        for (const contributor of r.contributors) {
            const name = contributor.heldBy.nameString;
//             console.log('name: ', name);
            // let test: any= [' AUTHOR'];
//             console.log(test);
            let role = contributor.roleType;
            if (ROLES.indexOf(role) >= 0) {
                console.log('Role of external Resource found');
            } else {
                role = 'author';
            }
//             console.log('role: ', role);
            authors.push( {name: name, role: role});
        }
        /* ---------------------*/

        /* ---------------------*/
        // ocrData
//         console.log('ocrData',r.ocrData)
        //let title = r.ocrData.title;
        //let authors = r.ocrData.authors;
        //let name: string;
        //let role = 'author';
//         console.log('external suggestion: ', r);
//         console.log('inMerge, r: ', r);
        /* ---------------------*/

        if (this.resourceForm.value.title === '') {
            this.resourceForm.patchValue( {
                title: title,
            });
        }
        // add authors if not in list already
        for (const author of authors) {
            const name = author.name; // author for ocrData.authors
            const role = author.role; // dummy for ocrData

            let isListed = false;

            for (const con of this.contributorsForms) {
                if (con.value.name === name) {
                    isListed = true;
                    break;
                }
            }
            if (!isListed) {
                // this.resourceForm.patchValue( {});
                const conForm: FormGroup =  this.fb.group( {
                    role: role,
                    name: name,
                })
                this.contributorsForms.push(conForm);
            }
        }


    }
    onSelect()  {
        console.log('[ResourceForm] inMerge(): ', 'onSelect select');

    }

}


