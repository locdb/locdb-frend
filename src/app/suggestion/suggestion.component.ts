import { ViewChild, Component, OnInit, OnChanges, AfterViewInit, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';
import { LocdbService } from '../locdb.service';
import { LoggingService } from '../logging.service'
import { MOCK_INTERNAL } from '../mock-bresources'
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { environment } from 'environments/environment';
import { PopoverModule } from 'ngx-popover';
import { Http } from '@angular/http';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { enums, models, TypedResourceView, Metadata, OCR2MetaData } from '../locdb';
import { REQUIRED_IDENTIFIERS } from '../ingest/constraints';

import { fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx'
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

import { StandardPipe } from '../pipes/type-pipes';

import { BibliographicEntryService } from '../typescript-angular-client/api/bibliographicEntry.service'

function sortByName(a, b) {
  const nameA = a.name.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}


@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})

export class SuggestionComponent implements OnInit, OnChanges {

  // Unused, we do not do pop-overs any more
  // @ViewChild('newResourcePanel') newResourceChild ;
  // retain entry as input, then we can modifiy its 'references' field
  @Input() entry: models.BibliographicEntry;
  @Output() suggest: EventEmitter<models.BibliographicResource> = new EventEmitter();

  // filter: [TypedResourceView, TypedResourceView] => boolean
  filter_options: {
    source: Array<{name, filter}>,
      resource_type: Array<{name, filter}>,
      contained: Array<{name, filter}>,
      year: Array<{name, filter}>
  };
  selection: { source: string, resource_type: string, contained: string, year: string };


  // make this visible to template
  environment = environment;

  selectedResource: [TypedResourceView, TypedResourceView] = [null, null];
  query: string;

  isAdaptingQuery = false;
  isRefiningResults = false;
  search_extended = false;

  private _internalSuggestions: Array<[TypedResourceView, TypedResourceView]>;
  set internalSuggestions( suggestions: Array<[TypedResourceView, TypedResourceView]>) {
    this._internalSuggestions = suggestions
    this.refreshFilterOptions()
  }
  get internalSuggestions(): Array<[TypedResourceView, TypedResourceView]> {
    return this.filterSuggestions(this._internalSuggestions)
  }

  private _externalSuggestions: Array<[TypedResourceView, TypedResourceView]>;
  set externalSuggestions(suggestions: Array<[TypedResourceView, TypedResourceView]>) {
    this._externalSuggestions = suggestions
    this.refreshFilterOptions()
  }

  get externalSuggestions() {
    return this.filterSuggestions(this._externalSuggestions)
  }

  private _currentTarget: [TypedResourceView, TypedResourceView];
  get currentTarget() {
    return this._currentTarget;
  }
  set currentTarget(target: [TypedResourceView, TypedResourceView]) {
    if (target instanceof TypedResourceView) {
      this._currentTarget = [target, null];
    } else {
      this._currentTarget = target;
    }

  }

  modalRef: BsModalRef;
  newResource: [TypedResourceView, TypedResourceView] = null;

  committed = false;
  committing = false;
  max_shown_suggestions = 5
  max_ex = -1;
  max_in = -1;

  /* Flags for loading indicators */
  externalInProgress = false;
  internalInProgress = false;

  /* Default top-k thresholds */
  threshold: number = null;
  // internalThreshold = 5;
  // externalThreshold = 30;
  dataSource: Observable<any>;


  constructor(private locdbService: LocdbService,
    private loggingService: LoggingService,
    private modalService: BsModalService,
    private entryService: BibliographicEntryService) {
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.query);
    }).mergeMap((token: string) => this.getStatesAsObservable(token)).map(r => r.map( s => this.extractTypeahead(s)));
    // Important else template fails in the beginning.
    this.initFilterOptions();
  }

  search_filter(selection_type: string, selection_name: string) {
    // returns the correct filter depending on the selection
    return this.filter_options[selection_type]
      .find(e => e.name === selection_name)
      .filter
  }

  initFilterOptions() {
    // initialize the filter options

    // inital set of options
    this.filter_options = {
      source: [
        {name: 'All', filter: e => true}
      ],
      resource_type: [
        {name: 'All', filter: e => true}
      ],
      contained: [{name: 'All', filter: e => true},
        {name: 'Contained', filter: e => !!e[1]},
        {name: 'Standalone', filter: e => !e[1]}
      ],
      year: [{name: 'All', filter: e => true}]
    };


    let preselectedSource = 'All'; // default
    if (!!this.selection && this.selection.source !== 'All') {
      // Store preselection if it differs from 'All'
      preselectedSource = this.selection.source;
      // make sure the preselection filter is in the options
      this.filter_options.source.push({name: preselectedSource, filter: e => e.some(x => x ? x.source === preselectedSource : false)});
    }

    // pre-selected values
    this.selection = {
      source: preselectedSource,
      resource_type: 'All',
      contained: 'All',
      year: 'All'
    };
  }

  refreshFilterOptions() {
    this.initFilterOptions();
    for (const suggestion of this.internalSuggestions.concat(this.externalSuggestions)) {
      if (suggestion) {
        // source selection
        let source = undefined
        if (suggestion[1]) {
          source = suggestion[1].source
        } else {
          source = suggestion[0].source
        }
        if (source && this.filter_options.source.every(y => y.name !== source)) {
          this.filter_options.source.push({name: source,
            filter: e => e.some(x => x ? x.source === source : false)})
        }
        const rtype = suggestion[0].type
        if (rtype && this.filter_options.resource_type.every(y => y.name !== rtype)) {
          this.filter_options.resource_type.push({name: rtype,
            filter: e => e.some(x => x ? x.type === rtype : false)})
        }

        if (suggestion[0].publicationDate) {
          // only add a filter when there is an actual date
          const year = suggestion[0].publicationDate.getFullYear();
          const yearString = year.toString();
          if (year && this.filter_options.year.every(y => y.name !== yearString)) {
            this.filter_options.year.push({name: yearString,
              filter: e => e.some(x => x && x.publicationDate ? x.publicationDate.getFullYear() === year : false )
            });
          }
        }
      }
    }

    // Sort the entries for nicer selection
    this.filter_options.source.sort(sortByName)
    this.filter_options.resource_type.sort(sortByName)
    this.filter_options.contained.sort(sortByName)
    this.filter_options.year.sort(sortByName)
  }

  filterSuggestions(suggestions: Array<[TypedResourceView, TypedResourceView]>) {
    // Apply all selected filters
    if (suggestions !== null && suggestions !== undefined) {
      return suggestions.filter(e => e !== null && e !== undefined)
        .filter(this.search_filter('source',
          this.selection.source))
        .filter(this.search_filter('resource_type',
          this.selection.resource_type))
        .filter(this.search_filter('contained',
          this.selection.contained))
        .filter(this.search_filter('year',
          this.selection.year))
    } else { return suggestions; }
  }

  extractTypeahead(typedTuple: [TypedResourceView, TypedResourceView]) {
    return new TypeaheadObj(typedTuple)
  }

  getStatesAsObservable(token: string): Observable<any> {
    return this.locdbService.suggestionsByQuery(token, false, 20);
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log('[Suggestion][debug]Selected value: ', e.item.id);
    this.query = e.item.id
    this.internalSuggestions = [e.item.typedTuple]
    this.selectedResource = e.item.typedTuple
  }

  ngOnInit() {
  }

  getTypeaheadSuggestions(value, index) {
    return this.locdbService.suggestionsByQuery(value, false, 20);
  }

  ngOnChanges(changes: SimpleChanges | any) {
    this.committing = false; // entry has changed, apparrently not committing
    this.committed = false; // entry has changed, so don't show success message
    // console.log('[Suggestion][debug] ngOnChanges called');
    // reset filters
    this.initFilterOptions();
    // This is called every time the input this.entry changes //
    if (this.entry) {
      console.log('Entry: ', this.entry)
      this.query = this.queryFromEntry(this.entry);
      // this.refresh();
      this.fetchInternalSuggestions();
      this.fetchPrecalculatedSuggestions();
      // add new Resource
      // does not work with new datamodel
      // this.newResource = this.resourceFromEntry(this.entry);
      this.newResource = null;
      if (this.entry.references) {
        // entry already has a link
        this.locdbService.bibliographicResource(this.entry.references).subscribe(
          (trv) => {
            // is null parent correct here or should we also retrieve it
            if (trv.partOf) {
              this.locdbService.bibliographicResource(trv.partOf).subscribe(
                (container) => this.currentTarget = [trv, container],
                (error) => { console.log('[Suggestion][error]Could not retrieve container'); this.currentTarget = [trv, null]; }
              );
              } else {
                this.currentTarget = [trv, null];
                this.onSelect(this.currentTarget);
              }
          },
          (err) => { console.log('[Suggestion][error]Invalid entry.references pointer', this.entry.references) });
      } else {
        // entry was not linked yet
        this._currentTarget = null;
        // this.onSelect(this.newResource);
      }
    } else {
      this.query = '';
    }
  }


  refresh() {
    // when search button is triggered
    this.loggingService.logSearchIssued(
      this.entry,
      this.selectedResource[0],
      this.query,
      [this.threshold, this.threshold]
    );
    // Why would we reset the newResource here
    // this.newResource = [null, null];
    this.fetchInternalSuggestions();
    this.fetchExternalSuggestions();
  }

  fetchPrecalculatedSuggestions(): void {
    if (!this.entry) { return; }
    const pinnedEntry = this.entry;
    this.externalInProgress = true;
    console.log('[Suggestion][info]Fetching precalculated suggestions for:', this.entry)
    this.locdbService.precalculatedSuggestions(this.entry).subscribe(
      (suggestions) => {
        Object.is(this.entry, pinnedEntry) ? this.saveExternal(suggestions) : console.log('[Suggestion][info]Discard precalc suggestions');
        console.log('[Suggestion][info]Received Precalculated External Suggestions:', suggestions)
        if (!suggestions.length) {
          console.log('[Suggestion][info]Empty precalc. suggestions: falling back to standard retrieval');
          this.fetchExternalSuggestions();
        }
      },
      (err) => {
        console.log('[Suggestion][error]Precalculated suggestions errored, fetching standard external suggestions');
        this.fetchExternalSuggestions(); // if there was an error, fall back to normal suggs
      }
    );

  }

  fetchInternalSuggestions(): void {
    if (!this.query) { return };
    const threshold = this.threshold ? this.threshold : 20;
    const oldEntry = this.entry;
    this.internalInProgress = true; // loading icon
    this.internalSuggestions = [];
    console.log('[Suggestion][info]Fetching internal suggestions for', this.query, 'with threshold', threshold);
    // this.locdbService.suggestionsByEntry(this.entry, false).subscribe( (sgt) => this.saveInternal(sgt) );
    this.locdbService.suggestionsByQuery(this.query, false, threshold).subscribe(
      (sug) => { Object.is(this.entry, oldEntry) ? this.saveInternal(sug) : console.log('discarded suggestions')
      },
      (err) => { this.internalInProgress = false; console.log(err) }
    );
  }

  fetchExternalSuggestions(): void {
    if (!this.query) { return };
    const threshold = this.threshold ? this.threshold : 20;
    const oldEntry = this.entry;
    this.externalInProgress = true; // loading icon
    this.externalSuggestions = [];
    console.log('[Suggestion][info]Fetching external suggestions for', this.query, 'with threshold', threshold);
    // this.locdbService.suggestionsByEntry(this.entry, true).subscribe( (sgt) => this.saveExternal(sgt) );
    this.locdbService.suggestionsByQuery(this.query, true, threshold).subscribe(
      (sug) => { Object.is(this.entry, oldEntry) ? this.saveExternal(sug) : console.log('discarded suggestions')
        // this.loggingService.logSuggestionsArrived(this.entry, sug, false)
      },
      (err) => { this.externalInProgress = false; console.log(err)}
    );
  }

  // these two functions could go somewhere else e.g. static in locdb.ts
  // BEGIN
  authors2contributors (authors: string[]): models.AgentRole[] {
    if (!authors) {return []};
    const contributors = [];
    for (const author of authors) {
      const agent: models.ResponsibleAgent = {
        nameString: author,
        identifiers: [],
        givenName: '',
        familyName: '',
      }
      const role: models.AgentRole = {
        roleType: 'AUTHOR',
        heldBy: agent,
        identifiers: [],
      }
      contributors.push(role);
    }
    return contributors;
  }

  // Turns OCR data into (partial) metadata, the type is missing
  // Duplicate code with locdb.ts
  // resourceFromEntry(entry: models.BibliographicEntry): Partial<Metadata> {
  //     const ocr = entry.ocrData;
  //     const br: Partial<Metadata> = {
  //       title: ocr.title || entry.bibliographicEntryText,
  //       publicationDate: new Date(ocr.date), // unary + operator makes it a number
  //       contributors: this.authors2contributors(ocr.authors),
  //       number: ocr.volume || '', // hope they work
  //       identifiers: entry.identifiers.filter(i => i.scheme && i.literalValue), // only valid ones
  //     }
  //     return br;
  // }

  onSelect(br?: [TypedResourceView, TypedResourceView]): void {
    this.loggingService.logReferenceTargetSelected(this.entry, br[0])
    this.selectedResource = br;
    this.committed = false;
    this.suggest.emit(br[0]);
  }

  saveInternal(sgt: Array<[TypedResourceView, TypedResourceView]>) {
    this.loggingService.logSuggestionsArrived(this.entry, sgt.length, true)
    this.internalSuggestions = sgt
    if (this.internalSuggestions && this.internalSuggestions.length <= this.max_shown_suggestions) {
      this.max_in = -1;
    } else {
      this.max_in = this.max_shown_suggestions;
    }
    this.internalInProgress = false;
    console.log('[Suggestion][info]Received Internal Suggestions: ', this.internalSuggestions);
    // }
  }

  saveExternal(sgt: Array<[TypedResourceView, TypedResourceView]>) {
    this.loggingService.logSuggestionsArrived(this.entry, sgt.length, false)
    this.externalSuggestions = sgt;
    if (this.externalSuggestions && this.externalSuggestions.length <= this.max_shown_suggestions) {
      this.max_ex = -1;
    } else {
      this.max_ex = this.max_shown_suggestions;
    }
    console.log('[Suggestion][info]Received External Suggestions: ', this.externalSuggestions);
    this.externalInProgress = false;
  }

  unlink(entry) {
    this.entryService.removeTargetBibliographicResource(this.entry._id).subscribe(
      (success) => {
        entry.status = enums.status.ocrProcessed; // back-end does it this way
        entry.references = '';
        this.currentTarget = null;
      },
      (error) => alert('[Suggestion][error]Could not remove citation link: ' + error.message)
    );
  }

  link(entry: models.BibliographicEntry, citationTargetPair: [TypedResourceView, TypedResourceView | null]) {
    const citationTargetResourceId = citationTargetPair[0]._id;
    if (!entry) { console.log('[Suggestion][error][link]No valid entry', entry); return ''; };
    if (!citationTargetResourceId) { console.log('[Suggestion][error][link] No valid target', citationTargetPair); return ''; };

    if (entry.references) {
      // Replace old citation target
      console.log('[Suggestion][info]Replacing citation target');
      this.entryService.removeTargetBibliographicResource(entry._id).subscribe(
        (newResource) => {
          console.log('[Suggestion][info]Result of remove target', newResource);
          entry.status = enums.status.ocrProcessed; // back-end does it this way
          entry.references = '';
          this.entryService.addTargetBibliographicResource(entry._id, citationTargetResourceId).subscribe(
            (success) => {
              this.loggingService.logCommited(this.entry, citationTargetPair[0], null);
              entry.status = enums.status.valid;
              entry.references = citationTargetResourceId;
              this.committed = true;
              this.committing = false;
              console.log('[Suggestion][info]Replaced citation target')
              this.currentTarget = citationTargetPair;
              this.selectedResource = this.currentTarget;
            },
            (error) => { alert('[Suggestion][error]Error while replacing citation target: ' + error.message); this.committing = false; }
          )
        },
        (error) => { alert('[Suggestion][error]Could not remove citation link: ' + error.message); this.committing = false; }
      );
    } else {
      // Add new citation target
      this.entryService.addTargetBibliographicResource(entry._id, citationTargetResourceId).subscribe(
        (success) => {
          this.loggingService.logCommited(this.entry, citationTargetPair[0], null);
          entry.status = enums.status.valid;
          entry.references = citationTargetResourceId;
          this.committed = true;
          this.committing = false;
          console.log('[Suggestion][info]Added citation target')
          this.currentTarget = citationTargetPair;
          this.selectedResource = this.currentTarget;
        },
        (error) => { alert('[Suggestion][error]Error while replacing citation target: ' + error.message); this.committing = false; }
      );
    }
  }

  commit(entry: models.BibliographicEntry, citationTargetPair: [TypedResourceView, TypedResourceView | null]) {
    this.loggingService.logCommitPressed(this.entry, this.selectedResource[0], null);
    this.committing = true;
    const [resource, container] = citationTargetPair;
    if (container) {
      this.locdbService.maybePostResource(container).subscribe(
        (newContainer) => {
          citationTargetPair[1] = newContainer;
          resource.data.partOf = newContainer._id;
          this.locdbService.maybePostResource(resource).subscribe(
            (newResource) => {
              citationTargetPair[0] = newResource;
              this.link(entry, [newResource, newContainer]);
            },
            (error) => { alert('[Suggestion][error]Error while updating resource: ' + error.message); this.committing = false;  }
          );
          },
        (error) => { alert('[Suggestion][error]Error while updating container: ' + error.message); this.committing = false; }
      );
    } else {
      this.locdbService.maybePostResource(resource).subscribe(
        (newResource) => {
          // update own view with response from back-end
          citationTargetPair[0] = newResource;
          // actually link the source to parent
          this.link(entry, [newResource, null]);

        },
        (error) => { alert('[Suggestion][error]Error while updating resource: ' + error.message); this.committing = false; }
      );
    }


    // this.locdbService.safeCreateAndUpdate(citationTargetPair).then()
    // console.log('Start commit', this.selectedResource)
    // const pr = this.selectedResource[0];
    // console.log('selected Resource ', pr )
    // console.log('entry ', this.entry)
    // console.log('Call Logging');
    // // unused
    // // const pinnedResource = this.selectedResource;
    // console.log('Committing pair:', this.selectedResource);
    // this.locdbService.safeCommitLink(this.entry, this.selectedResource).then(
    //   res => {
    //     this.currentTarget = res;
    //     this.onSelect(this.currentTarget);
    //     this.committed = true;
    //     console.log('Log after commit');
    //   },
    //   err => { console.log(err); alert('An error occurred.' + err.message) }
    // )
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

  queryFromEntry(entry: models.BibliographicEntry): string {
    const dois = entry.identifiers.filter(x => x.scheme === enums.identifier.doi);
    if (dois.length > 0 && dois[0].literalValue) {
      return dois[0].literalValue;
    } else if (entry.ocrData && entry.ocrData.title) {
      return `${entry.ocrData.title} ${entry.ocrData.date}`;
    } else if (entry.bibliographicEntryText) {
      return entry.bibliographicEntryText;
    }
    return '';
  }

  agentFromName(forminput: string): models.ResponsibleAgent {
    const [lastname, firstname, ...other] = forminput.split(';');
    return {
      identifiers: [],
      givenName: firstname,
      familyName: lastname,
      nameString: forminput // retain original input
    }
  }

  createResourceFromMetaData() {
    const metadata = OCR2MetaData(this.entry.ocrData);
    const nresource = new TypedResourceView({type: metadata.type});
    nresource.set_from(metadata);
    this.newResource = [nresource, null];
    console.log('[Suggestion][info]Created new resource', this.newResource);
    this.selectedResource = this.newResource;
  }

  encodeURI(uri: string) {
    return encodeURIComponent(uri);
  }

  toggle_extended_search() {
    this.search_extended = !this.search_extended;
  }


  // Compute number of non-internal resources
  countExternal(resourcePair: [TypedResourceView, TypedResourceView | null]) {
    if (!resourcePair) { return 0; }
    return resourcePair.filter(x => x !== null).filter(x => !x._id).length;
  }

  // Short-hand method to select and commit.
  linkToThis(resourcePair: [TypedResourceView, TypedResourceView | null]) {
    this.onSelect(resourcePair);
    this.commit(this.entry, resourcePair);
  }

  getLinkButtonTextForPair(resourcePair: [TypedResourceView, TypedResourceView | null]) {
    const cnt = this.countExternal(resourcePair);
    if (!cnt) {
      // Nothing needs to be migrated
      return 'Link';
    }

    if (cnt === 1) {
      // Special singular treatment for one
      return 'Migrate 1 Resource and Link';
    }

    return `Migrate ${cnt} Resources and Link`;

  }

}

class TypeaheadObj {
  private id;
  private name;
  private typedTuple;

  constructor(typedTuple: [TypedResourceView, TypedResourceView]) {
    this.typedTuple = typedTuple;
    const tr = typedTuple[0];
    this.id = tr._id;
    this.name = (new StandardPipe().transform(tr)).replace(/<.*?>/, '').replace(/<\/.*?>/, '')
  }

  public toString (): string {
    return this.name
  }
}
