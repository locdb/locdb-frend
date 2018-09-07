import { Component, OnInit, Input } from '@angular/core';


import { TypedResourceView, enums, containerTypes } from '../../locdb';

@Component({
  selector: 'app-meta-resource-form',
  templateUrl: './meta-resource-form.component.html',
  styleUrls: ['./meta-resource-form.component.css']
})
export class MetaResourceFormComponent implements OnInit {

  @Input() resource: TypedResourceView;
  @Input() container: TypedResourceView;


  allowedViews: Array<enums.resourceType> = [];
  currentView: enums.resourceType;

  constructor() { }

  ngOnInit() {
    console.log('[RFM:ngOnInit]', this.resource)
    const allowedViews = containerTypes(this.resource.type);
    allowedViews.unshift(this.resource.type);
    this.allowedViews = allowedViews;
    this.currentView = this.resource.type;
  }

  changeType(newType: enums.resourceType) {

  }

}
