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
  @Input() resource: TypedResourceView = null;
  @Input() editing = true;

  @Output() submitStatus: EventEmitter<boolean> = new EventEmitter();

  constructor(private loggingService: LoggingService, private locdbService: LocdbService) { }

  ngOnInit(){ }


  showForm(val: boolean) {
    this.resource = <TypedResourceView> this.resource
    // Display the form or stop displaying it
    // this.editing = val;
    if (this.resource instanceof TypedResourceView){
      let provenance = this.resource.provenance;

        if (this.editing){
          this.loggingService.logStartEditing(this.resource, provenance)
        } else{
          this.loggingService.logEndEditing(this.resource, provenance)
        }
    }
    else {
    // if (this.editing){
    //  this.loggingService.logStartEditing(this.resource)
    // } else{
      this.loggingService.logEndEditing(this.resource)

    // }
  }
}


}
