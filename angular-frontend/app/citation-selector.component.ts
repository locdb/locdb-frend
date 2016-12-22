import { Component, Input } from '@angular/core'
import { Citation } from './citation'

@Component({
  moduleId: module.id,
  selector: 'citation-selector',
  templateUrl: 'citation-selector.component.html'
})
export class CitationSelectorComponent {
  selected : Citation = null;
  @Input()
  references: Citation[] = [new Citation(42, 'Article', ['Author1','Author2'], 'This is the title', 2042, 'Journal of Normal Psychology')];

  select_reference(index : number) {
    this.selected = this.references[index];
  }

  confirm_reference() {
    // check if existing or new
    // invoke citation form
  }


  get diagnostic() { return JSON.stringify(this.selected); }
}

