import {
    BibliographicResource,
    TypedResourceView,
    ToDo,
} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent {
  // if this is a string, we can try to dereference it from the back-end
  @Input() resource: TypedResourceView= null;
  ngOnInit()  {
  }
}
