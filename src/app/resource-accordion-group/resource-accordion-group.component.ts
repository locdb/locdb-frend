import { EventEmitter, Component, OnInit, ViewEncapsulation, Input, Output } from '@angular/core';
import { BibliographicResource, ProvenResource, ToDo, } from '../locdb';

@Component({
  selector: 'app-resource-accordion-group',
  templateUrl: './resource-accordion-group.component.html',
  styleUrls: ['./resource-accordion-group.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResourceAccordionGroupComponent implements OnInit {

  @Input() resource: BibliographicResource | ProvenResource | ToDo;
  @Output() resourceChange = new EventEmitter<BibliographicResource | ProvenResource | ToDo>();
  @Input() selected: boolean = false;
  disabled = false;
  open = false;
  constructor() { }

  ngOnInit() {
  }



  short() {
    // A shorthand name for accordion heading
    if (this.resource) {
      // resource already present
      const br = this.resource;
      let s = br.title;
      if (br.publicationYear) {
        s += ` (${br.publicationYear})`
      }
      if (br.status === 'EXTERNAL') {
        s += ` [${br.type}]`
      }
      return s;
    }
  }

  toggleDisabled(){
    // this.disabled = !this.disabled
    this.disabled = false;
    this.open = !this.open;
    this.disabled = true;
    console.log("Toggle", this.disabled, this.open)

  }

}
