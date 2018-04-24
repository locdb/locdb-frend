import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocdbService } from '../locdb.service';
import { Location } from '@angular/common';

import { TypedResourceView, enums, enum_values, models} from '../locdb';
@Component({
  selector: 'app-edit-view',
  templateUrl: './edit-view.component.html',
  styleUrls: ['./edit-view.component.css']
})
export class EditViewComponent implements OnInit {
  sub;

  resource_id: string = "no resource id";
  resource: TypedResourceView

  entry_id: string = "no resource id";
  entry: models.BibliographicEntry;

  constructor(private locdbService: LocdbService, private route: ActivatedRoute,
    private location: Location, private router: Router) {}

  ngOnInit() {
    console.log("init");
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.resource_id = params['resource'] || '0';
        this.entry_id = params['entry'] || '0';
          console.log("got params", this.resource_id, this.entry_id)
        if(this.resource_id != '0'){
          console.log("enter if resource id")
          this.locdbService.bibliographicResource(this.resource_id).subscribe(
              (trv) => {
                if(trv){
                  this.resource = trv;
                    console.log("got trv back: ", this.resource)
              }
            },
              (err) => { console.log('No resource found', this.resource_id) });
        }
        if(this.entry_id != '0'){
          console.log("enter if entry id")
          this.locdbService.bibliographicResource(this.resource_id).subscribe(
            (res) => {
              if(res){
                console.log("got res: ", res)
                this.resource = res
                console.log("Resource ", this.resource)
                for(let part of res.parts){
                  if(part._id == this.entry_id){
                    this.entry = part
                  }
                }
                if(!this.entry){
                  console.log("Entry not found", this.entry_id)
                  if(this.entry_id == 'create'){
                    let newEntry: models.BibliographicEntry = {}
                    newEntry.ocrData = {}
                    newEntry.ocrData.authors = []
                    this.entry = newEntry
                  }
                }
              }
        },
          (err) => { console.log('No resource found', this.resource_id) });
      }
      });
  }

  save_resourse(_resource: TypedResourceView){
    console.log("Save resource ", _resource.data.type)
    console.log("Resource type: ", typeof(_resource))
    this.locdbService.maybePutResource(_resource).subscribe((succ) => {
      console.log("Save successful", succ)
      this.triggerBack();
  },
    (err) => { console.log('Error', this.resource_id, err) });
  }


  triggerBack(){
    // history.back() //slow
    this.location.back() // hm ok no difference
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
