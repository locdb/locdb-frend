
import { Component, OnInit, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import { models, enums, TypedResourceView } from '../locdb';
import { LocdbService } from '../locdb.service';
import {Observable} from 'rxjs/Rx';
import { SimpleChanges } from '@angular/core';
import { EntryListComponent } from './entry-list/entry-list.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rou-refs-inspector',
  templateUrl: './router-refs-inspector.component.html',
  styleUrls: ['./inspector.css']
})
export class RouterRefsInspectorComponent implements OnInit, OnChanges {
  // @Input() resource: TypedResourceView;
  // @Input() refs: Array<models.BibliographicEntry>;
  // @Output() entry: EventEmitter<models.BibliographicEntry> = new EventEmitter();
  // if sorry_text is set it is shows instead of the app entry list in the card body
  title = 'Reference Inspector';
  sorry_text = '';
  _id: string;
  resource: TypedResourceView;
  parent: TypedResourceView = null;
  refs: Array<models.BibliographicEntry> = [];
  entry: models.BibliographicEntry; // EventEmitter<models.BibliographicEntry> = new EventEmitter();
  selected_entry_display: models.BibliographicEntry;
  selected_entry_list: models.BibliographicEntry;
  constructor( private locdbService: LocdbService, private route: ActivatedRoute, private router: Router) { }
  display_trigger_selected_entry(entry: models.BibliographicEntry) {
    this.entry = entry;
    this.selected_entry_display = entry;
  }

  list_trigger_selected_entry(entry: models.BibliographicEntry) {
    this.entry = entry;
    this.selected_entry_list = entry;
  }

  ngOnInit() {
    this._id = this.route.snapshot.params.id;
    console.log('Resource laden... ')
    // load Bibliographic resource because only id is passed along the route
    this.locdbService.getBibliographicResource(this._id).subscribe((res) => {
      this.resource = res;
      console.log('Resource ', res);
      this.refs = res.parts.filter(x => x.status !== enums.status.obsolete);
      console.log('refs', this.refs)
      if (this.resource.partOf) {
        console.log('Retrieving parent with id', this.resource.partOf)
        this.locdbService.getBibliographicResource(this.resource.partOf).subscribe(
          (parent_trv) => this.parent = parent_trv,
          (error) => console.log('Error occurred while retrieving parent resource', error)
        )

      }
    },
    (err) => { this.sorry_text = 'No resource found with id ' + this._id;
              console.log('err, no br') });

  }

  ngOnChanges(changes: SimpleChanges | any) {
    // fetch entries for todo item (cold observable, call in template with async)
  }

  forwardEntry(entry: models.BibliographicEntry) {
    this.entry = entry
    // this.entry.emit(entry);
  }

  showScan() {
    this.router.navigate(['/linking/ScanInspector/', this._id]);
  }


  newEntry() {
    console.log("new entry")
    this.router.navigate(['/edit/'],{ queryParams: { resource: this.resource._id, entry: "create" } });
    // this.refs.push(this.locdbService.newBibliographicEntry())
  }

  triggerEdit(params){
    console.log("Edit: ", params)
    this.router.navigate(['/edit/'],{ queryParams: params});

  }

}
