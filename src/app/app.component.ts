import { Component } from '@angular/core';
import { Citation } from './citation';

import { ToDo, ToDoParts, ToDoScans, BibliographicEntry } from './locdb';
import { LocdbService } from './locdb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ LocdbService ]
})

export class AppComponent {
  title = 'LOC-DB ~ Extrapolite';
  entry: BibliographicEntry;
  entryForSuggestion: BibliographicEntry;
  // candidates: Citation[];

  constructor ( private locdbService: LocdbService ) {}

  updateEntry (entry : BibliographicEntry) {
    console.log("Updating with new entry", entry);
    this.entry = entry;
    this.entryForSuggestion = entry;
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
    this.entry.title = title;
    this.entry.date = date;
    this.entry.authors = authors;
    this.entry.references = references;
  }

  // updateCandidates(newCandidates: Citation[]) {
  //   this.candidates = newCandidates;
  //   console.log('Updated candidates', this.candidates);
  // }
}

