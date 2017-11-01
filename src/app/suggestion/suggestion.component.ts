import { Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';

import { BibliographicEntry, BibliographicResource, AgentRole, ResponsibleAgent, ProvenResource } from '../locdb';
import { LocdbService } from '../locdb.service';

import { MOCK_INTERNAL } from '../mock-bresources'

import { AccordionModule } from 'ngx-bootstrap/accordion';

import { environment } from 'environments/environment';

import { ToDoStates, Provenance } from '../locdb';


@Component({
    selector: 'app-suggestion',
    templateUrl: './suggestion.component.html',
    styleUrls: ['../locdb.css', './suggestion.component.css']
})

export class SuggestionComponent implements OnInit, OnChanges {


    // retain entry as input, then we can modifiy its 'references' field
    @Input() entry: BibliographicEntry;
    @Output() suggest: EventEmitter<BibliographicResource> = new EventEmitter();

    // make this visible to template
    environment = environment;

    selectedResource: BibliographicResource;
    query: string;

    internalSuggestions: ProvenResource[];
    externalSuggestions: ProvenResource[];
    localResources: ProvenResource[] = [];

    committed = false;
    max_shown_suggestions = 5
    max_ex = -1;
    max_in = -1;

    externalInProgress = false;
    internalInProgress = false;
    testresource: BibliographicResource;


    internalThreshold = 1.0;
    externalThreshold = 0.5;

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
          this.query = this.queryFromEntry(this.entry);
          this.refresh();
        } else {
          this.query = '';
        }
    }

    refresh() {
      // when search button is triggered
      this.fetchInternalSuggestions();
      this.fetchExternalSuggestions();
    }

    fetchInternalSuggestions(): void {
      this.internalInProgress = true;
      this.internalSuggestions = [];
      console.log('Fetching internal suggestions for', this.query, 'with threshold', this.internalThreshold);
      // this.locdbService.suggestionsByEntry(this.entry, false).subscribe( (sgt) => this.saveInternal(sgt) );
      this.locdbService.suggestionsByQuery(this.query, false, this.internalThreshold.toString()).subscribe(
        (sug) => this.saveInternal(sug),
        (err) => { this.internalInProgress = false }
      );
    }

    fetchExternalSuggestions(): void {
      this.externalInProgress = true;
      this.externalSuggestions = [];
      console.log('Fetching external suggestions for', this.query, 'with threshold', this.internalThreshold);
      // this.locdbService.suggestionsByEntry(this.entry, true).subscribe( (sgt) => this.saveExternal(sgt) );
      this.locdbService.suggestionsByQuery(this.query, true, this.externalThreshold.toString()).subscribe(
        (sug) => this.saveExternal(sug),
        (err) => { this.externalInProgress = false }
      );
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
                roleType: 'AUTHOR',
                heldBy: agent,
                identifiers: [],
            }
            contributors.push(role);
        }
        return contributors;
    }

    resourceFromEntry(entry): ProvenResource {
        console.log('resourceFromEntry', entry)

        // When the production backend is used, entry does not have ocr data yet
        // but when the development backend is used, entry does indeed have ocr data field
        console.log('ENTRY REFERENCES', entry.references);
        const ocr = entry.ocrData;
        const br: ProvenResource = {
          title: ocr.title || entry.bibliographicEntryText,
          publicationYear: ocr.date || '', // unary + operator makes it a number
          contributors: this.authors2contributors(ocr.authors),
          embodiedAs: [],
          parts: [],
          partOf: ocr.journal, // these two properties are new in ocr data
          number: ocr.volume, // hope they work
          status: ToDoStates.ext,
          provenance: Provenance.local
        }
        return br;
    }
  // END

    plusPressed() {
        const newResource: ProvenResource = this.resourceFromEntry(this.entry);
        this.localResources.push(newResource);
        this.selectedResource = newResource;
        // wait until commit
        // this.locdbService.pushBibligraphicResource(newResource).subscribe(
        //   (br) => { this.internalSuggestions.unshift(br); this.selectedResource = br }
        // );
    }

    onSelect(br?: BibliographicResource): void {
        console.log('Suggestion emitted', br);
        this.selectedResource = br;
        this.committed = false;
        this.suggest.next(br);
    }

    saveInternal(sgt) {
        // if (sgt.length == 0) {
        //   this.internalSuggestions = MOCK_INTERNAL;
        // }
        // else {
        this.internalSuggestions = sgt
        if (this.internalSuggestions && this.internalSuggestions.length <= this.max_shown_suggestions) {
          this.max_in = -1;
        } else {
          this.max_in = this.max_shown_suggestions;
        }
        this.internalInProgress = false;
        console.log('Received Internal Suggestions: ', this.internalSuggestions);
        // }
    }

    saveExternal(sgt) {
        this.externalSuggestions = sgt;
        if (this.externalSuggestions && this.externalSuggestions.length <= this.max_shown_suggestions) {
          this.max_ex = -1;
        } else {
          this.max_ex = this.max_shown_suggestions;
        }
        console.log('Received External Suggestions: ', this.externalSuggestions);
        this.externalInProgress = false;
    }

    commit() {
      // This the actual linking of entry to resource
      if (this.selectedResource.status === ToDoStates.ext) {
        this.selectedResource.status = ToDoStates.valid;
        this.locdbService.pushBibligraphicResource(this.selectedResource).subscribe(
          (response) => {
            this.entry.references = response._id;
            this.locdbService.putBibliographicEntry(this.entry);
            console.log('Submitted Entry pointing to former external BR', response);
            this.committed = true;
          },
          (error) => {
            this.selectedResource.status = ToDoStates.ext;
            console.log('Submitting external resource failed');
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
        this.max_ex = this.max_shown_suggestions;
      } else {
          this.max_ex = 0;
      }
    }

    toggle_max_in() {
      if (this.max_in === 0) {
        this.max_in = this.max_shown_suggestions;
      } else {
          this.max_in = 0;
      }
    }


  // contributors2authors(roles: AgentRole[]) {
  //   const authors = roles.map( (role) => role.heldBy.nameString);
  //   const names = authors.join(' ');
  //   return names
  // }

  queryFromEntry(entry: BibliographicEntry): string {
    const ocr = entry.ocrData;
    const names = ocr.authors.join(' ');
    const query = `${entry.ocrData.title} ${names} ${entry.bibliographicEntryText}`;
    return query;
  }

}
