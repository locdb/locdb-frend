import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';

import { BibliographicEntry, BibliographicResource, AgentRole, ResponsibleAgent, ProvenResource } from '../locdb';
import { LocdbService } from '../locdb.service';

import { MOCK_INTERNAL } from '../mock-bresources'

import { AccordionModule } from 'ngx-bootstrap/accordion';

import { environment } from 'environments/environment';

import { ToDoStates, Provenance } from '../locdb';

import { PopoverModule } from 'ngx-popover';


@Component({
    selector: 'app-suggestion',
    templateUrl: './suggestion.component.html',
    styleUrls: ['./suggestion.component.css']
})

export class SuggestionComponent implements OnInit, OnChanges {


    // retain entry as input, then we can modifiy its 'references' field
    @Input() entry: BibliographicEntry;
    @Output() suggest: EventEmitter<BibliographicResource> = new EventEmitter();

    // make this visible to template
    environment = environment;

    selectedResource: ProvenResource;
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
    }

    ngOnChanges(changes: SimpleChanges | any) {
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
                this.onSelect(br);
              },
              (err) => { console.log('Invalid entry.references pointer', this.entry.references) });
          } else {
            // entry was not linked yet
            this.currentTarget = null;
            this.onSelect(this.newResource);
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
        const br: ProvenResource = new ProvenResource({
          title: ocr.title || entry.bibliographicEntryText,
          publicationYear: ocr.date || '', // unary + operator makes it a number
          contributors: this.authors2contributors(ocr.authors),
          embodiedAs: [],
          parts: [],
          partOf: '', // these two properties are new in ocr data
          containerTitle: ocr.journal || '',
          number: ocr.volume || '', // hope they work
          status: ToDoStates.ext,
          identifiers: entry.identifiers.filter(i => i.scheme && i.literalValue),
          provenance: Provenance.local
        });
        return br;
    }

    onSelect(br?: ProvenResource): void {
        console.log('Suggestion emitted', br);
        this.selectedResource = br;
        this.committed = false;
        this.suggest.emit(br);
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
      const pinnedResource = this.selectedResource;
      this.locdbService.safeCommitLink(this.entry, this.selectedResource).then(
        res => {
          this.currentTarget = new ProvenResource(res);
          this.onSelect(this.currentTarget);
        })
        .catch(err => alert('Something went wrong during commit: ' + err));

      /* OLD overly complicated code below TODO remove */

      // This the actual linking of entry to resource
      // we could also check for _id
      // const pinnedResource = this.selectedResource;
      // const pinnedEntry = this.entry;
      // if (pinnedResource.status === ToDoStates.ext) {
      //   // selectedResource is either external or NEW
      //   pinnedResource.status = ToDoStates.valid;
      //   this.locdbService.pushBibligraphicResource(pinnedResource).subscribe(
      //     (response) => {
      //       // addTarget
      //       this.locdbService.addTargetBibliographicResource(this.entry, response).subscribe(
      //         (success) => {
      //           // addTarget succeeded
      //           // Update the view
      //           pinnedEntry.status = 'VALID';
      //           console.log('Setting entry references to', response._id);
      //           pinnedEntry.references = response._id;
      //           if (Object.is(this.entry, pinnedEntry)) { // guarding entry changes
      //             this.currentTarget = new ProvenResource(response); // update view
      //             this.onSelect(this.currentTarget);
      //           }
      //         },
      //         // addTarget failed
      //         (error) => console.log('Could not add target', this.entry, response)
      //       );
      //     },
      //     (error) => {
      //       // push failed, so reset state
      //       pinnedResource.status = ToDoStates.ext;
      //       console.log('Submitting external resource failed');
      //     }
      //   );
      // } else { // Resource was an internal suggestion
      //   this.locdbService.addTargetBibliographicResource(this.entry, this.selectedResource).subscribe(
      //     (success) => {
      //       // addTarget succeeded
      //       // update view
      //       pinnedEntry.status = 'VALID';
      //       pinnedEntry.references = pinnedResource._id;
      //       // are the surrounding statements ok if the selected Resource changes?
      //       if (Object.is(this.entry, pinnedEntry)) { // guarding entry changes
      //         this.currentTarget = pinnedResource; // update view
      //         this.onSelect(this.currentTarget);
      //       }
      //     },
      //     // addTarget failed
      //     (error) => console.log('Could not add target', this.entry, this.selectedResource)
      //   );
      // }
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
