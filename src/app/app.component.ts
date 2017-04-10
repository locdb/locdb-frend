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
  // candidates: Citation[];

  constructor ( private locdbService: LocdbService ) {}

  updateEntry (entry: BibliographicEntry) {
    console.log('Updating with new entry', entry);
    this.entry = entry;
  }

  // updateCandidates(newCandidates: Citation[]) {
  //   this.candidates = newCandidates;
  //   console.log('Updated candidates', this.candidates);
  // }
}

