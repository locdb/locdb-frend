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
      contributors: this.fb.array([]),
      publicationyear: '',
      parts: '',
      partof: '',
      embodiedas: '',
      //authors: this.fb.array([]),
    }
    )
  }

  setContributers(contributors: AgentRole[]) {
    const contributorFGs = contributors.map(contributor => this.fb.control(contributor));
    const contributorFormArray = this.fb.array(contributorFGs);
    // const authorFormArray = this.fb.array(authors);
    console.log('contributors: ', contributors);
    console.log('contributorsFGs: ', contributorFGs);
    console.log('contributorsFromArray: ', contributorFormArray);
    this.resourceForm.setControl('contributors', contributorFormArray);
    console.log('Done.');
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
    this.setContributers(this.resource.contributors);

  }

}
