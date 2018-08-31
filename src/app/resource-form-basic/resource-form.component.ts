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
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TemplateRef } from '@angular/core';

import { Observable } from 'rxjs/Rx'
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { StandardPipe }from '../pipes/type-pipes';

@Component( {
    selector: 'app-resource-form-basic',
    templateUrl: './resource-form.component.html',
    styleUrls: ['./resource-form.component.css']
})

export class ResourceFormBasicComponent implements OnInit, OnChanges  {

    @Input() resources: [TypedResourceView, TypedResourceView];
    @Output() resourcesChange = new EventEmitter<[TypedResourceView, TypedResourceView]>();
    @Output() updateResource = new EventEmitter<[TypedResourceView, TypedResourceView]>();

    resourceForm: FormGroup;
    containerForm: FormGroup;
    agentIdForm: FormGroup;
    embodiments: FormGroup[] = [];
    roles: string[] =  enum_values(enums.roleType);
    agentIdentifierTypes: string[] =  enum_values(enums.agentIdentifier);
    resourceTypes: string[] = enum_values(enums.resourceType);
    identifierTypes: string[] = enum_values(enums.identifier);

    migrating = false
    modalRef: BsModalRef;

    currentContributorForModal = null;

    dataSourcePartOf: Observable<any>;
    placeholderPartOf: string = "Enter name to search for parent"

    dataSourceMigration: Observable<any>;
    placeholderMigration: string = "Enter name to search for resource to migrate"

    objectKeys = Object.keys;
    _resourceRadio = 'Child'
    set resourceRadio(value: string){
      if (this._resourceRadio === value){

      } else {
        if(this._resourceRadio === 'Child'){
          this.resources[0] = this.prepareSaveResource()
        }
        else {
          this.resources[1] = this.prepareSaveResource()
        }
        this._resourceRadio = value
        this.ngOnChanges()
      }
    }
    get resourceRadio(): string{
      return this._resourceRadio
    }
    // queryPartOf: string;


    constructor(
        private fb: FormBuilder,
        private locdbService: LocdbService,
        private modalService: BsModalService
    )
    {
    this.createForm();
        this.dataSourcePartOf = Observable.create((observer: any) => {
          // Runs on every search
        observer.next(this.resourceForm.get('partOf').value); // input field with two way bind
        }).mergeMap((token: string) => this.getStatesAsObservable(token))
          .map(r => r.map( s => this.extractTypeahead(s)));
          // write id of selected resource in partof
          // maybe show name in form
        this.dataSourceMigration = Observable.create((observer: any) => {
        observer.next(this.resourceForm.get('migration').value);
        }).mergeMap((token: string) => this.getStatesAsObservable(token))
          .map(r => r.map( s => this.extractTypeahead(s)));
 }

 extractTypeahead(typedTuple: [TypedResourceView,TypedResourceView]){
   return new typeaheadObj(typedTuple[0])
   }

 getStatesAsObservable(token: string): Observable<any> {
     return this.locdbService.suggestionsByQuery(token, false, 0)
 }


 typeaheadOnSelectPartOf(e: TypeaheadMatch): void {
   // console.log('Selected value: ', e.item.id,  e.item.name);
   this.resourceForm.get('partOf').setValue(e.item.name)
   this.resourceForm.value.partOf = e.item.id
   console.log(this.prepareSaveResource())
 }
 typeaheadOnSelectMigration(e: TypeaheadMatch): void {
   // console.log('Selected value: ', e.item.id,  e.item.name);
   this.resourceForm.get('migration').setValue(e.item.name)
   this.setIdentifiers(this.resourceForm.get('identifiers').value.concat(e.item.identifiers))
   //this.resourceForm.value.partOf = e.item.id
   //console.log(this.prepareSaveResource())
   this.migrate()
 }

    createForm()  {
        this.containerForm = this.fb.group({});
        this.resourceForm = this.fb.group( {
            title: '',
            resourcetype: ['', Validators.required],
            subtitle: '',
            edition: '',
            resourcenumber: '',
            publicationyear: '',  // is this default ok?
            contributors: this.fb.array([]),
            identifiers: this.fb.array([]),
            partOf: '',
            migration: false,
            containerData: this.containerForm
        });
        this.agentIdForm = this.fb.group({
        // you can also set initial formgroup inside if you like
        agentIds: this.fb.array([]),
      });
    }



    addNewContributorId() {
      let control = <FormArray>this.agentIdForm.controls.identifiers;
      control.push(
        this.fb.group({
          scheme: '',
          literalValue: '',
        })
      )
    }

    addContributorIdentifier(contributor, scheme, literalValue){
      console.log(contributor)
      if (contributor.controls.identifiers.value == null){
        contributor.controls.identifiers = this.fb.array([this.fb.group({scheme:scheme, literalValue:literalValue})])
      }
      else {
        contributor.controls.identifiers.push(this.fb.group({scheme:scheme, literalValue:literalValue}))
      }
    }


    removeContributorIdentifier(contributor, index: number) {
      contributor.controls.identifiers.removeAt(index)
    }


    ngOnInit()  {
      // console.log("On init form", this.resources)
    }

    nameFromAgent(agent: models.ResponsibleAgent): string {
        // forward to locdb.ts method for unified treatment everywhere
        return composeName(agent);
    }

    agentFromName(forminput: string): models.ResponsibleAgent {
        // forward to locdb.ts method for unified treatment everywhere
        const agent = decomposeName(forminput);
        // decompose only yields familyName givenName and nameString
        agent.identifiers = [];
        return agent;
    }

    // clean array treatment
    setContributors(roles: models.AgentRole[]) {
        console.log("[debug] set contributors ", roles)

        const contribFGs = roles ? roles.filter(arole => arole != null).map(
            arole => this.fb.group(
                {role: arole.roleType, name: this.nameFromAgent(arole.heldBy),
                identifiers: this.fb.array(arole.heldBy.identifiers != null ?
                  arole.heldBy.identifiers.map(e => this.fb.group(e)) || [] :
                  []) }
            )
        ) : [];
        const contribFormArray = this.fb.array(contribFGs);
        this.resourceForm.setControl('contributors', contribFormArray);
        console.log("[debug] set resourceForm ", this.resourceForm)

    }

    get contributors(): FormArray {
        return this.resourceForm.get('contributors') as FormArray;
    }

    set contributors(contributorArray: FormArray){
      this.setContributors(contributorArray.value.map(
        e => this.reconstructAgentRole(e.name, e.role, e.identifiers)))
    }

    addContributor() {
        // reference from getter above
        this.contributors.push(this.fb.group({role: 'AUTHOR', name: 'name', identifiers: []}));
    }

    removeContributor(index: number) {
        this.contributors.removeAt(index);
    }

    //shift an entry in a formarray

    moveFormarrayEntry(index: number, shift: number, ){
      if(index + shift < 0 || index + shift >= this.contributors.length){
        console.log("[error] Target index not reachable (index: " + index + ", way: " + shift + ")")
        return this.contributors
      }
      else{
        if(shift < 0){
          shift *= -1
        	index -= shift
        }
        let tmp = this.contributors.value
        // console.log("[debug]" + tmp.toString() + " (index: " + index + ", way: " + shift + ")")
        tmp.splice(index + shift + 1, 0, tmp[index]);
        // console.log("[debug]" + tmp.toString() + " (index: " + index + ", way: " + shift + ")")
        tmp.splice(index, 1)
        // console.log("[debug]" + tmp.toString() + " (index: " + index + ", way: " + shift + ")")
        this.contributors = this.fb.array(tmp)
        return this.contributors
      }
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

    convertOrphanToParent(){
      this.resources[1] = this.resources[0]
      // TODO: instead of cloning create a new resource with id (from backend)
      let nresource = new TypedResourceView({type: enums.resourceType.monograph});

      this.resources[0] = nresource
      console.log("mazeltov", this.resources)
      this.ngOnChanges()
    }
    ngOnChanges()  {
        const resource = this.resourceRadio === 'Child' ? this.resources[0] : this.resources[1]
        console.log('ngOnChanges', resource);
        // console.log("Set publicationyear: ",  this.resource.publicationDate)

        this.resourceForm.reset( {
            title: resource.title,
            subtitle: resource.subtitle,
            resourcetype: resource.type,
            edition: resource.edition,
            resourcenumber: resource.number,
            publicationyear: isoFullDate(resource.publicationDate),
            partOf: resource.partOf,
            // containerTitle: this.resource.containerTitle // still in progress
        });
        this.placeholderPartOf = resource.partOf || 'Enter name to search for parent'
        // console.log("publicationyear: ",  this.resourceForm.value.publicationyear)
        // new clean set contribs
        this.setContributors(resource.contributors);
        this.setIdentifiers(resource.identifiers);
        // console.log('Contribs in resource:', this.resource.contributors);
        // console.log('Contribs in form:', this.contributors);
    }

    setContainers(ContainerResource: TypedResourceView){
      console.log("setContainers ", ContainerResource)
      if (ContainerResource != undefined || ContainerResource != null){
        this.containerForm = this.fb.group(ContainerResource.getContainerProperties())
        console.log("[debug] ", this.containerForm)
      }
    }

    onSubmit() {
      // prepare both resources (non active is stored in this.resources
      // the other one in formModel)
      if(this._resourceRadio === 'Child'){
        this.resources[0] = this.prepareSaveResource()
      }
      else {
        this.resources[1] = this.prepareSaveResource()
      }
      // connect them properly (set partOf)
      // done in safeCreateAndUpdate()
      // then submit
        console.log("[debug] submit resources: ", this.resources)
        this.updateResource.emit(this.resources)
    }

    revert() {
        this.ngOnChanges()
    }


    reconstructAgentRole(name: string, role: string, identifiers: models.Identifier[]): models.AgentRole {
        const agentRole = {
            identifiers: [],
            roleType: role,
            heldBy: this.agentFromName(name)
        }
        agentRole.heldBy.identifiers = identifiers;
        console.log("[debug] reconstructed agentRole: ", agentRole)
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
      let old_resource = null
      if(this.resourceRadio === 'Child'){
          old_resource = this.resources[0]
          this.setContainers(this.resources[1])
        } else {
          old_resource = this.resources[1]
          this.containerForm = this.fb.group({})

        }
        // Form values need deep copy, else shallow copy is enough
        const formModel = this.resourceForm.value;
        const containerFormModel = this.containerForm.value
        const contribsDeepCopy = formModel.contributors.map((elem: {name: string, role: string, identifiers: models.Identifier[]}) =>
        elem.name == "UNK" ? this.reconstructAgentRole("", elem.role, elem.identifiers): this.reconstructAgentRole(elem.name, elem.role, elem.identifiers));
        const identsDeepCopy = formModel.identifiers.map(
          (id: {scheme: string, literalValue: string} ) => this.reconstructIdentifier(id.scheme, id.literalValue)
        );
        const resource: TypedResourceView =  new TypedResourceView({_id: old_resource._id,
          type: formModel.resourcetype as string, partOf: formModel.partOf || old_resource.partOf,
          parts: old_resource.parts, cites: old_resource.cites,
          status: old_resource.status})
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
        resource.embodiedAs = old_resource.embodiedAs;
        // let containerResource = this.resources[1]
        // for(let key in containerFormModel){
        //   containerResource.setContainerProperty(key, containerFormModel[key])
        // }

        return resource;
    }

    short() {
        // A shorthand name for accordion heading
        if (this.resources[0]) {
            // resources[0] already present
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

    migrate(){
      this.migrating = !this.migrating
    }

    openModal(template: TemplateRef<any>, contributor) {
        this.currentContributorForModal = contributor
        console.log(contributor)
        this.agentIdForm = contributor
        console.log(this.agentIdForm)
        this.modalRef = this.modalService.show(template);
    }

}

class typeaheadObj {
    private id: string;
    private name: string;
    private identifiers: models.Identifier[];

    constructor(tr: TypedResourceView){
      this.id = tr._id
      this.name = (new StandardPipe().transform(tr)).replace(/<.*?>/, '').replace(/<\/.*?>/, '')
      this.identifiers = tr.identifiers
    }

    public toString (): string {
      return this.name
    }
}
