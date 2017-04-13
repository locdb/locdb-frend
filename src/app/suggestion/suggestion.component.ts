import { Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';

import { BibliographicEntry } from '../locdb';
import { LocdbService } from '../locdb.service';


@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnChanges {

  @Input() entry: BibliographicEntry;
  @Output() suggest: EventEmitter<BibliographicEntry> = new EventEmitter();

  internalSuggestions : BibliographicEntry[];

  externalSuggestions : any[];

  constructor(private locdbService: LocdbService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.entry){
      this.fetchInternalSuggestions();
      this.fetchExternalSuggestions();
    }
  }

  fetchInternalSuggestions() : void {
    console.log("Fetching internal suggestions for", this.entry);
    this.locdbService.suggestions(this.entry, false).subscribe( (sgt) => this.internalSuggestions = sgt );
  }

  fetchExternalSuggestions() : void {
    console.log("Fetching external suggestions for", this.entry);
    this.locdbService.suggestions(this.entry, true).subscribe( (sgt) => this.externalSuggestions = sgt );
  }


  onSelect(entryItem: BibliographicEntry) : void {
    console.log("Suggestion emitted", entryItem);
    this.suggest.next(<BibliographicEntry>entryItem);
  }

}
