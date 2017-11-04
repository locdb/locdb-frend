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
    currentTarget: ProvenResource;
    newResource: ProvenResource = null;

    committed = false;
    max_shown_suggestions = 5
    max_ex = -1;
    max_in = -1;

    externalInProgress = false;
    internalInProgress = false;


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
    }

    ngOnChanges() {
        if (this.entry) {
          this.query = this.queryFromEntry(this.entry);
          this.refresh();
          // add new Resource
          this.newResource = this.resourceFromEntry(this.entry);
          if (this.entry.references) {
            // entry already has a link
            this.locdbService.bibliographicResource(this.entry.references).subscribe(
              (res) => {
                const br = new ProvenResource(res);
                this.currentTarget = br;
                this.selectedResource = br
              },
              (err) => { console.log('Invalid entry.references pointer', this.entry.references) });
          } else {
            // entry was not linked yet
            this.currentTarget = null;
            this.selectedResource = this.newResource;
          }
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
      const oldEntry = this.entry;
      this.internalInProgress = true; // loading icon
      this.internalSuggestions = [];
      console.log('Fetching internal suggestions for', this.query, 'with threshold', this.internalThreshold);
      // this.locdbService.suggestionsByEntry(this.entry, false).subscribe( (sgt) => this.saveInternal(sgt) );
      this.locdbService.suggestionsByQuery(this.query, false, this.internalThreshold.toString()).subscribe(
        (sug) => { Object.is(this.entry, oldEntry) ? this.saveInternal(sug) : console.log('discarded suggestions') },
        (err) => { this.internalInProgress = false }
      );
    }

    fetchExternalSuggestions(): void {
      const oldEntry = this.entry;
      this.externalInProgress = true; // loading icon
      this.externalSuggestions = [];
      console.log('Fetching external suggestions for', this.query, 'with threshold', this.externalThreshold);
      // this.locdbService.suggestionsByEntry(this.entry, true).subscribe( (sgt) => this.saveExternal(sgt) );
      this.locdbService.suggestionsByQuery(this.query, true, this.externalThreshold.toString()).subscribe(
        (sug) => { Object.is(this.entry, oldEntry) ? this.saveExternal(sug) : console.log('discarded suggestions') },
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
        const ocr = entry.ocrData;
        const br: ProvenResource = {
          title: ocr.title || entry.bibliographicEntryText,
          publicationYear: ocr.date || '', // unary + operator makes it a number
          contributors: this.authors2contributors(ocr.authors),
          embodiedAs: [],
          parts: [],
          partOf: null, // these two properties are new in ocr data
          containerTitle: ocr.journal || '',
          number: ocr.volume || '', // hope they work
          status: ToDoStates.ext,
          identifiers: entry.identifiers,
          provenance: Provenance.local
        }
        return br;
    }

    plusPressed() {
        const newResource: ProvenResource = this.resourceFromEntry(this.entry);
        this.newResource = newResource;
        this.selectedResource = newResource;
        // wait until commit
        // this.locdbService.pushBibligraphicResource(newResource).subscribe(
        //   (br) => { this.internalSuggestions.unshift(br); this.selectedResource = br }
        // );
    }

    onSelect(br?: ProvenResource): void {
        console.log('Suggestion emitted', br);
        this.selectedResource = br;
        this.committed = false;
        this.suggest.next(br);
    }

    saveInternal(sgt) {
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
      // we could also check for _id
      if (this.selectedResource.status === ToDoStates.ext) {
        // selectedResource is either external or NEW
        this.selectedResource.status = ToDoStates.valid;
        this.locdbService.pushBibligraphicResource(this.selectedResource).subscribe(
          (response) => {
            // this.entry.references = response._id;
            // this.locdbService.putBibliographicEntry(this.entry).subscribe(
            //   (second_response) => {
            //     // push succeeded now commit link
            //     console.log('Submitted Entry pointing to former external BR', response);
            //     this.committed = true;
            //   }
            // );
            // POST resource succeeded
            // remain in consitent state even if linking failed
            this.currentTarget = new ProvenResource(response); // update view
            this.selectedResource = this.currentTarget;
            // addTarget
            this.locdbService.addTargetBibliographicResource(this.entry, response).subscribe(
              (success) => {
                // addTarget succeeded
                // Update the view
                this.entry.status = 'VALID';
                console.log('Setting entry references to', response._id);
                this.entry.references = response._id;
              },
              // addTarget failed
              (error) => console.log('Could not add target', this.entry, response)
            );
          },
          (error) => {
            // push failed, so reset state
            this.selectedResource.status = ToDoStates.ext;
            console.log('Submitting external resource failed');
          }
        );
      } else { // Resource was an internal suggestion
        // this.entry.references = this.selectedResource._id;
        // this.locdbService.putBibliographicEntry(this.entry).subscribe( (result) => {
        //   this.committed = true;
        //   console.log('Submitted Entry with result', result)
        // });
        this.locdbService.addTargetBibliographicResource(this.entry, this.selectedResource).subscribe(
          (success) => {
            // addTarget succeeded
            // update view
            this.entry.status = 'VALID';
            this.entry.references = this.selectedResource._id;
            this.currentTarget = new ProvenResource(this.selectedResource);
          },
          // addTarget failed
          (error) => console.log('Could not add target', this.entry, this.selectedResource)
        )
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
    if (entry.ocrData.title) {
      // if metadata is available, use it in favor of raw text
      return `${entry.ocrData.title} ${entry.ocrData.authors.join(' ')}`
    } else {
      // authors typically included in entry text already
      return `${entry.bibliographicEntryText}`
    }
  }

}
