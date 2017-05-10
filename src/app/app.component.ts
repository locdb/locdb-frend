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

  constructor ( private locdbService: LocdbService ) {}

  updateEntry (entry: BibliographicEntry) {
    console.log('Updating with new entry', entry);
    this.entry = entry;
    this.entryForSuggestion = entry;

    // now extracted the RESOURCE referenced by the ENTRY
    console.log("Extracting resource");
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

  // updateCandidates(newCandidates: Citation[]) {
  //   this.candidates = newCandidates;
  //   console.log('Updated candidates', this.candidates);
  // }
}

