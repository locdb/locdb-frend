import { Component, OnInit, Input } from '@angular/core';
import { BibliographicResource, ProvenResource, ToDo, Origin, Provenance } from '../locdb';
import { LoggingService } from '../logging.service'


/* What was View Encapsulation for? */

@Component({
  selector: 'app-resource-editable',
  templateUrl: './resource-editable.component.html',
  styleUrls: ['./resource-editable.component.css'],
})
export class ResourceEditableComponent implements OnInit {
  @Input() resource: BibliographicResource | ProvenResource | ToDo = null;
  @Input() editing = false;

  constructor(private loggingService: LoggingService) { }

  ngOnInit(){ }


  showForm(val: boolean) {
    this.resource = <BibliographicResource> this.resource
    // Display the form or stop displaying it
    if (this.resource instanceof ProvenResource){
      let provenance = this.resource.provenance;
      let origin = Origin.external
        if (provenance == Provenance.locdb){
          origin = Origin.internal
        }

        if (provenance == Provenance.unknown){
            origin = Origin.external
        }
        if (this.editing){
          this.loggingService.logStartEditing(this.resource, origin)
        } else{
          this.loggingService.logEndEditing(this.resource, origin)
        }
    }

    this.editing = val;
    if (this.editing){
      this.loggingService.logStartEditing(this.resource)
    } else{
      this.loggingService.logEndEditing(this.resource)

    }
  }


}
