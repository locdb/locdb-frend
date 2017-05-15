import { Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';

import { BibliographicEntry, BibliographicResource, AgentRole, ResponsibleAgent } from '../locdb';
import { LocdbService } from '../locdb.service';


@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnChanges {

  @Input() entry: BibliographicEntry;
  @Output() suggest: EventEmitter<BibliographicResource> = new EventEmitter();

  internalSuggestions : BibliographicEntry[] | BibliographicResource[];

  externalSuggestions : any[];

  constructor(private locdbService: LocdbService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.entry){
      this.fetchInternalSuggestions();
      this.fetchExternalSuggestions();
    } else {
      this.internalSuggestions = [];
      this.externalSuggestions = [];
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

  // these two functions could go somewhere else e.g. static in locdb.ts
  // BEGIN
  authors2contributors (authors: string[]): AgentRole[] {
    let contributors = [];
    for (let author of authors) {
      const agent: ResponsibleAgent = {
        nameString: author,
        identifiers: [],
        givenName: "",
        familyName: "",
      }
      const role: AgentRole = {
        roleType: "author",
        heldBy: agent,
        identifiers: [],
      }
      contributors.push(role);
    }
    return contributors;
  }

  resourceFromEntry(entry: BibliographicEntry) : BibliographicResource {
    let ocr = entry.ocrData;    // no ocrData
    let br : BibliographicResource = {
      _id: entry.references,
      title: ocr.title,
      publicationYear: +ocr.date, // unary + operator makes it a number
      contributors: this.authors2contributors(ocr.authors),
      embodiedAs: [],
      parts: [],
    }

    return br;
  }
  // END


  onSelect(br?: BibliographicResource) : void {
    if (!br) {
      console.log("New BibResource created")
      this.suggest.next(this.resourceFromEntry(this.entry));
    } else {
      console.log("Suggestion emitted", br);
      this.suggest.next(br);
    }
  }

}
