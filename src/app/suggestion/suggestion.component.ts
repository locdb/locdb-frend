import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';
import { BibliographicEntry, BibliographicResource, AgentRole, ResponsibleAgent, ProvenResource } from '../locdb';
import { LocdbService } from '../locdb.service';
import { LoggingService } from '../logging.service'
import { MOCK_INTERNAL } from '../mock-bresources'
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { environment } from 'environments/environment';
import { ResourceStatus, Provenance, Origin } from '../locdb';
import { PopoverModule } from 'ngx-popover';
import { Http } from '@angular/http';


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



    constructor(private locdbService: LocdbService, private loggingService: LoggingService) { }

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
      this.loggingService.logSearchIssued(this.entry, this.selectedResource, this.query, [0,1])
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
        (sug) => { Object.is(this.entry, oldEntry) ? this.saveInternal(sug) : console.log('discarded suggestions')
                    this.loggingService.logSuggestionsArrived(this.entry, sug, true) },
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
        (sug) => { Object.is(this.entry, oldEntry) ? this.saveExternal(sug) : console.log('discarded suggestions')
                    this.loggingService.logSuggestionsArrived(this.entry, sug, false) },
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
        console.log('Suggestion emitted', br);
        this.loggingService.logReferenceTargetSelected(this.entry, br)
        // <------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
      console.log('Start commit', this.selectedResource)
      const pr = this.selectedResource;
      const provenance = pr.provenance;
      console.log('Call Logging');
      this.loggingService.logCommitPressed(this.entry, this.selectedResource, provenance);
      const pinnedResource = this.selectedResource;
      console.log('Commit');
      this.locdbService.safeCommitLink(this.entry, this.selectedResource).then(
        res => {
          this.currentTarget = new ProvenResource(res);
          this.onSelect(this.currentTarget);
          console.log('Log after commit');
          this.loggingService.logCommited(this.entry, this.currentTarget, provenance);
        })
        .catch(err => alert('Something went wrong during commit: ' + err));
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

  queryFromEntry(entry: BibliographicEntry): string {
    if (entry.ocrData.title) {
      // if metadata is available, use it in favor of raw text
      return `${entry.ocrData.title} ${entry.ocrData.authors.join(' ')}`
    } else {
      // authors typically included in entry text already
      return `${entry.bibliographicEntryText}`
    }
  }

  encodeURI(uri: string){
    return encodeURIComponent(uri)
  }

}
