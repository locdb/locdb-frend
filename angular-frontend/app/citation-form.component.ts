import { Component, Input } from '@angular/core';
import { Citation } from './citation';
import { REFERENCES } from './mock-references'

@Component({
  moduleId: module.id,
  selector: 'citation-form',
  templateUrl: 'citation-form.component.html'
})
export class CitationFormComponent {
  @Input()
  references: Citation[] = REFERENCES;
  @Input()
  model : Citation = this.references[0].deepcopy();
  reftypes = Citation.REFTYPES;

  submitted = false;
  authorCandidate = '';

  addAuthorToModel() {
      this.model.add_author(this.authorCandidate);
      this.authorCandidate = '';
  }

  onSelect(reference : Citation) {
    this.model = reference.deepcopy()
  }

  onSubmit() { this.submitted = true; this.model = null}


  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}

