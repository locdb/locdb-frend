import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';
import { BibliographicEntry, BibliographicResource, AgentRole, ResponsibleAgent, ProvenResource } from '../locdb';
import { LocdbService } from '../locdb.service';
import { LoggingService } from '../logging.service'
import { MOCK_INTERNAL } from '../mock-bresources'
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { environment } from 'environments/environment';
import { ResourceStatus, Provenance, Origin } from '../locdb';
import { PopoverModule } from 'ngx-popover';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {

      // retain entry as input, then we can modifiy its 'references' field

      // make this visible to template
      environment = environment;

      selectedResource: ProvenResource;
      query: string;

      internalSuggestions: ProvenResource[];

      currentTarget: ProvenResource;
      newResource: ProvenResource = null;

      committed = false;
      max_shown_suggestions = 5
      max_in = -1;

      internalInProgress = false;

      internalThreshold = 1.0;

      searchentry: BibliographicEntry = {}



      constructor(private locdbService: LocdbService, private loggingService: LoggingService) { }

      ngOnInit() {    }

      ngOnChanges() {   }

      refresh() {
        // when search button is triggered
        this.loggingService.logSearchIssued(this.searchentry, this.selectedResource, this.query, [0,1])
        this.fetchInternalSuggestions();
      }

      fetchInternalSuggestions(): void {
        this.internalInProgress = true; // loading icon
        this.internalSuggestions = [];
        console.log('Fetching internal suggestions for', this.query, 'with threshold', this.internalThreshold);
        this.locdbService.suggestionsByQuery(this.query, false, this.internalThreshold.toString()).subscribe(
          (sug) => {this.saveInternal(sug)
                        this.loggingService.logSuggestionsArrived(this.searchentry, sug, true) },
          (err) => { this.internalInProgress = false }
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
            partOf: '', // these two properties are new in ocr data
            containerTitle: ocr.journal || '',
            number: ocr.volume || '', // hope they work
            status: ResourceStatus.external,
            identifiers: entry.identifiers.filter(i => i.scheme && i.literalValue),
            provenance: Provenance.local
          }
          return br;
      }

      onSelect(br?: ProvenResource): void {
          this.committed = false;
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
      }

      toggle_max_in() {
        if (this.max_in === 0) {
          this.max_in = this.max_shown_suggestions;
        } else {
            this.max_in = 0;
        }
      }

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
