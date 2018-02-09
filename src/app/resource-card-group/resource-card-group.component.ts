import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { BibliographicResource, ProvenResource, ToDo, Origin, Provenance } from '../locdb';
import { LoggingService } from '../logging.service'
import { LocdbService } from '../locdb.service';

@Component({
  selector: 'app-resource-card-group',
  templateUrl: './resource-card-group.component.html',
  styleUrls: ['./resource-card-group.component.css'],
})
export class ResourceCardGroupComponent implements OnInit {

    @Input() resource: BibliographicResource | ProvenResource | ToDo;
    @Output() resourceChange = new EventEmitter<BibliographicResource | ProvenResource | ToDo>();
    @Input() selected: boolean = false;
    @Input() selectable: boolean = true;
    @Output() externalReferences: any = new EventEmitter();
    open = false;
    constructor() { }

    ngOnInit() {
    }

    ngOnChanges(){
      this.open = false;
    }

      onSelectExternal() {
        console.log("whoop")
        this.externalReferences.next(true)
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

    toggleOpen(){
      this.open = !this.open
    }

  }
