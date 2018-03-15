import {
    BibliographicResource,
    TypedResourceView,
    ToDo,
} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, Input } from '@angular/core';

import { AuthorsPipe, EditorsPipe, PublisherPipe, EmbracePipe} from '../pipes';


@Component({
  selector: 'app-resource',
  templateUrl: './author-year-format.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent {
  // if this is a string, we can try to dereference it from the back-end
  @Input() resource: TypedResourceView = null;
  @Input() in: TypedResourceView | null = null;
  ngOnInit()  {
  }
}
