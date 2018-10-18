import {
   models,
   TypedResourceView,
   enums,
   enum_values,
   composeName,
   decomposeName,
   containerTypes,
} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TemplateRef } from '@angular/core';

import { QuestionControlService } from './dynamic-question-form/question-control.service';
import { QuestionService } from './dynamic-question-form/question.service';
import { QuestionBase } from './dynamic-question-form/question-base';

import { Observable } from 'rxjs/Rx'
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { StandardPipe } from '../pipes/type-pipes';
import { ContainerPipe } from '../pipes/container.pipe';

// Service to commit changes to the resource
import { BibliographicResourceService } from '../typescript-angular-client/api/api';

@Component( {
   selector: 'app-resource-form',
   templateUrl: './resource-form.component.html',
   styleUrls: ['./resource-form.component.css']
})


/*
 * Key idea:
 *
 * Provide a form for one resource at a time, but retain a reference to an 'alternate'.
 * The 'alternate' resource is the container resource (parent) if the child is active and vice versa
 */
export class ResourceFormComponent implements OnInit, OnChanges  {
   // NEW TAKE BEGIN
   // Attributes
   // ----------

   // The input resource to edit
   @Input() resource: TypedResourceView;

   // Event emitter to notify about changes (when resource is submitted)
   @Output() resourceChange = new EventEmitter<TypedResourceView>();

   // The form to hold all changable metadata
   resourceForm: FormGroup;

   // Sub-form to change agent ids
   agentIdForm: FormGroup;

   // Expose Enum values for...
   // 1. Role types
   roleTypes: string[] =  enum_values(enums.roleType);
   // 2. Agent Identifer types
   agentIdentifierTypes: string[] = enum_values(enums.agentIdentifier);
   // 3. Resource Types
   resourceTypes: string[] = enum_values(enums.resourceType);
   // 4. Identifier Types
   identifierTypes: string[] = enum_values(enums.identifier);
   // such that they are accessible in drop-down style selects


   // Presumably unused?
   embodiments: FormGroup[] = [];

   // visualize stuff that is happening
   submitted = false;
   submitting = false;



   // Determine whether to show input field for identifier migration
   migrating = false;

   // Retained
   modalRef: BsModalRef;
   currentContributorForModal = null;

   dataSourceMigration: Observable<any>;
   placeholderMigration = 'Enter title to search for resource to migrate';
   // Retained END
   //
   // Holds questions for foreign properties
   questions: Array<QuestionBase<any>> = [];

   // NEW TAKE END

   constructor(
      private fb: FormBuilder,
      private locdbService: LocdbService,
      private modalService: BsModalService,
      private brService: BibliographicResourceService,
      private qs: QuestionService,
      private qcs: QuestionControlService
   ) {
      console.log('[BRF] constructor called')
      this.createForm();
      this.dataSourceMigration = Observable.create((observer: any) => {
         observer.next(this.resourceForm.get('migration').value);
      }).mergeMap((token: string) => this.getStatesAsObservable(token))
         .map(r => r.map( s => this.extractTypeahead(s)));
   }



   extractTypeahead(typedTuple: [TypedResourceView, TypedResourceView]) {
      // pass two objects into typeahead to properly create teh string?
      const [resource, container] = typedTuple;
      console.log('extract Typeahead', typedTuple);
      return new TypeaheadObj(resource, container);
   }

   getStatesAsObservable(token: string): Observable<any> {
      return this.locdbService.suggestionsByQuery(token, false, 0);
   }


   typeaheadOnSelectMigration(e: TypeaheadMatch): void {
      // console.log('Selected value: ', e.item.id,  e.item.name);
      this.resourceForm.get('migration').setValue(e.item.name) // why?
      this.setIdentifiers(this.resourceForm.get('identifiers').value.concat(e.item.identifiers))
      this.toggleMigrating()
   }

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
         // this holds all foreign properties (flattened)
         foreignProperties: this.fb.group({}),
         // does this need to be in the form?
         migration: '',
      });
      this.agentIdForm = this.fb.group({
         // you can also set initial formgroup inside if you like
         agentIds: this.fb.array([]),
      });
   }

   addNewContributorId() {
      const control = <FormArray>this.agentIdForm.controls.identifiers;
      control.push(
         this.fb.group({
            scheme: '',
            literalValue: '',
         })
      )
   }

   addContributorIdentifier(contributor, scheme, literalValue) {
      console.log(contributor)
      if (contributor.controls.identifiers.value == null) {
         contributor.controls.identifiers = this.fb.array([this.fb.group({scheme: scheme, literalValue: literalValue})])
      } else {
         contributor.controls.identifiers.push(this.fb.group({scheme: scheme, literalValue: literalValue}))
      }
   }


   removeContributorIdentifier(contributor, index: number) {
      contributor.controls.identifiers.removeAt(index)
   }


   ngOnInit()  {
      // console.log("On init form", this.resources)
   }

   // clean array treatment
   setContributors(roles: models.AgentRole[]) {
      console.log('[debug] set contributors ', roles)

      if (!roles || !roles.length) {
         // guard
         this.resourceForm.setControl('contributors', this.fb.array([])); return;
      }

      const validRoles = roles.filter(arole => arole !== null);
      console.log(validRoles);
      const contribFGs = validRoles.map(
         arole => this.fb.group(
            {
               role: arole.roleType,
               name: composeName(arole.heldBy),
               identifiers: this.fb.array(
                  arole.heldBy.identifiers && arole.heldBy.identifiers.length ?
                  arole.heldBy.identifiers.map(e => this.fb.group(e)) : []
               )
            }
         )
      );
      const contribFormArray = this.fb.array(contribFGs);
      this.resourceForm.setControl('contributors', contribFormArray);
      console.log('[debug] set resourceForm ', this.resourceForm)
   }

   get contributors(): FormArray {
      console.log('[BRF] contribs getter called');
      return this.resourceForm.get('contributors') as FormArray;
   }

   set contributors(contributorArray: FormArray) {
      console.log('[BRF] contribs setter called');
      // TODO FIXME dangerous?
      this.setContributors(contributorArray.value.map(
         e => this.reconstructAgentRole(e.name, e.role, e.identifiers)))
   }

   get foreignProperties(): FormGroup {
      console.log('[BRF] fp getter called');
      return this.resourceForm.get('foreignProperties') as FormGroup;
   }

   addContributor() {
      // reference from getter above
      this.contributors.push(this.fb.group({role: 'AUTHOR', name: '', identifiers: []}));
   }

   removeContributor(index: number) {
      this.contributors.removeAt(index);
   }

   // shift an entry in a formarray
   moveFormarrayEntry(index: number, shift: number) {
      if (index + shift < 0 || index + shift >= this.contributors.length) {
         console.log('[error] Target index not reachable (index: ' + index + ', way: ' + shift + ')')
         return this.contributors;
      } else {
         if (shift < 0) {
            shift *= -1
            index -= shift
         }
         const tmp = this.contributors.value; // TODO FIXME this is not a deep copy.. its ok here
         // console.log("[debug]" + tmp.toString() + " (index: " + index + ", way: " + shift + ")")
         tmp.splice(index + shift + 1, 0, tmp[index]);
         // console.log("[debug]" + tmp.toString() + " (index: " + index + ", way: " + shift + ")")
         tmp.splice(index, 1);
         // console.log("[debug]" + tmp.toString() + " (index: " + index + ", way: " + shift + ")")
         this.contributors = this.fb.array(tmp);
         return this.contributors;
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

   setQuestions(forResource: TypedResourceView, asType: enums.resourceType = null) {
      let resourceView: TypedResourceView = forResource;
      if (asType) {
         // Change the view if desired (required for type change events)
         resourceView = resourceView.astype(asType);
      }
      this.questions = this.qs.getQuestionsForResource(resourceView);
      this.resourceForm.setControl('foreignProperties', this.qcs.toFormGroup(this.questions));
   }

   onChangeType(newType: enums.resourceType) {
      this.setQuestions(this.resource, newType);
   }

   ngOnChanges()  {
      const resource = this.resource;
      console.log('[BRF] ngOnChanges triggered', resource);

      this.submitted = false;
      this.submitting = false;

      let stringDate = '';
      if (resource.publicationDate !== undefined && resource.publicationDate !== null) {
         stringDate = resource.publicationDate.toISOString()
         stringDate = stringDate.slice(0, stringDate.indexOf('T'));
      }

      this.resourceForm.reset( {
         title: resource.title,
         subtitle: resource.subtitle,
         resourcetype: resource.type,
         edition: resource.edition,
         resourcenumber: resource.number,
         publicationyear: stringDate
      });
      // console.log("publicationyear: ",  this.resourceForm.value.publicationyear)
      // new clean set contribs
      this.setContributors(resource.contributors);
      this.setIdentifiers(resource.identifiers);

      this.setQuestions(resource);

      // console.log('Contribs in resource:', this.resource.contributors);
      // console.log('Contribs in form:', this.contributors);
   }

   onSubmit() {
      const newResource = this.prepareSaveResource();
      console.log('[BRF] Submitting resource: ', newResource);

      this.submitting = true;

      const data = <models.BibliographicResource>newResource.data;
      if (newResource._id) {
         // Update internal database if it has an ID
         this.brService.update(data._id, data).subscribe(
            response => {
               this.resource = new TypedResourceView(response);
               this.resourceChange.emit(this.resource);
               this.submitting = false;
               this.submitted = true;
            },
            error => {
               alert('Could not save changes: ' + error.message);
               this.submitting = false;
            }
         )
      } else {
         // Create new resource if it has an ID
         this.brService.save(data).subscribe(
            response => {
               this.resource = new TypedResourceView(response);
               this.resourceChange.emit(this.resource);
               this.submitting = false;
               this.submitted = true;
            },
            error => {
               alert('Could not save changes: ' + error.message);
               this.submitting = false;
            }
         )
      }
      // In any case, notify higher-level components
   }

   deleteResource() {
      if (confirm(`Are you sure to permanently delete '${this.resource}' from the database?`)) {
         this.brService.deleteSingle(this.resource._id).subscribe(
            (success) => {
               {
                  this.resource = null; this.resourceChange.emit(null);
               }
            },
            (error) => alert(`Error deleting resource ${this.resource}:` + error.message)
         );

      }



   }

   revert() {
      this.ngOnChanges()
   }


   reconstructAgentRole(name: string, role: string, identifiers: models.Identifier[]): models.AgentRole {
      const agent = decomposeName(name);
      // decompose only yields familyName givenName and nameString
      agent.identifiers = identifiers || [];
      const agentRole = {
         // role identifiers are pointless
         identifiers: [],
         roleType: role,
         heldBy: agent
      }
      console.log('[debug] reconstructed agentRole: ', agentRole)
      return agentRole;
   }

   reconstructIdentifier(scheme: string, value: string): models.Identifier {
      const identifier = {
         scheme: scheme,
         literalValue: value,
      }
      return identifier;
   }

   changeType(event: any) {
      console.log('Changing type', event);
   }

   /**
    *  Create a **deep** copy of all attributes that are changable in the form
    *
    */
   prepareSaveResource(): TypedResourceView  {
      const oldResource = this.resource;

      // get snapshot of current form models
      const formModel = this.resourceForm.value;

      // Form values need deep copy, else shallow copy is enough
      const contribsDeepCopy = formModel.contributors.map(
         (elem: {name: string, role: string, identifiers: models.Identifier[]}) =>
         this.reconstructAgentRole(elem.name, elem.role, elem.identifiers)
      );
      const identsDeepCopy = formModel.identifiers.map(
         (id: {scheme: string, literalValue: string} ) => this.reconstructIdentifier(id.scheme, id.literalValue)
      );
      const resource: TypedResourceView =  new TypedResourceView(
         {
            _id: oldResource._id,
            type: formModel.resourcetype as string,
            // It's super important that these values are undefined,
            // as we never want to update them manually
            partOf: undefined, parts: undefined, cites: undefined,
            status: oldResource.status,
         }
      )
      // console.log('Form Model publiation date', formModel.publicationyear);
      // Set **typed** attributes
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
      resource.publicationDate = new Date(formModel.publicationyear);
      resource.embodiedAs = oldResource.embodiedAs;
      // warning: retain internal identifiers (dont show primary keys to the user)
      // not editable, but copied values

      const foreignPropertiesModel = this.foreignProperties.value;
      console.log('[BRF:prepareSaveResource] foreign properties', foreignPropertiesModel);
      for (const key of Object.keys(foreignPropertiesModel)) {
         const value = foreignPropertiesModel[key];
         console.log('[BRF:prepareSaveResource] Setting', key, 'to', value);
         resource.data[key] = value;
      }

      return resource;
   }

   toggleMigrating() {
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

class TypeaheadObj {
   private id: string;
   private name: string;
   private identifiers: models.Identifier[];

   constructor(resource: TypedResourceView, container: TypedResourceView | null = null) {
      this.id = resource._id;
      this.identifiers = resource.identifiers;


      if (!container) {
         this.name = resource.toString();
      } else {
         this.name = resource.toString() + ' <em>In:</em> ' + container.toString();
      }
      if (resource.publicationDate) {
         this.name = resource.publicationDate.getFullYear() + ' - ' + this.name;
      }
   }

   public toString (): string {
      return this.name
   }
}
