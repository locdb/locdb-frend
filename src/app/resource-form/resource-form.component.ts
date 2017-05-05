import { BibliographicResource, BibliographicEntry, AgentRole, ResponsibleAgent } from '../locdb';
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

oldresource: BibliographicResource;

resourceForm: FormGroup;
contributorsForms: FormGroup[] = [];  
embodiments: FormGroup[] = [];
parts: FormGroup[] = [];

roles: string[] = ['CORPORATE','PUBLISHER']; // <-- to Locdb.ts as class?

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
    partof: '',
    });
    console.log('roles:', this.roles);
}

ngOnChanges() {
    if (!this.resourceForm || !this.resource) {
    return;
    }
    console.log( 'Resource: ', this.resource);
    this.resourceForm.reset({
    title: this.resource.title,    
    resourcetype: this.resource.type,
    subtitle: this.resource.subtitle,
    edition: this.resource.edition,
    resourcenumber: this.resource.number,
    publicationyear: this.resource.publicationYear,
    partof: this.resource.partOf,
    // ...
    });
    console.log("Resource.contributors: ", this.resource.contributors);
    if (!this.contributorsForms || !this.resource) {
    return;
    }
    //set Contributors
    for (let con of this.resource.contributors){
        //console.log("Con: ", con);
        let conForm: FormGroup =  this.fb.group({
            role: con.roleType,
            name: con.heldBy.nameString,
            
            roleidentifiers: con.identifiers,
            resagentidentifiers: con.heldBy.identifiers,
            givenName: con.heldBy.givenName,
            familyName: con.heldBy.familyName,
        })
        console.log("Role Identifiers: ", con.heldBy.identifiers);
        // console.log("Role Id: ", con._id);
        //console.log(conForm.value.role);
        this.contributorsForms.push(conForm);
        // conForm.reset({
        // title: this.resource.title
        // ...
//        });
    }
    //set Embodiments
    for (let emb of this.resource.embodiedAs){
        console.log("Emb: ", emb);
        let embForm: FormGroup =  this.fb.group({
            typeMongo: emb.typeMongo,
            format: emb.format,
            firstPage: emb.firstPage,
            lastPage: emb.lastPage,
            url: emb.url,
            // scans?: ToDoParts[];
    })
        console.log(embForm.value.firstPage);
        this.embodiments.push(embForm);
        // conForm.reset({
        // title: this.resource.title
        // ...
//        });
    }
    
    //set parts
    for (let part of this.resource.parts){
        console.log("part: ", part);
        let partForm: FormGroup =  this.fb.group({
            id: part._id,
            bibliographicEntryText: part.bibliographicEntryText,
            references: part.references,
            coordinates: part.coordinates,
            scanId: part.scanId,
            status: part.status,
            // added
            // identifiers: part.identifiers; // <-- Array
        })
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
dropboxitemselected(conForm: FormGroup, s: string){
    // console.log("Role:", s);
    // console.log("conForm:", conForm);
    conForm.value.role = s;
}
onSubmit(){
    this.saveEntries();
    console.log("Send somewere ", this.resource);
}

saveEntries(){
    this.oldresource = JSON.parse(JSON.stringify(this.resource));
    
    if(this.resourceForm.value.title)
        this.resource.title = this.resourceForm.value.title;
    if(this.resourceForm.value.resourcetype)
        this.resource.type = this.resourceForm.value.resourcetype;
    if(this.resourceForm.value.subtitle)
        this.resource.subtitle = this.resourceForm.value.subtitle;
    if(this.resourceForm.value.edition)
        this.resource.edition = this.resourceForm.value.edition;
    if(this.resourceForm.value.resourcenumber)
        this.resource.number = this.resourceForm.value.resourcenumber;
    if(this.resourceForm.value.publicationyear)
        this.resource.publicationYear = this.resourceForm.value.publicationyear;
    if(this.resourceForm.value.partof)
        this.resource.partOf = this.resourceForm.value.partof;
    
    
        //   roleidentifiers: con.identifiers,
        //    resagentidentifiers: con.heldBy.identifiers,
        //    nameString: con.heldBy.nameString,
        //    givenName: con.heldBy.givenName,
    //     familyName: con.heldBy.familyName,
    
    let agents: AgentRole[] = [];
    for (let conForm of this.contributorsForms){
        let agent = new AgentRole();
        let resAgent = new ResponsibleAgent();
        if(conForm.value.name){
            resAgent.nameString = conForm.value.name
            resAgent.identifiers = conForm.value.resagentidentifiers
            if(conForm.value.givenName)
                resAgent.givenName = conForm.value.givenName
            if(conForm.value.familyName)
                resAgent.familyName = conForm.value.familyName
        
        }
        else
            resAgent = null;
        
        // console.log("conForm: ", conForm);
        agent.roleType = conForm.value.role;
        if(conForm.value.roleidentifiers)
            agent.identifiers = conForm.value.roleidentifiers;
        if(resAgent)
            agent.heldBy = resAgent;
        agents.push(agent);
        }
        
    this.resource.contributors = agents;
    console.log("Resource ready to save: ", this.resource);
    console.log("Input Resource: ", this.oldresource);
    console.log(""+(this.resource == this.oldresource)); // AgentRole Objects have ids, that are not defined in class and can not be restored
    // resource ready to send, closing form on send?
}


}


