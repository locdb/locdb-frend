import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Citation } from './citation';
import { MOCK_INTERNAL, MOCK_EXTERNAL } from './mock-bresources';

import { LocdbService } from './locdb.service';
import { BibliographicEntry, BibliographicResource } from './locdb';
import { AgentRole } from './locdb';

@Component({
  moduleId: module.id,
  selector: 'citation-form',
  templateUrl: 'citation-form.component.html',
  providers: [ LocdbService ]
})

export class CitationFormComponent implements OnChanges {
  // @Input() references: Citation[] = REFERENCES;
  // @Input() model: Citation;

  @Input() entry: BibliographicEntry;

  internalSuggestions: BibliographicResource[] = MOCK_INTERNAL;
  externalSuggestions: any[] = MOCK_EXTERNAL;
  // submitted = true;

  reftypes = Citation.REFTYPES;

  authorCandidate = '';

  constructor (private locdbService: LocdbService) {
  }


  fetchInternals(be: BibliographicEntry) {
    console.log('Fetching internal suggestions for', be);
    this.locdbService.suggestions(be, false).subscribe( (sgt) => this.internalSuggestions = sgt );
  }

  fetchExternals(be: BibliographicEntry) {
    console.log('Fetching external suggestions for', be);
    this.locdbService.suggestions(be, true).subscribe( (sgt) => this.externalSuggestions = sgt );
  }

  pushSelectedExternals() {
    console.log('Pushing selected externals');
    return;
  }
  // Behaviour for external bibliographic resources modal END
  

  addAuthorToModel() {
    this.entry.authors.push(this.authorCandidate);
      // this.model.add_author(this.authorCandidate);
    this.authorCandidate = '';
  }

  fetch() {
    this.fetchInternals(this.entry);
    this.fetchExternals(this.entry);
  }


  ngOnChanges(changes: any) {
    // console.log("onChanges called");
    // this.fetchInternals(this.entry);
    // this.fetchExternals(this.entry);
    // this.submitted = false;
  }

  onSelect (resource: BibliographicResource)
  {
    console.log('onSelect called with', resource);
    if (!resource) return;
    this.entry = resource;
    this.entry.authors = this.extractAuthors(resource.contributors)
    // this.entry.number = resource.number;
    // this.submitted = false;
  }

  // onSelect(reference: Citation) {
  //   if (reference == null) {
  //     this.model = new Citation(100, 'LOCDB', null, []);
  //   } else {
  //     // this.model = reference.deepcopy();
  //     this.model = reference;
  //   }
  //   this.submitted = false;
  // }

  onSubmit() {
    // prepare for submission
    // reverse-enginer publisher as role
    
    // this.locdbService.putBibliographicEntry(this.entry._id, this.entry);
    // this.submitted = true;
    this.entry = null;
  }

  removeAuthorAt(position:number) {
    this.entry.authors.splice(position, 1);
  }

  extractAuthors(contributors: AgentRole[]): string[] {
    return this.extractRole(contributors, 'author');
  }

  extractPublishers(contributors: AgentRole[]): string[] {
    return this.extractRole(contributors, 'publisher');
  }

  extractRole(contributors: AgentRole[], role): string[] {
    let names: string[] = []
    for (let agent of contributors) {
      if (agent.roleType === role) {
         names.push(agent.heldBy.nameString);
      }
    }
    return names;
  }


  //  TODO: Remove this when we're done
  // get diagnostic() { return JSON.stringify(this.entry); }
}
