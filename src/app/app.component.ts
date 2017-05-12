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

  header = { width: 300, height: 20, rp:0.35, citationCircleVisibility:"hidden", lineVisibility:"hidden", colorStart:"Red", colorCitation:"Blue"}; 
  
  /*
    updatedEntry : BibliographicEntry = {
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
    };
    this.entry = updatedEntry;
  */
  constructor ( private locdbService: LocdbService ) {}

  updateEntry (entry: BibliographicEntry) {
    console.log('Updating with new entry', entry);
    this.entry = entry;
    // reset resource, since we selected a different entry
    this.resource = null;
  }

  updateResource (resource: BibliographicResource) {
    console.log('Updating with new resource', resource);
    this.resource = resource;
  }

  
  roundUp(num, precision) {
    return Math.ceil(num * precision) / precision;
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

}

