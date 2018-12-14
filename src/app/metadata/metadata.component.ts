import {
  TypedResourceView,
  Metadata,
  enums,
  models,
  // findContainerMetadata
} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { AuthorsPipe, EditorsPipe, PublisherPipe, EmbracePipe, PrefixPipe } from '../pipes';

import { StandardPipe, ContainerPipe } from '../pipes';

const DOI_PREFIX = 'https://doi.org/'


@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit, OnChanges {
  // if this is a string, we can try to dereference it from the back-end
  @Input() of: TypedResourceView = null; // child resource
  /* in Must be typed resource view to automagically find the correct metadata */
  @Input() in: TypedResourceView | null = null; // parent resource

  // make resource type available
  resourceType = enums.resourceType;


  ngOnInit()  {

  }

  ngOnChanges() {
  }

  open_link(link: string) {
    window.open(link, '_blank');
  }

  /* Gets the value for a specific identifier scheme */
  findIdentifier(identifiers: Array<models.Identifier>,
    scheme: enums.identifier = enums.identifier.urlCrossref): string | undefined {
    if(!identifiers) { return ''; }
    if(identifiers.length == 0) { return ''; }
    if(!scheme) { return ''; }
    const firstMatch = identifiers.find(ident => ident.scheme === scheme);
    return firstMatch ? firstMatch.literalValue : undefined;
  }

  /* Transforms a DOI into a clickable URL
   * 10.1111j.1468-4446.2010.01345.x
   * to
   * https://doi.org/10.1111/j.1468-4446.2010.01345.x
   *
   */
  doi2url(doi: string): string {
    if (doi.startsWith('http')) {
      return doi;
    } else if (doi.startsWith('doi.org')) {
      return 'https://' + doi;
    } else {
      return 'https://doi.org/' + doi;
    }
  }

  getPageString(resource: TypedResourceView): string {

    if (!resource.embodiedAs) { return ''; }
    if (resource.embodiedAs.length == 0) { return ''; }
    const firstPage = resource.embodiedAs[0].firstPage;
    const lastPage = resource.embodiedAs[0].lastPage;

    if (!!firstPage) {
      if (!lastPage || firstPage === lastPage) {
        // last page not given or same as first page
        return `p. ${firstPage}`;
      } else {
        // two pages are given and different
        return `pp. ${firstPage}-${lastPage}`;
      }
    }

    // First page was not given, only Last Page might be given, but ignore.
    return '';
  }

}
