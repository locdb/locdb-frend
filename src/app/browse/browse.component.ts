import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';
import { TypedResourceView, models} from '../locdb';
import { LocdbService } from '../locdb.service';
import { LoggingService } from '../logging.service'
import { MOCK_INTERNAL } from '../mock-bresources'
import { environment } from 'environments/environment';

// import { ResourceStatus, Provenance, Origin } from '../locdb';
import { PopoverModule } from 'ngx-popover';

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
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit, OnChanges {

  // retain entry as input, then we can modifiy its 'references' field

  // make this visible to template
  environment = environment;
  title = 'Browse';

  selectedResource: [TypedResourceView, TypedResourceView];
  query: string;

  private _resourcePairs: Array<[TypedResourceView, TypedResourceView]>;
  set resourcePairs( pairs: Array<[TypedResourceView, TypedResourceView]>) {
    this._resourcePairs = pairs;
    this.refreshFilterOptions();
  }
  get resourcePairs(): Array<[TypedResourceView, TypedResourceView]> {
    return this.filterSuggestions(this._resourcePairs)
  }

  currentTarget: TypedResourceView;

  internalInProgress = false;
  internalThreshold = null;

  // Show filtering stuff
  isRefiningResults = false;

  // filter capabilities
  filter_options: {
    source: Array<{name, filter}>,
      resource_type: Array<{name, filter}>,
      contained: Array<{name, filter}>,
      year: Array<{name, filter}>
  };
  selection: { source: string, resource_type: string, contained: string, year: string };


  constructor(private locdbService: LocdbService, private loggingService: LoggingService) {
    this.initFilterOptions();
  }

  ngOnInit() {    }

  ngOnChanges() {   }

  refresh() {
    // when search button is triggered
    this.fetchInternalSuggestions();
  }

  fetchInternalSuggestions(): void {
    if (!this.query) { return; } // guard cause back-end fails

    const threshold = this.internalThreshold ? this.internalThreshold : 20; // default
    this.internalInProgress = true; // loading icon
    this.resourcePairs = [];
    console.log('Fetching internal suggestions for', this.query, 'with threshold', threshold);
    this.locdbService.suggestionsByQuery(this.query, false, threshold).subscribe(
      (sug) => {this.saveInternal(sug); },
      (err) => { alert('An error occurred: ' + err.message); this.internalInProgress = false }
    );
  }


  onSelect(pair: [TypedResourceView, TypedResourceView | null]): void {
    this.selectedResource = pair;
  }

  saveInternal(sgt: Array<[TypedResourceView, TypedResourceView | null]>) {
    this.resourcePairs = sgt;
    this.internalInProgress = false;
    console.log('Received Resource Pairs: ', this.resourcePairs);
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
    // pre-selected values
    this.selection = {
      source: 'All',
      resource_type: 'All',
      contained: 'All',
      year: 'All'
    };
  }

  refreshFilterOptions() {
    this.initFilterOptions();
    for (const pair of this.resourcePairs) {
      if (pair) {
        // source selection
        let source = undefined
        if (pair[1]) {
          source = pair[1].source
        } else {
          source = pair[0].source
        }
        if (source && this.filter_options.source.every(y => y.name !== source)) {
          this.filter_options.source.push({name: source,
            filter: e => e.some(x => x ? x.source === source : false)})
        }
        const rtype = pair[0].type
        if (rtype && this.filter_options.resource_type.every(y => y.name !== rtype)) {
          this.filter_options.resource_type.push({name: rtype,
            filter: e => e.some(x => x ? x.type === rtype : false)})
        }

        if (pair[0].publicationDate) {
          // only add a filter when there is an actual date
          const year = pair[0].publicationDate.getFullYear();
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

  search_filter(selection_type: string, selection_name: string) {
    // returns the correct filter depending on the selection
    return this.filter_options[selection_type]
      .find(e => e.name === selection_name)
      .filter
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
}
