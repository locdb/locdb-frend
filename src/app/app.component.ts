import { Component } from '@angular/core';
import { Citation } from './citation';

import { ToDo, ToDoParts, ToDoScans, BibliographicEntry, BibliographicResource } from './locdb';
import { LocdbService } from './locdb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ LocdbService ]
})

export class AppComponent { 
  title = 'LOC-DB ~ Extrapolite';
  entry: BibliographicEntry;
  resource: BibliographicResource;
  entryForSuggestion: BibliographicEntry;
  // candidates: Citation[];

  header = { width: 300, height: 20, rp:0.35, citationCircleVisibility:"hidden", lineVisibility:"hidden", colorStart:"Red", colorCitation:"Blue"}; 
  
  
  constructor ( private locdbService: LocdbService ) {}

  updateEntry (entry: BibliographicEntry) {
    console.log('Updating with new entry', entry);
    this.entry = entry;
    this.entryForSuggestion = entry;
  }

  updateResource (resource: BibliographicResource) {
    console.log('Updating with new resource', resource);
    this.resource = resource;
    //this.entryForSuggestion = resource;
  }

  updateForSuggestion(currentFormEntry){
    console.log("Updating entry for suggestions", currentFormEntry);
    this.entryForSuggestion = currentFormEntry;
  }

  updateFromSuggestion (
    {title, date, authors, references} : {title: string, date: string, authors:
      string[], references: string }
  ): void
  {
    // let oldEntry = this.entry;
    // let newEntry = {
    //   ...oldEntry, // all values from old entry
    //   title: title,
    //   date: date,
    //   authors: authors,
    //   references: references
    // };
    console.log("Updating from suggestion");

    let updatedEntry : BibliographicEntry = {
      _id: this.entry._id,
      scanId: this.entry.scanId,
      status: this.entry.status,
      coordinates: this.entry.coordinates,
      marker: this.entry.marker,
      bibliographicEntryText: this.entry.bibliographicEntryText,
      title: title,
      date: date,
      authors: authors,
      references: references
    }
    this.entry = updatedEntry;
  }
  
  roundUp(num, precision) {
    return Math.ceil(num * precision) / precision
  }
  
  onclickcitation(){
  console.log("Clicked Citation Circle");
    this.header.lineVisibility="hidden"
    this.header.citationCircleVisibility="hidden"
    this.header.colorStart="Red"
    this.header.colorCitation="Blue"
      
}
  
  
  onclickstart() {
    console.log("clicked Start Circle");
    this.header.lineVisibility="visible"
    this.header.citationCircleVisibility="visible"
    this.header.colorStart="Blue"
    this.header.colorCitation="Red"
  }

  // updateCandidates(newCandidates: Citation[]) {
  //   this.candidates = newCandidates;
  //   console.log('Updated candidates', this.candidates);
  // }
}

