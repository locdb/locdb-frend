import { Component, Input } from '@angular/core';
import { Citation }    from './citation';
// import { Author }    from './citation';
@Component({
  moduleId: module.id,
  selector: 'citation-form',
  templateUrl: 'citation-form.component.html'
})
export class CitationFormComponent {
  reftypes = ['Article', 'Journal', 'Book', 'Other'];
  @Input()
  citations: Citation[] = [
    new Citation(42, this.reftypes[1], ['Abramson, L.Y.', 'Seligman, M.E.P.', 'Teasdale, J.D.'],
  'Learned helplessness in hu-mans: Critique and reformula', 1978,
  'Journal of Abnormal Psychology',
  null, 87, '49-74'),
  new Citation(42, this.reftypes[0],
                         ['Adorno, T.W.'],
                          'Studien zum autoritären Charakter',
                         1973,
                         'Suhrkamp (Frankfurt)')

  ];

  model = this.citations.shift();
  submitted = false;
  authorCandidate = '';

  addAuthorToModel() {
      this.model.addAuthor(this.authorCandidate);
      this.authorCandidate = '';
  }

  onSubmit() { this.submitted = true; this.model = this.citations.shift(); }


  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }
}

