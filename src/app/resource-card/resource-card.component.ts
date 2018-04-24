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

    @Input() resources: [TypedResourceView, TypedResourceView] = [null,null]; //TypedResourceView; //BibliographicResource | ProvenResource | ToDo;
    @Output() resourceChange = new EventEmitter<TypedResourceView>();
    @Input() selected: boolean = false;
    @Input() selectable: boolean = true;
    @Output() externalReferences: any = new EventEmitter();
    open = false;
    constructor() { }

    ngOnInit() {
      console.log("init")
    }

    ngOnChanges(){
      console.log("on changes")
      // this.open = false;
    }

      onSelectExternal() {
        this.externalReferences.next(true)
      }

      // short() {
      //   let s:string = this.resource ? this.resource.toString() : '<empty>';
      //   // TODO put info on container resource if partof is available
      //
      // }

      toggleOpen(){
        console.log("toggle, toggle, ...")
        this.open = !this.open;
        console.log(this.open)
      }

  }
