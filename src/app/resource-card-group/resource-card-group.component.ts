import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { BibliographicResource, TypedResource, ProvenResource, ToDo, Origin, Provenance } from '../locdb';
import { LoggingService } from '../logging.service'
import { LocdbService } from '../locdb.service';

@Component({
  selector: 'app-resource-card-group',
  templateUrl: './resource-card-group.component.html',
  styleUrls: ['./resource-card-group.component.css'],
})
export class ResourceCardGroupComponent implements OnInit {

    @Input() resource: TypedResource; //BibliographicResource | ProvenResource | ToDo;
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
        // <authors>. <year>. <title>. in <container-title>. <DOI>
        if (this.resource) {
          // resource already present
          const br = this.resource;
          let s = ""
          if(br.authors && br.authors.length>0){
            s = br.authors.join(", ");
            if (s.slice(-1)!="."){
              s += ". ";
            }
          }
          if (br.publicationYear) {
            s += " " + br.publicationYear + ".";
          }
          if (br.title){
            s += " " + br.title;
            if (s.slice(-1)!="."){
              s += ". ";
            }
          }
          if (br.containerTitle){
            s += " in " + br.containerTitle;
            if (s.slice(-1)!="."){
              s += ". ";
            }
          }
          if (br.doi && br.doi.length>0){
            s += "DOI: " + br.doi.join(", ");
            if (s.slice(-1)!="."){
              s += ". ";
            }
          }
          // if (br.status === 'EXTERNAL') {
          //   s += ` [${br.type}]`
          // }
          return s;

        }
      }

      toggleOpen(){
        this.open = !this.open
      }

  }
    toggleOpen(){
      this.open = !this.open
    }

  }
