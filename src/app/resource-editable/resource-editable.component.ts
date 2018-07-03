import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { models, TypedResourceView } from '../locdb';
import { LoggingService } from '../logging.service'
import { LocdbService } from '../locdb.service';


/* What was View Encapsulation for? */

@Component({
  selector: 'app-resource-editable',
  templateUrl: './resource-editable.component.html',
  styleUrls: ['./resource-editable.component.css'],
})
export class ResourceEditableComponent implements OnInit {
  @Input() resources: [TypedResourceView, TypedResourceView];
  @Output() resourcesChange = new EventEmitter<[TypedResourceView, TypedResourceView]>();
  @Input() editing = true;

  @Output() submitStatus: EventEmitter<boolean> = new EventEmitter();

  constructor(private loggingService: LoggingService, private locdbService: LocdbService) { }

  ngOnInit() {
    console.log("On init edible", this.resources)
      }


  showForm(val: boolean) {
    this.resources[0] = <TypedResourceView> this.resources[0]
    // Display the form or stop displaying it
    // this.editing = val;
    if (this.resources[0] instanceof TypedResourceView) {
        if (this.editing) {
          this.loggingService.logStartEditing(this.resources[0], null)
        } else {
          this.loggingService.logEndEditing(this.resources[0], null)
        }
    } else {
    // if (this.editing){
    //  this.loggingService.logStartEditing(this.resource)
    // } else{
      this.loggingService.logEndEditing(this.resources[0])

    // }
  }
}


}
