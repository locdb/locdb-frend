import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { models, enums, composeName, TypedResourceView} from '../../locdb';
import { IdentifierPipe } from '../identifier.pipe';
import { AuthorsPipe } from '../authors.pipe';
import { EditorsPipe } from '../editors.pipe';
import { PublisherPipe } from '../publisher.pipe';


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'standard'})
export class StandardPipe implements PipeTransform {
  /* Ganz grob sehen die ganzen Formate ungefaehr so aus:
  <authors>: <title>, in: <editors> (ed.), <collection-title>, <publisher> (<year>).

  */
  transform(
    typedResource: TypedResourceView,
    forced_type: enums.resourceType = null,
    seperator: string = ', ',
    standalone: boolean = false,
  ): string {
    if (!typedResource) { return '(no resource)'; }
    /* Suffix for contributors, use colon (:) in standalone variants, else a comma (,) */
    const contrib_suffix = standalone ? ': ' : ', ';
    const identifierPepe = new IdentifierPipe();
    const authorsPepe = new AuthorsPipe();
    const editorsPepe = new EditorsPipe();
    const publisherPepe = new PublisherPipe();
    const datePepe = new DatePipe('en'); // locale
    let standardString = '';
    let trv = typedResource;
    if (forced_type != null) {
      // Change the view on the resource to the forced type
      trv = trv.astype(forced_type);
    }
    const title = typedResource.title
    const subtitle = typedResource.subtitle
    const publicationDate = typedResource.publicationDate
    // console.log('Date for title', title, publicationDate);
    const isoPublicationDate = datePepe.transform(publicationDate, 'yyyy');
    // console.log('YYYY date', title, isoPublicationDate);
    const contributors = typedResource.contributors;
    const authors = authorsPepe.transform(contributors, '; ', contrib_suffix);
    const editors = editorsPepe.transform(contributors, '; ', contrib_suffix);
    const publisher = publisherPepe.transform(contributors);
    const number =  typedResource.number;
    const edition =  typedResource.edition;
    // const identifiers =  typedResource.identifiers
    standardString = this.prettyStandardString(
      title,
      subtitle,
      isoPublicationDate,
      editors,
      authors,
      publisher,
      number,
      edition,
      seperator,
      standalone
    )
    return standardString;
  }

  // <editor/author>, <title>, <subtitle>, <number>, <edition>, <publisher>, (<publicationDate>)
  prettyStandardString(
    title,
    subtitle,
    publicationDate,
    editors,
    authors,
    publisher,
    number,
    edition,
    seperator,
    standalone) {
    let s = '';
    if (publicationDate) {
      s += '<span class="badge badge-info">' + publicationDate + '</span> ';
    }
    if (editors && editors.trim()) {
      s += editors;
    } else if (authors && authors.trim()) {
      s += authors;
    }

    const otherAttributes = new Array<string>();
    for (const attr of [title, subtitle]) {
      if (attr && attr.trim()) {
        if (standalone) {
          otherAttributes.push('<strong>' + attr + '</strong>');
        } else {
          otherAttributes.push(attr);
        }
      }
    }

    for (const attr of [number, edition, publisher]) {
      if (attr && attr.trim()) {
        // console.log('attr', attr);
        otherAttributes.push(attr);
      }
    }
    // console.log('Standard pipe result before joining:', s);
    s += otherAttributes.join(seperator);


    // TODO FIXME this caused some trouble! :)
    // if(standardString.length >= seperator.length+1){
    //   standardString = standardString.slice(0, -(seperator.length+1))
    // }

    // we do this in the template so that we can also display only the container
    // if(standardString.length > 1){
    //   standardString = "<em>In:&nbsp;</em>"  + standardString
    // }
    return s;


  }
}
