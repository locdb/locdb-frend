import { BibliographicResource, BibliographicEntry, AgentRole } from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.css']
})
export class ResourceFormComponent implements OnChanges {

  @Input() resource: BibliographicResource;

  resourceForm: FormGroup;
  contributorsForms: FormGroup[] = [];
  

  constructor(
    private fb: FormBuilder,
    private locdbService: LocdbService) { this.createForm(); }

  createForm() {
    this.resourceForm = this.fb.group({
      title: '',
      resourcetype: '',
      subtitle: '',
      edition: '',
      resourcenumber: '',
      publicationyear: '',
      parts: '',
      partof: '',
      embodiedas: '',
      //authors: this.fb.array([]),
    }
    )
  }
  
  ngOnChanges() {
    if (!this.resourceForm || !this.resource) {
      return;
    }
    console.log( 'Resource: ', this.resource);
    this.resourceForm.reset({
      title: this.resource.title
    // ...
      });
      console.log("Resource.contributors: ", this.resource.contributors);
      if (!this.contributorsForms || !this.resource) {
      return;
    }
     for (let con of this.resource.contributors){
        console.log("Con: ", con);
        let conForm: FormGroup =  this.fb.group({
            role: con.roleType,
            name: con.heldBy.nameString,
        })
        this.contributorsForms.push(conForm);
        // conForm.reset({
        // title: this.resource.title
        // ...
//        });
     }
  }
  
  addContributorField(){
  let conForm: FormGroup =  this.fb.group({
            role: '',
            name: '',
        })
        this.contributorsForms.push(conForm);
  }
  
  delContributorField(pos: number){
  // other delete, maybe numbers not updated...
    this.contributorsForms.splice(pos, pos);
  }
}
