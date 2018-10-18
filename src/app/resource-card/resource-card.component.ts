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
    // console.log("On init card", this.resources)
  }

  ngOnChanges() {
    // this.open = false;
  }

  onItemHasChanged(position: number, event: TypedResourceView) {
    if (position < this.resources.length) {// guard
      console.log(`[RCC] Item at position ${position} of tuple haschanged.`, event)
      this.resources[position] = event;
    }
  }

  onSelectExternal() {
    this.externalReferences.emit(true)
  }

  toggleOpen() {
    this.open = !this.open;
  }
}
