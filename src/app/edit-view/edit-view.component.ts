import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocdbService } from '../locdb.service';
import { Location } from '@angular/common';

import { TypedResourceView, enums, enum_values, models} from '../locdb';

enum Form_mode {
  create_entry = 'create_entry',
  edit_entry = 'edit_entry',
  edit_resource = 'edit_resource',
  loading = 'loading',
  error = 'error'
}

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

  // determines whether info box is displayed.
  submitted = false;
  form_mode: Form_mode;

  constructor(private locdbService: LocdbService, private route: ActivatedRoute,
    private location: Location, private router: Router) {}

  delay(ms: number) {
    console.log('delay', ms);
      return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async retry_connection() { await this.delay(2000); this.ngOnInit(); }

  ngOnInit() {
    this.form_mode = Form_mode.loading
    // get ids from URL
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        console.log('[Edit View] Params:', params)
        // check if ID for Resource is present
        if (params['resource']) {
          // Retrieve the actual resource
          this.locdbService.getBibliographicResource(params['resource']).subscribe(
            (trv) => {
              this.resource = trv || null;
              console.log(`[Edit-view] Ressource:`, trv);
              // check if ID/String for Entry is present
              if (params['entry']) {
                // If an entry is desired, search it
                this.entry = this.resource.parts.find(x => x._id === params['entry'])
                if (this.entry === undefined) {
                  // Fallback if entry ID could not be found, DANGEROUS TODO FIXME
                    const newEntry: models.BibliographicEntry = {};
                    newEntry.ocrData = {};
                    newEntry.ocrData.authors = [];
                    newEntry._id = undefined
                    this.entry = newEntry;
                    this.form_mode = Form_mode.create_entry
                    console.log('[Edit-view][Debug] form_mode:', this.form_mode)
                }
                else{
                  this.form_mode = Form_mode.edit_entry
                  console.log('[Edit-view][Debug] form_mode:', this.form_mode)
                }
                console.log('entry', this.entry)
              }
              else{
                // if no entry-parameter is omitted, resource_edit mode is activated
                this.form_mode = Form_mode.edit_resource
                console.log('[Edit-view][Debug] form_mode:', this.form_mode)

              }
            },
            (error) => {
              console.log('Resource not found', params['resource']);
              console.log('Error:', error.status, error.message);
              this.form_mode = Form_mode.error
            });
        }
        if (params['container']) {
          this.locdbService.bibliographicResource(params['container']).subscribe(
            (returned_container) => {
              this.container = returned_container || null;
              this.form_mode = Form_mode.edit_resource
              console.log('[Edit-view][Debug] form_mode:', this.form_mode)

            },
            (error) => {
              console.log('Resource not found', params['resource']);
              console.log('Error:', error.status, error.name, error.statusText);
              this.form_mode = Form_mode.error
            }
          )
        }
      });
  }

  triggerBack() {
    // history.back() //slow
    this.location.back() // hm ok no difference
  }

  ngOnDestroy() {
    // is this good practice?
    this.sub.unsubscribe();
  }
}
