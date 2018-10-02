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
  // route subscriber
  sub;

  // status to indicate loading
  request_answered = false;
  request_failed = false;

  // actual data;
  resource: TypedResourceView;
  container: TypedResourceView;

  entry: models.BibliographicEntry;

  constructor(private locdbService: LocdbService, private route: ActivatedRoute,
    private location: Location, private router: Router) {}

  delay(ms: number) {
    console.log('delay', ms);
      return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async retry_connection() { await this.delay(2000); this.ngOnInit(); }

  ngOnInit() {
    this.request_answered = false;
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        console.log('[Edit View] Params:', params)
        if (params['resource']) {
          // Retrieve the actual resource
          // console.log("enter if resource id")
          this.locdbService.bibliographicResource(params['resource']).subscribe(
            (trv) => {
              this.resource = trv || null;
              if (params['entry']) {
                // If an entry is desired, search it
                this.entry = this.resource.parts.find(x => x._id === params['entry'])
                if (this.entry === undefined) {
                  // Fallback if entry ID could not be found, DANGEROUS TODO FIXME
                    const newEntry: models.BibliographicEntry = {};
                    newEntry.ocrData = {};
                    newEntry.ocrData.authors = [];
                    this.entry = newEntry;
                }
              }
              this.request_answered = true;
            },
            (error) => {
              console.log('Resource not found', params['resource']);
              console.log('Error', error.status, error.msg);
              this.request_failed = true;
            });
        }
        if (params['container']) {
          this.locdbService.bibliographicResource(params['container']).subscribe(
            (returned_container) => {
              this.container = returned_container || null;
              this.request_answered = true;
            },
            (error) => {
              console.log('Resource not found', params['resource']);
              console.log('Error', error.status, error.msg);
            }
          )
        }
      });
  }



  save_resourse(_resource: TypedResourceView){
    console.log('Save resource ', _resource.data.type)
    console.log('Resource type: ', typeof(_resource))
    this.locdbService.maybePutResource(_resource).subscribe((succ) => {
      console.log('Save successful', succ);
      this.triggerBack();
  },
    (err) => { console.log('Error', _resource, err) });
  }


  triggerBack(){
    // history.back() //slow
    this.location.back() // hm ok no difference
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
