import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { models, TypedResourceView, enums } from '../locdb';
import { LoggingService } from '../logging.service'
import { LocdbService } from '../locdb.service';

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.css'],
})
export class ResourceCardComponent implements OnInit {

    @Input() resource: TypedResourceView; //BibliographicResource | ProvenResource | ToDo;
    @Output() resourceChange = new EventEmitter<TypedResourceView>();
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
        let s:string = this.resource ? this.resource.toString() : '<empty>';
        // TODO put info on container resource if partof is available

      }

      // short_old() {
      //   // A shorthand name for accordion heading
      //   // <authors>. <year>. <title>. in <container-title>. <DOI>
      //   if (this.resource) {
      //     // resource already present
      //     let authors = br.contributors.filter(r => r.roleType === enums.roleType.author);
      //     const br = this.resource;
      //     let s = ""
      //     if(br.authors && br.authors.length>0){
      //       s = br.authors.join(", ");
      //       if (s.slice(-1)!="."){
      //         s += ". ";
      //       }
      //     }
      //     if (br.publicationYear) {
      //       s += " " + br.publicationYear + ".";
      //     }
      //     if (br.title){
      //       s += " " + br.title;
      //       if (s.slice(-1)!="."){
      //         s += ". ";
      //       }
      //     }
      //     if (br.containerTitle){
      //       s += " in " + br.containerTitle;
      //       if (s.slice(-1)!="."){
      //         s += ". ";
      //       }
      //     }
      //     if (br.doi && br.doi.length>0){
      //       s += "DOI: " + br.doi.join(", ");
      //       if (s.slice(-1)!="."){
      //         s += ". ";
      //       }
      //     }
      //     // if (br.status === 'EXTERNAL') {
      //     //   s += ` [${br.type}]`
      //     // }
      //     return s;
      //
      //   }


      toggleOpen(){
        this.open = !this.open;
      }

  }
