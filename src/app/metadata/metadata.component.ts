import {
    TypedResourceView,
    Metadata
} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, Input } from '@angular/core';

import { AuthorsPipe, EditorsPipe, PublisherPipe, EmbracePipe} from '../pipes';


@Component({
  selector: 'app-metadata',
  templateUrl: './author-year-format.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent {
  // if this is a string, we can try to dereference it from the back-end
  @Input() of: Metadata = null;
  @Input() in: Metadata | null = null;
  ngOnInit()  {
  }
}
