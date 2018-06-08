import {
  TypedResourceView,
  Metadata,
  enums,
  models,
  // findContainerMetadata
} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { AuthorsPipe, EditorsPipe, PublisherPipe, EmbracePipe, ContainerPipe} from '../pipes';



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
    // this.in = findContainerMetadata(this.in);
  }

  open_link(link: string) {
    window.open(link, '_blank');
  }

  getClickableIDURL(identifiers: models.Identifier[]){
    identifiers = identifiers.filter(i => (['URL_CROSSREF'].indexOf(i.scheme) != -1))
    if(identifiers.length > 0){
      return identifiers[0].literalValue
    }
    identifiers = identifiers.filter(i => (['URI'].indexOf(i.scheme) != -1))
    if(identifiers.length > 0){
      return identifiers[0].literalValue
    }
    identifiers = identifiers.filter(i => (['URL_SWB'].indexOf(i.scheme) != -1))
    if(identifiers.length > 0){
      return identifiers[0].literalValue
    }
  }

  getClickableIDName(identifiers: models.Identifier[]){
    identifiers = identifiers.filter(i => (['URL_CROSSREF'].indexOf(i.scheme) != -1))
    if(identifiers.length > 0){
      return identifiers[0].scheme + ': ' + identifiers[0].literalValue.split("/")[2]
    }
    identifiers = identifiers.filter(i => (['URI'].indexOf(i.scheme) != -1))
    if(identifiers.length > 0){
      return identifiers[0].scheme + ': ' + identifiers[0].literalValue.split("/")[2]
    }
    identifiers = identifiers.filter(i => (['URL_SWB'].indexOf(i.scheme) != -1))
    if(identifiers.length > 0){
      return identifiers[0].scheme + ': ' + identifiers[0].literalValue.split("/")[2]
    }
  }
}
