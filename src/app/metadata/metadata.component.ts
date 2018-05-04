import {
    TypedResourceView,
  Metadata,
  findContainerMetadata
} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { AuthorsPipe, EditorsPipe, PublisherPipe, EmbracePipe} from '../pipes';



@Component({
  selector: 'app-metadata',
  templateUrl: './author-year-format.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit, OnChanges {
  // if this is a string, we can try to dereference it from the back-end
  @Input() of: Metadata = null; // child resource
  /* in Must be typed resource view to automagically find the correct metadata */
  @Input() in: TypedResourceView | null = null; // parent resource

  ngOnInit()  {


  }

  ngOnChanges() {
    this.in = findContainerMetadata(this.in);
  }
}
