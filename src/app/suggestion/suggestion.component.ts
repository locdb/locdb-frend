import { Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';

import { BibliographicEntry, BibliographicResource, AgentRole, ResponsibleAgent } from '../locdb';
import { LocdbService } from '../locdb.service';

import { MOCK_INTERNAL } from '../mock-bresources'

import { environment } from 'environments/environment';


@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnChanges {

  @Input() entry: BibliographicEntry;
  @Output() suggest: EventEmitter<BibliographicResource> = new EventEmitter();

  // make this visible to template
  environment = environment;
  
  suggestfield; //environment.production ? this.entry.title : this.entry.ocrData.title;

  internalSuggestions : BibliographicResource[];

  externalSuggestions : any[];

  constructor(private locdbService: LocdbService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.entry){
      this.fetchInternalSuggestions();
      this.fetchExternalSuggestions();
      this.suggestfield = this.entry.ocrData.title;
    } else {
      this.internalSuggestions = [];
      this.externalSuggestions = [];
    }
  }

  fetchInternalSuggestions() : void {
    console.log("Fetching internal suggestions for", this.entry);
    this.locdbService.suggestions(this.entry, false).subscribe( (sgt) => this.saveInternal(sgt) );
  }

  fetchExternalSuggestions() : void {
    console.log("Fetching external suggestions for", this.entry);
    this.locdbService.suggestions(this.entry, true).subscribe( (sgt) => this.saveExternal(sgt) );
  }

  // these two functions could go somewhere else e.g. static in locdb.ts
  // BEGIN
  authors2contributors (authors: string[]): AgentRole[] {
    if (!authors) return [];
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

  resourceFromEntry(entry) : BibliographicResource {
      console.log("resourceFromEntry", entry)

    // When the production backend is used, entry does not have ocr data yet
    // but when the development backend is used, entry does indeed have ocr data field
    console.log('ENTRY REFERENCES', entry.references);
    let ocr = entry.ocrData;
    let br : BibliographicResource = {
      //_id: entry.references,
      title: ocr.title,
      publicationYear: +ocr.date, // unary + operator makes it a number
      contributors: this.authors2contributors(ocr.authors),
      embodiedAs: [],
      parts: [],
    }

    return br;
  }
  // END

  plusPressed() {
    let newResource: BibliographicResource = this.resourceFromEntry(this.entry);
    this.locdbService.pushBibligraphicResource(newResource).subscribe( (br) => this.internalSuggestions.push(br));
  }


  onSelect(br?: BibliographicResource) : void {
    if (!br) {
      console.log("New BibResource created")
      this.suggest.next(this.resourceFromEntry(this.entry));
    } else {
      console.log("Suggestion emitted", br);
      this.suggest.next(br);
    }
  }
  
  refreshSuggestions(){
    console.log("Internal Suggestions: ", this.internalSuggestions);
    console.log("External Suggestions: ", this.externalSuggestions);
    console.log("Entry: ", this.entry);
    
    let searchentry = JSON.parse(JSON.stringify(this.entry));
    searchentry.ocrData.title = this.suggestfield;
    console.log("Searchentry: ", searchentry);
     console.log("get internal Suggestions");
//     this.locdbService.suggestions(searchentry, false).subscribe( (sgt) => this.internalSuggestions = sgt );
     this.locdbService.suggestions(searchentry, false).subscribe( (sgt) => this.saveInternal(sgt) );
     console.log("get external Suggestions");
//     this.locdbService.suggestions(this.entry, true).subscribe( (sgt) => this.externalSuggestions = sgt );
     this.locdbService.suggestions(this.entry, true).subscribe( (sgt) => this.saveExternal(sgt) );
    console.log("Done.");
    this.entry = searchentry;
}

saveInternal(sgt){
  // if (sgt.length == 0) {
  //   this.internalSuggestions = MOCK_INTERNAL;
  // } 
  // else {
    this.internalSuggestions = sgt
  console.log("Recieved Internal: ", this.internalSuggestions);
  // }
}

saveExternal(sgt){
  this.externalSuggestions = sgt
  console.log("Recieved External: ", this.externalSuggestions);
}
}
