import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';
import { TypedResourceView, models} from '../locdb';
import { LocdbService } from '../locdb.service';
import { LoggingService } from '../logging.service'
import { MOCK_INTERNAL } from '../mock-bresources'
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { environment } from 'environments/environment';
// import { ResourceStatus, Provenance, Origin } from '../locdb';
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

      selectedResource: TypedResourceView;
      query: string;

      internalSuggestions: TypedResourceView[];

      currentTarget: TypedResourceView;

      committed = false;
      max_shown_suggestions = 5
      max_in = -1;

      internalInProgress = false;

      internalThreshold = 0.1;

      searchentry: models.BibliographicEntry = {}



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
        this.locdbService.suggestionsByQuery(this.query, false, this.internalThreshold).subscribe(
          (sug) => {this.saveInternal(sug);
                        this.loggingService.logSuggestionsArrived(this.searchentry, sug, true) },
          (err) => { this.internalInProgress = false }
        );
      }

      // these two functions could go somewhere else e.g. static in locdb.ts
      // BEGIN


      onSelect(br?: TypedResourceView): void {
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


  }
