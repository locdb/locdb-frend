import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { models, enums, composeName, TypedResourceView } from '../../locdb';
import { IdentifierPipe } from "../identifier.pipe";
import { AuthorsPipe } from "../authors.pipe";
import { EditorsPipe } from "../editors.pipe";
import { PublisherPipe } from "../publisher.pipe";


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
    author_suffix = ': ',  // we need to make this special, it should be ':' per default but ',' in containers.
    bold_title: boolean = false,
  ): string {
    if (!typedResource) { return '(no resource)'; }
    const identifierPepe = new IdentifierPipe()
    const authorsPepe = new AuthorsPipe()
    const editorsPepe = new EditorsPipe()
    const publisherPepe = new PublisherPipe()
    let standardString = '';
    if (forced_type != null) {
      const title = typedResource.getTypedPropertyWrap(forced_type, 'title')
      const subtitle = typedResource.getTypedPropertyWrap(forced_type, 'subtitle')
      let publicationDate = typedResource.getTypedPropertyWrap(forced_type, 'publicationDate')
      if (typeof publicationDate !== 'string') {
        publicationDate = moment(publicationDate).format('YYYY-MM-DD');
      } else {
        // is this really necessary?
        publicationDate = publicationDate
      }
      const isoPublicationDate = publicationDate
      const contributors = typedResource.getTypedPropertyWrap(forced_type, 'contributors')
      const authors = authorsPepe.transform(contributors)
      const editors = editorsPepe.transform(contributors)
      const publisher = publisherPepe.transform(contributors)
      const number =  typedResource.getTypedPropertyWrap(forced_type, 'number')
      const edition =  typedResource.getTypedPropertyWrap(forced_type, 'edition')
      // const identifiers =  typedResource.getTypedPropertyWrap(forced_type, 'identifiers')
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
        author_suffix,
        bold_title
      )
    } else {
      const title = typedResource.title
      const subtitle = typedResource.subtitle
      let publicationDate = typedResource.publicationDate
      if (typeof publicationDate !== 'string') {
        publicationDate = moment(publicationDate).format('YYYY-MM-DD');
      } else {
        // is this really necessary?
        publicationDate = publicationDate
      }
      const isoPublicationDate = publicationDate;
      const contributors = typedResource.contributors;
      const authors = authorsPepe.transform(contributors);
      const editors = editorsPepe.transform(contributors);
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
        author_suffix,
        bold_title
      )
    }
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
    author_suffix = ': ',
    bold_title) {
    // const standardString = (editors.length != 0 ? editors + " (ed.)" + author_suffix + '' :
    //                           authors.length != 0 ? authors + author_suffix + '' : '')
    //                       + (title && title.trim().length != 0 ? title + seperator + '' : '')
    //                       + (subtitle && subtitle.trim().length != 0 ? subtitle + seperator + '' : '')
    //                       + (number && number.trim().length != 0 ? number + seperator + '' : '')
    //                       + (edition && edition.trim().length != 0 ? edition + seperator + '' : '')
    //                       + (publisher.length != 0 ? publisher + seperator + '' : '')
    //                       // + (publicationDate ? '(' + publicationDate + ')' + seperator + '' : '')
    //                       // + (identifiers && identifiers.length != 0 ? identifierPepe.transform(identifiers) + seperator + ' ': '')
    //                       ;
    let s = '';
    if (editors && editors.trim()) {
      s += editors + ' (ed.)' + author_suffix;
    } else if (authors && authors.trim()) {
      s += authors + author_suffix;
    }
    const otherAttributes = new Array<string>();
    if (bold_title && title && title.trim().length > 0){
      "<b>" + title + "</b>"
    }
    // I put it this way, such that we dont have to deal with leftover seperators
    for (const attr of [title, subtitle, number, edition, publisher]) {
      if (attr && attr.trim()) {
        // console.log('attr', attr);
        otherAttributes.push(attr);
      }
    }
    console.log('Standard pipe result before joining:', s);
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
