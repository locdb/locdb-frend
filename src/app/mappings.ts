import { enums, typedProperty} from './locdb';


export function foreignPropertiesByType(containerType: enums.resourceType): Array< string > {
  /*
   * This is a mapping to obtain relevant (but not own) properties for a flattened container type
   * It is intended to offer the foreign but relevant fields in a form.
   *
   */

  const rtype = enums.resourceType;
  switch (containerType) {
    case rtype.journalIssue:
      // when its an issue, we need properties of volume and journal
      return [typedProperty(rtype.journal, 'title'),
              typedProperty(rtype.journal, 'subtitle'),
              typedProperty(rtype.journalVolume, 'number')];

    case rtype.journalVolume:
      // if its a volume, we need properties of journal
      return [typedProperty(rtype.journal, 'title'),
              typedProperty(rtype.journal, 'subtitle')];

    case rtype.monograph || rtype.editedBook || rtype.book || rtype.referenceBook:
      // in these cases, the book series and sets are flattened.
      return [typedProperty(rtype.bookSeries, 'title'),
              typedProperty(rtype.bookSeries, 'number'),
              typedProperty(rtype.bookSet, 'title')];
    default:
      return [];
  }
}

