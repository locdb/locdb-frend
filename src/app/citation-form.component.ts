import { Component, Input, OnInit } from '@angular/core';
import { Citation } from './citation';
import { REFERENCES } from './mock-references';

@Component({
  moduleId: module.id,
  selector: 'citation-form',
  templateUrl: 'citation-form.component.html'
})

export class CitationFormComponent implements OnInit {
  @Input() references: Citation[] = REFERENCES;
  @Input() model: Citation;

  reftypes = Citation.REFTYPES;

  submitted = true;
  authorCandidate = '';

  // Behaviour for external bibliographic resources modal BEGIN
  selectedExternals: boolean[];

  getExternalBibliographicResources() {
    // This code should access backend for external bibligraphic Resources

    return REFERENCES;
  }

  pushSelectedExternals() {
    console.log('Pushing selected externals');
    return;
  }
  // Behaviour for external bibliographic resources modal END
  
  getInternalSuggestions() {
    // retrieve the internal suggestions based on the inserted text

  }


  addAuthorToModel() {
      this.model.add_author(this.authorCandidate);
      this.authorCandidate = '';
  }

  ngOnInit() {
    // retrieve suggestions from locdb
    // (auto-select the first suggestion)
  }




  onSelect(reference: Citation) {
    if (reference == null) {
      this.model = new Citation(100, 'LOCDB', null, []);
    } else {
      // this.model = reference.deepcopy();
      this.model = reference;
    }
    this.submitted = false;
  }

  onSubmit() { this.submitted = true; this.model = null; }


  // TODO: Remove this when we're done
  // get diagnostic() { return JSON.stringify(this.model); }
}
