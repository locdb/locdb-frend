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

@Pipe({name: 'journalstandard'})
export class JournalStandardPipe implements PipeTransform {
  /* Ganz grob sehen die ganzen Formate ungefaehr so aus:
  <authors>: <title>, in: <editors> (ed.), <collection-title>, <publisher> (<year>).

  */
  transform(
    typedResource: TypedResourceView,
    seperator: string = ', ',
    standalone: boolean = false,
  ): string {
    console.log('resource', typedResource)
    const identifierPepe = new IdentifierPipe()
    // const contrib_suffix = standalone ? ': ' : ', '
    // const authorsPepe = new AuthorsPipe()
    // const editorsPepe = new EditorsPipe()
    const publisherPepe = new PublisherPipe()
    if (!typedResource) { return '(no resource)'; }
    let journalTitle = typedResource.getTypedPropertyWrap(enums.resourceType.journal, 'title')
    if (standalone) {
      journalTitle = '<b>' + journalTitle + '</b>';
    }
    const issueTitle = typedResource.getTypedPropertyWrap(enums.resourceType.journalIssue, 'title')
    const volumeTitle = typedResource.getTypedPropertyWrap(enums.resourceType.journalVolume, 'title')
    let publicationDate = typedResource.getTypedPropertyWrap(enums.resourceType.journal, 'publicationDate')
    if (typeof publicationDate !== 'string') {
      publicationDate = moment(publicationDate).format('YYYY-MM-DD');
    } else {
      // is this really necessary?
      publicationDate = publicationDate
    }
    const isoPublicationDate = publicationDate
    const contributors = typedResource.getTypedPropertyWrap(enums.resourceType.journal, 'contributors')
    // const authors = authorsPepe.transform(contributors, '; ', contrib_suffix)
    // const editors = editorsPepe.transform(contributors, '; ', contrib_suffix)
    const issueNumber =  'issue ' + typedResource.getTypedPropertyWrap(enums.resourceType.journalIssue, 'number')
    const volumeNumber =  'volume ' + typedResource.getTypedPropertyWrap(enums.resourceType.journalVolume, 'number')
    const publisher = publisherPepe.transform(typedResource.contributors) || publisherPepe.transform(contributors)
    // const identifiers =  typedResource.getTypedPropertyWrap(forced_type, 'identifiers')
    return this.prettyStandardString(
      journalTitle,
      issueTitle,
      volumeTitle,
      isoPublicationDate,
      // editors,
      // authors,
      issueNumber,
      volumeNumber,
      publisher,
      seperator,
      standalone
    )
  }

  // <editor/author>, <title>, <subtitle>, <number>, <edition>, <publisher>, (<publicationDate>)
  prettyStandardString(
    journalTitle,
    issueTitle,
    volumeTitle,
    isoPublicationDate,
    // editors,
    // authors,
    number, // issue number
    edition, // volume number
    publisher,
    seperator,
    standalone
  ) {
    let s = '';
    // if (editors && editors.trim()) {
    //   s += editors + ' (ed.)' + author_suffix;
    // } else if (authors && authors.trim()) {
    //   s += authors + author_suffix;
    // }
    const otherAttributes = new Array<string>();
    if (standalone) {
      // If shown as standalone, make titles bold font
      if (journalTitle && journalTitle.trim()) {
        otherAttributes.push('<b>' + journalTitle + '</b>')
      }
      if (issueTitle && issueTitle.trim()) {
        otherAttributes.push('<b>' + issueTitle + '</b>')
      }
    } else {
      // if shown as container, leave Titles as is
      if (journalTitle && journalTitle.trim()) {
        otherAttributes.push(journalTitle)
      }
      if (issueTitle && issueTitle.trim()) {
        otherAttributes.push(issueTitle)
      }
    }
    // I put it this way, such that we dont have to deal with leftover seperators
    for (const attr of [edition, number, publisher]) {
      if (attr && attr.trim()) {
        console.log('attr', attr);
        otherAttributes.push(attr);
      }
    }
    s += otherAttributes.join(seperator);
    console.log('jStandard pipe result after joining:', s);


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
