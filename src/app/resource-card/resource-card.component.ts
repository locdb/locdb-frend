import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { models, TypedResourceView, enums } from '../locdb';
import { LoggingService } from '../logging.service'
import { LocdbService } from '../locdb.service';

@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.css'],
})
export class ResourceCardComponent implements OnInit, OnChanges {

    @Input() resources: [TypedResourceView, TypedResourceView];
    @Output() resourcesChange = new EventEmitter<[TypedResourceView, TypedResourceView]>();
    @Input() selected = false;
    @Input() selectable = true;
    @Output() externalReferences: any = new EventEmitter();
    open = false;
    constructor() { }

    ngOnInit() {
      console.log("On init card", this.resources)
    }

    ngOnChanges() {
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
        this.open = !this.open;
      }

      forceOpen(){
        this.open = true
      }

  }
