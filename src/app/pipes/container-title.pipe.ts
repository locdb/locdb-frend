import { Pipe, PipeTransform } from '@angular/core';

import { TypedResourceView, enums } from '../locdb';

@Pipe({
  name: 'containerTitle'
})
export class ContainerTitlePipe implements PipeTransform {
  /**
   * Composes an appropriate container title out of various fields.
   * For journal-like containers (issues and volumes),
   * the journal title is combined with the volume number and optionally, the issue number.
   * For book-like containers the book-title is combined with the series name
   * and number as well as the book set name
   *
   * The implementation is robust enough with respect to non-container resources,
   * as the default is the title (+subtitle) or the number of the own resource.
   * Special container-specific treatment is only applied, when the type is a valid container.
   *
   */

  transform(value: TypedResourceView, args?: any): string {
    let s = '';
    if (this.isJournalLike(value.type)) {
      s = value.astype(enums.resourceType.journal).title;
      const journalSubtitle = value.astype(enums.resourceType.journal).subtitle;
      if (journalSubtitle) {
        s += ' ' + journalSubtitle;
      }


      const volumeNumber = value.astype(enums.resourceType.journalVolume).number;
      if (volumeNumber) {
        s += ', Vol. ' + volumeNumber;
      }

      const issueNumber = value.astype(enums.resourceType.journalIssue).number;
      if (issueNumber) {
        s += ', Issue ' + issueNumber;
      }

      // journals issues and volumes do not need anything else, we're done here.
      return s;
    }

    // Otherwise, always use own title
    if (value.title) {
      s += value.title;
      if (value.subtitle) {
        s += ' ' + value.subtitle;
      }
    } else if (value.number) {
      // If no title is given, e.g. for a book chapter, use try to use its number
      s += value.number;
    }

    if (this.isBookLike(value.type)) {
      // For book-like resources, add (flattened) info on Series
      const seriesTitle = value.astype(enums.resourceType.bookSeries).title;
      const seriesNumber = value.astype(enums.resourceType.bookSeries).number;
      if (seriesTitle) {
        s += ', ' + seriesTitle;
        if (seriesNumber) {
          s += seriesNumber;
        }

      }
      // and book sets
      const setTitle = value.astype(enums.resourceType.bookSet).title;
      if (setTitle) {
        s += ', ' + setTitle;
      }
    }

    // the very important default, is the resource's OWN TITLE
    // also journals are dealt with here
    return s;

  }

  isJournalLike(rType: enums.resourceType) {

    return rType === enums.resourceType.journalIssue || rType === enums.resourceType.journalVolume;


  }

  isBookLike(rType: enums.resourceType) {
    return (
      rType === enums.resourceType.monograph ||
      rType === enums.resourceType.editedBook ||
      rType === enums.resourceType.book ||
      rType === enums.resourceType.referenceBook
    )
  }

}
