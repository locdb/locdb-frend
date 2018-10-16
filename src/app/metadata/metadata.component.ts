import {
  TypedResourceView,
  Metadata,
  enums,
  models,
  // findContainerMetadata
} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { AuthorsPipe, EditorsPipe, PublisherPipe, EmbracePipe, PrefixPipe} from '../pipes';

import { StandardPipe, ContainerPipe } from '../pipes';

const DOI_PREFIX = 'https://doi.org/'


@Component({
  selector: 'app-metadata',
  templateUrl: './author-year-format.html',
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
  findIdentifier(identifiers: Array<models.Identifier>, scheme: enums.identifier = enums.identifier.urlCrossref): string | undefined {
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

  black_magic(rType: enums.resourceType): string {
    // TODO FIXME get rid of black magic
    // it is only evaluated once which is shitty
    console.log('black_magic()', rType)
    if (rType === enums.resourceType.journalIssue || rType === enums.resourceType.journalVolume) {
      console.log('journal-like');
      return 'journal-like';
    }
    if (rType === enums.resourceType.monograph || rType === enums.resourceType.editedBook || rType === enums.resourceType.book || rType === enums.resourceType.referenceBook) {
      console.log('book-like');
      return 'book-like';
    }
    return '';
  }

}
