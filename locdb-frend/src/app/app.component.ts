import { Component } from '@angular/core';
import { Citation } from './citation';

import { ToDo, ToDoParts, ToDoScans } from './locdb';
import { LocdbService } from './locdb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ LocdbService ]
})

export class AppComponent {
  title = 'LOC-DB ~ Extrapolite';
  candidates: Citation[];

  constructor ( private locdbService: LocdbService ) {}

  updateCandidates(newCandidates: Citation[]) {
    this.candidates = newCandidates;
    console.log('Updated candidates', this.candidates);
  }
}

