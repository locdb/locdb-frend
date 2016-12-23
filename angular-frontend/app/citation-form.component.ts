import { Component, Input } from '@angular/core';
import { Citation } from './citation';

@Component({
  moduleId: module.id,
  selector: 'citation-form',
  templateUrl: 'citation-form.component.html'
})
const REFTYPES = ['Article', 'Journal', 'Book', 'Other'];
export class CitationFormComponent {
  @Input()
  references: Citation[] = [
    new Citation(42,
                 'LOCDB',
                 REFTYPES[1],
                 ['Abramson, L.Y.', 'Seligman, M.E.P.', 'Teasdale, J.D.'],
                 'Learned helplessness in hu-mans: Critique and reformula',
                 1978, 'Journal of Abnormal Psychology', null, 87, '49-74'),

    new Citation(43,
                 'DOAJ',
                 REFTYPES[1],
                 ['Abramson, L.Y.', 'Seligman, M.E.P.', 'Teasdale, J.D.'],
                 'Learned healthiness in humans: Critique and reformula',
                 1978, 'Journal of Normal Psychology', null, 87, '46-78'),

                 new Citation(44, 'DOAJ', REFTYPES[0], ['Adorno, T.W.'],
                              'Studien zum autoritären Charakter', 1973,
                              'Suhrkamp (Frankfurt)')

  ];
  @Input()
  selected : number = 0;

  model : Citation = Object.create(this.references[this.selected]);

  submitted = false;
  authorCandidate = '';

  addAuthorToModel() {
      this.model.addAuthor(this.authorCandidate);
      this.authorCandidate = '';
  }

  select(index : number) {
    this.model = this.references[index]
  }

  onSubmit() { this.submitted = true; this.model = null}


  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}

