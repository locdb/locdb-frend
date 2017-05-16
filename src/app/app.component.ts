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

  header = { width: 300, height: 20, rp:0.15, 
      state:0, //0-2 
      caktiv: 'black',
      cinaktiv: 'white',
      cline: 'white',
      nameStart: 'Start',
      nameMid: 'Suggestion',
      nameEnd: 'Citation'
      
}; 
  
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
    //this.showCitation()
    if(entry)
        this.header.state = 1;
    else
        this.header.state = 0;        
    console.log('Updating with new entry', entry);
    this.entry = entry;
    // reset resource, since we selected a different entry
    this.resource = null;
  }

  updateResource (resource: BibliographicResource) {
    //this.enableCitation();
    this.header.state = 2;
    console.log('Updating with new resource', resource);
    this.resource = resource;
  }

  
  roundUp(num, precision) {
    return Math.ceil(num * precision) / precision;
  }
  
  pathStart(){
  console.log("pathStart");
      
}
  
  
  pathSelectResource() {
    console.log("pathSelectResource");
  }
  pathEditAndSubmit(){
    console.log("pathEditAndSubmit");
}

}

