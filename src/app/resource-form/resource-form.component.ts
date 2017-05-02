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
    });
  }
  
  get contributors(): FormArray {
    return this.resourceForm.get('contributors') as FormArray;
  };
  
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
        let  conForm: FormGroup =  this.fb.group({
            role: '',
            name: '',
        });
        
        this.contributorsForms.push(conForm);
  }
  
  delContributorField(pos: number){
  // other delete, maybe numbers not updated...
  console.log("delete pos: "+ pos);
     this.contributorsForms.splice(pos,1);
     console.log("this.contributorsForms", this.contributorsForms)
  }
  onSubmit(){
  console.log("Submit");
  }
  
  // Array Remove - By John Resig (MIT Licensed)
    removeFromArray(arr: FormGroup[], from: number) {
        var rest = arr.slice(from + 1 || arr.length);
        arr.length = from < 0 ? arr.length + from : from;
        return arr.push.apply(arr, rest);
    };
}
