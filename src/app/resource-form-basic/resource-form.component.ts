import {
    models,
    TypedResourceView,
    enums,
    enum_values,
    isoFullDate,
    composeName,
    decomposeName
} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component( {
    selector: 'app-resource-form-basic',
    templateUrl: './resource-form.component.html',
    styleUrls: ['./resource-form.component.css']
})

export class ResourceFormBasicComponent implements OnInit, OnChanges  {

    @Input() resource: TypedResourceView
    @Output() resourceChanged = new EventEmitter<TypedResourceView>();


    resourceForm: FormGroup;
    embodiments: FormGroup[] = [];
    roles: string[] =  enum_values(enums.roleType);
    resourceTypes: string[] = enum_values(enums.resourceType);
    identifierTypes: string[] = enum_values(enums.identifier);

    constructor(
        private fb: FormBuilder,
        private locdbService: LocdbService
    ) { this.createForm(); }

    createForm()  {
        this.resourceForm = this.fb.group( {
            title: '',
            resourcetype: ['', Validators.required],
            subtitle: '',
            edition: '',
            resourcenumber: '',
            publicationyear: '',  // is this default ok?
            contributors: this.fb.array([]),
            identifiers: this.fb.array([]),
        });
    }

    ngOnInit()  {
    }


    nameFromAgent(agent: models.ResponsibleAgent): string {
        // forward to locdb.ts method for unified treatment everywhere
        return composeName(agent);

      // if (agent.familyName) {
      //   return agent.familyName + ', ' + agent.givenName;
      // } else {
      //   if (agent.nameString) {
      //     return agent.nameString;
      //   } else {
      //     return ' ';
      //   }
      // }
    }

    agentFromName(forminput: string): models.ResponsibleAgent {
        // forward to locdb.ts method for unified treatment everywhere
        const agent = decomposeName(forminput);
        // decompose only yields familyName givenName and nameString
        agent.identifiers = [];
        return agent;
      // const [lastname, firstname, ...other] = forminput.split(', ');
      // return {
      //   identifiers: [],
      //   givenName: firstname,
      //   familyName: lastname,
      //   nameString: forminput // retain original input
      // }
    }

    // clean array treatment
    setContributors(roles: models.AgentRole[]) {
        const contribFGs = roles ? roles.map(
            arole => this.fb.group(
                {role: arole.roleType, name: this.nameFromAgent(arole.heldBy)}
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
        this.contributors.push(this.fb.group({role: 'AUTHOR', name: 'name'}));
    }

    removeContributor(index: number) {
        this.contributors.removeAt(index);
    }

    // clean array treatment end
    setIdentifiers(ids: models.Identifier[]) {
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
        console.log('ngOnChanges', this.resource);
        this.resourceForm.reset( {
            title: this.resource.title,
            subtitle: this.resource.subtitle,
            resourcetype: this.resource.type,
            edition: this.resource.edition,
            resourcenumber: this.resource.number,
            publicationyear: isoFullDate(this.resource.publicationDate),
            // containerTitle: this.resource.containerTitle // still in progress
        });
        // new clean set contribs
        this.setContributors(this.resource.contributors);
        this.setIdentifiers(this.resource.identifiers);
        console.log('Contribs in resource:', this.resource.contributors);
        console.log('Contribs in form:', this.contributors);
    }

    onSubmit() {
        const resource = this.prepareSaveResource();
        this.resourceChanged.emit(resource)
    }

    revert() {
        this.ngOnChanges()
    }


    // cancel() {
    //     this.submitted = true; // effectively closes the form
    //     this.submitStatus.emit(false)
    // }

    reconstructAgentRole(name: string, role: string): models.AgentRole {
        const agentRole = {
            identifiers: [],
            roleType: role,
            heldBy: this.agentFromName(name)
        }
        return agentRole;
    }

    reconstructIdentifier(scheme: string, value: string): models.Identifier {
      const identifier = {
        scheme: scheme,
        literalValue: value,
      }
      return identifier;
    }

    prepareSaveResource(): TypedResourceView  {
        // Form values need deep copy, else shallow copy is enough
        const formModel = this.resourceForm.value;
        const contribsDeepCopy = formModel.contributors.map(
            (elem: {name: string, role: string }) => this.reconstructAgentRole(elem.name, elem.role)
        );
        const identsDeepCopy = formModel.identifiers.map(
          (id: {scheme: string, literalValue: string} ) => this.reconstructIdentifier(id.scheme, id.literalValue)
        );
        const resource: TypedResourceView =  new TypedResourceView({_id: this.resource._id,
          type: formModel.resourcetype as string, partOf: this.resource.partOf,
          parts: this.resource.parts, cites: this.resource.cites,
          status: this.resource.status})
          resource.identifiers = identsDeepCopy;
          resource.title = formModel.title as string || '';
          resource.subtitle = formModel.subtitle as string || '';
          resource.edition = formModel.edition as string || '';
          // containerType ~> containerTitle
          // additional dropdown when type is selected, according to containertypes
            // container Title does not need to be editable atm
          // resource.containerTitle = formModel.containerTitle as string || '';
          resource.number = formModel.resourcenumber as string || '';
          resource.contributors = contribsDeepCopy;
          resource.publicationDate = formModel.publicationyear;
            // partOf: formModel.partof as string || '',
            // warning: retain internal identifiers (dont show primary keys to the user)
            // not editable, but copied values
          resource.embodiedAs = this.resource.embodiedAs;

        return resource;
    }
    //
    // deleteResource() {
    //     // Deletes the whole currently selected resouces
    //     if (confirm('Are you sure to delete resource ' + this.resource._id)) {
    //         this.locdbService.deleteBibliographicResource(this.resource).subscribe(
    //             (res) => {console.log('Deleted'); this.resource = null; this.resourceChange.emit(this.resource)},
    //             (err) => {alert("Error deleting resource " + this.resource._id)}
    //         );
    //     }
    //
    // }

    // showForm(val: boolean) {
    //     // Display the form or stop displaying it
    //     this.submitted = !val;
    // }

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
