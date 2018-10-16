import {
  TypedResourceView,
  Metadata,
  enums,
  models,
  // findContainerMetadata
} from '../locdb';
import { LocdbService } from '../locdb.service';
import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { AuthorsPipe, EditorsPipe, PublisherPipe, EmbracePipe} from '../pipes';

import { StandardPipe, ContainerPipe } from '../pipes';

const DOI_PREFIX = 'https://doi.org/'


@Component({
  selector: 'app-metadata',
  templateUrl: './pipe-format.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit, OnChanges {
  // if this is a string, we can try to dereference it from the back-end
  @Input() of: TypedResourceView = null; // child resource
  /* in Must be typed resource view to automagically find the correct metadata */
  @Input() in: TypedResourceView | null = null; // parent resource

  innerHtml: string;

  ngOnInit()  {

  }

  ngOnChanges() {
    if (!this.in) {
      this.innerHtml = new ContainerPipe().transform(<TypedResourceView>this.of, true);
    } else {
      this.innerHtml = new StandardPipe().transform(<TypedResourceView>this.of)
        + ' <em>In:</em> ' + new ContainerPipe().transform(this.in, false);
    }

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
   * 10.1111j.1468-4446.2010.01345.x.pdf
   * to
   * https://doi.org/10.1111/j.1468-4446.2010.01345.x
   *
   * FIXME this WILL go wrong, if the doi has any other format
   */
  doi2url(doi: string): string {
    // UNSAFE
    // return DOI_PREFIX + doi.slice(0, 7) + '/' + doi.slice(7);
    if (doi.startsWith('http')) {
      return doi;
    } else if (doi.startsWith('doi.org')) {
      return 'https://' + doi;
    } else {
      return 'https://doi.org/' + doi;
    }
  }

}
