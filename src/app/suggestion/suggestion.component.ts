import { Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';

import { BibliographicEntry, BibliographicResource, AgentRole, ResponsibleAgent } from '../locdb';
import { LocdbService } from '../locdb.service';

import { MOCK_INTERNAL } from '../mock-bresources'

import { AccordionModule } from 'ngx-bootstrap/accordion';

import { environment } from 'environments/environment';


@Component({
    selector: 'app-suggestion',
    templateUrl: './suggestion.component.html',
    styleUrls: ['./suggestion.component.css']
})

export class SuggestionComponent implements OnInit, OnChanges {


    @Input() entry: BibliographicEntry;
    @Output() suggest: EventEmitter<BibliographicResource> = new EventEmitter();

    // make this visible to template
    environment = environment;

    selectedResource: BibliographicResource;
    suggestfield; // environment.production ? this.entry.title : this.entry.ocrData.title;

    internalSuggestions: BibliographicResource[];
    externalSuggestions: BibliographicResource[];

    committed = false;
    max_ex = 5;
    max_in = 5;

    testresource: BibliographicResource;

    constructor(private locdbService: LocdbService) { }

    ngOnInit() {
        const br: BibliographicResource = {
            //  _id: entry.references,
            title: 'title',
            publicationYear: '123',
                contributors: [],
                embodiedAs: [],
                parts: [],
        }
        this.testresource = br;
    }

    ngOnChanges() {
        if (this.entry) {
            this.fetchInternalSuggestions();
            this.fetchExternalSuggestions();
            this.suggestfield = this.entry.ocrData.title;
        } else {
            this.internalSuggestions = [];
            this.externalSuggestions = [];
        }
    }

    fetchInternalSuggestions(): void {
        console.log('Fetching internal suggestions for', this.entry);
        this.locdbService.suggestions(this.entry, false).subscribe( (sgt) => this.saveInternal(sgt) );
    }

    fetchExternalSuggestions(): void {
        console.log('Fetching external suggestions for', this.entry);
        this.locdbService.suggestions(this.entry, true).subscribe( (sgt) => this.saveExternal(sgt) );
    }

    // these two functions could go somewhere else e.g. static in locdb.ts
    // BEGIN
    authors2contributors (authors: string[]): AgentRole[] {
        if (!authors) {return []};
        const contributors = [];
        for (const author of authors) {
            const agent: ResponsibleAgent = {
                nameString: author,
                identifiers: [],
                givenName: '',
                familyName: '',
            }
            const role: AgentRole = {
                roleType: 'author',  /// TODO FIXME this is totally outdated
                heldBy: agent,
                identifiers: [],
            }
            contributors.push(role);
        }
        return contributors;
    }

    resourceFromEntry(entry): BibliographicResource {
        console.log('resourceFromEntry', entry)

        // When the production backend is used, entry does not have ocr data yet
        // but when the development backend is used, entry does indeed have ocr data field
        console.log('ENTRY REFERENCES', entry.references);
        const ocr = entry.ocrData;
        const br: BibliographicResource = {
            // _id: entry.references,
            title: ocr.title,
            publicationYear: ocr.date, // unary + operator makes it a number
                contributors: this.authors2contributors(ocr.authors),
                embodiedAs: [],
                parts: [],
        }

        return br;
    }
    // END

    plusPressed() {
        const newResource: BibliographicResource = this.resourceFromEntry(this.entry);
        this.locdbService.pushBibligraphicResource(newResource).subscribe(
          (br) => { this.internalSuggestions.push(br); this.selectedResource = br }
        );
    }


    onSelect(br?: BibliographicResource): void {
        console.log('Suggestion emitted', br);
        this.selectedResource = br;
        this.committed = false;
        this.suggest.next(br);
    }

    refreshSuggestions() {
        console.log('Internal Suggestions: ', this.internalSuggestions);
        console.log('External Suggestions: ', this.externalSuggestions);

        const searchentry = JSON.parse(JSON.stringify(this.entry)); // why is deep copy needed?
        searchentry.ocrData.title = this.suggestfield;
        console.log('Searchentry: ', searchentry);
        console.log('get internal Suggestions');
        //     this.locdbService.suggestions(searchentry, false).subscribe( (sgt) => this.internalSuggestions = sgt );
        this.locdbService.suggestions(searchentry, false).subscribe( (sgt) => this.saveInternal(sgt) );
        console.log('get external Suggestions');
        //     this.locdbService.suggestions(this.entry, true).subscribe( (sgt) => this.externalSuggestions = sgt );
        this.locdbService.suggestions(this.entry, true).subscribe( (sgt) => this.saveExternal(sgt) );
        console.log('Done.');
        this.entry = searchentry;
    }

    saveInternal(sgt) {
        // if (sgt.length == 0) {
        //   this.internalSuggestions = MOCK_INTERNAL;
        // }
        // else {
        this.internalSuggestions = sgt
        console.log('Received Internal Suggestions: ', this.internalSuggestions);
        // }
    }

    saveExternal(sgt) {
        this.externalSuggestions = sgt
        console.log('Received External Suggestions: ', this.externalSuggestions);
    }

    commit() {
      // This the actual linking of entry to resource
      if (this.selectedResource.status === 'EXTERNAL') {
        this.locdbService.pushBibligraphicResource(this.selectedResource).subscribe(
          (response) => {
            this.entry.references = response._id;
            this.locdbService.putBibliographicEntry(this.entry);
            console.log('Submitted Entry pointing to former external BR', response);
            this.committed = true;
          }
        );
      } else {
        this.entry.references = this.selectedResource._id;
        this.locdbService.putBibliographicEntry(this.entry).subscribe( (result) => {
          this.committed = true;
          console.log('Submitted Entry with result', result)
        });
      }
    }

    toggle_max_ex() {
      if (this.max_ex === 0) {
        this.max_ex = 5;
      } else {
          this.max_ex = 0;
      }
    }

    toggle_max_in() {
      if (this.max_in === 0) {
        this.max_in = 5;
      } else {
          this.max_in = 0;
      }
    }

}
