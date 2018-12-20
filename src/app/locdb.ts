import * as models from './typescript-angular-client/model/models'

export {models};

// MAKE ENUMS ACCESSIBLE
// use this enums with Object.keys or Object.values if necessary
import * as enums from './enums';
export { enums };


export const NAME_SEPARATOR = ', '

  /*
   * We gather all scans from all embodiments to put them in a list
   * This function is invoked at least at two places:
   *  1. When getting the scans in the agenda for display
   *  2. When retrieving the scans in the ScanInspector
   *
   * Arguments
   * =========
   * embodiments: the data source of embodiments
   * retainEmbodiment: whether to retain the embodiment in which the scan was found,
   *                   default is false
   *
   * Return
   * ======
   * Either a list of scans (if retainEmbodiments is false) or a list of [embodiment, scan] pairs
   */
export function gatherScans(
  embodiments: Array<models.ResourceEmbodiment>,
  scanFilter: (e: models.Scan) => boolean = null
): Array<models.Scan> {
  const allScans: Array<any> = [];
  for (const embodiment of embodiments) {
    let scans = embodiment.scans;
    if (scanFilter) {
      // if filter is specified, apply it to scans before adding them
      scans = scans.filter(scanFilter);
    }
    // add all scans to result list
    for (const scan of scans) {
      allScans.push(scan);
    }
  }
  return allScans;
}

export function gatherScansWithEmbodiment (
  embodiments: Array<models.ResourceEmbodiment>,
  scanFilter: (e: models.Scan) => boolean = null
): Array<[models.ResourceEmbodiment, models.Scan]> {
  const embodimendScans: Array<any> = [];
  if (embodiments === undefined){
    return embodimendScans;
  }
  for (const embodiment of embodiments) {
    let scans = embodiment.scans;
    if (scanFilter) {
      // if filter is specified, apply it to scans before adding them
      scans = scans.filter(scanFilter);
    }
    // add all scans to result list
    for (const scan of scans) {
      embodimendScans.push([embodiment, scan]);
    }
  }
  return embodimendScans;
}

export function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime());
}

export function invert_enum(obj: Object) {
  const inverse = new Object();
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (inverse.hasOwnProperty(val)) {
      // Error("Mapping not invertible. Duplicate value: " + val);
      console.log('Error inverting enum, yet proceeding');
    }
    inverse[val] = key;
  }
  return inverse;
}

/* Use this function to extract all possible enum values for user input */
export function enum_values(obj) {
  const values = []
  for (const prop of Object.keys(obj)) {
    values.push(obj[prop]);
  }
  return values;
}


export const PropertyPrefixByType = invert_enum(enums.resourceType);
export function typedProperty(type: string, property: string) {
  return PropertyPrefixByType[type] + '_' + property;
}

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
      return [
        typedProperty(rtype.journal, 'title'),
        typedProperty(rtype.journal, 'subtitle'),
      ];

    case rtype.book:
    case rtype.editedBook:
    case rtype.monograph:
    case rtype.referenceBook: {
      // in these cases, the book series and sets are flattened.
      return [typedProperty(rtype.bookSeries, 'title'),
              typedProperty(rtype.bookSeries, 'number'),
              typedProperty(rtype.bookSet, 'title')];
    }

    default:
      return [];
  }
}



export function containerTypes (type: enums.resourceType): Array<enums.resourceType> {
  /** Unused at the moment ? */
  const resourceType = enums.resourceType;
    switch (type) {
        case resourceType.monograph || resourceType.editedBook || resourceType.book || resourceType.referenceBook:
            return [resourceType.bookSet, resourceType.bookSeries];
        case resourceType.bookSet:
            return [resourceType.bookSeries]
        case resourceType.bookChapter || resourceType.bookSection || resourceType.bookPart || resourceType.bookTrack || resourceType.component:
            return [resourceType.editedBook, resourceType.book, resourceType.monograph]
        case resourceType.proceedingsArticle:
            return [resourceType.proceedings]
        case resourceType.journalArticle:
            return [resourceType.journalIssue, resourceType.journalVolume, resourceType.journal]
        case resourceType.journalIssue:
            return [resourceType.journalVolume, resourceType.journal]
        case resourceType.journalVolume:
            return [resourceType.journal]
        case resourceType.report:
            return [resourceType.reportSeries]
        case resourceType.referenceEntry:
            return [resourceType.referenceBook]
        case resourceType.standard:
            return [resourceType.standardSeries]
        case resourceType.dataset:
            return [resourceType.dataset]
        default:
            // return as default just book -- or []
            return []
    }
}

/** MetaData
 * This is an Interface for MetaData that both TypedResourceView's and ToDo's
 * should provide. Keep in mind that most of the attributes are marked optional
 * in the specific implementations.
 **/
export interface Metadata {
  identifiers: Array<models.Identifier>;
  type: enums.resourceType;
  title: string;
  subtitle: string;
  edition: string;
  number: string;
  contributors: Array<models.AgentRole>;
  publicationDate: Date;
}
export function authors2contributors (authors: string[]): models.AgentRole[] {
  if (!authors) {return []};
  const contributors = [];
  for (const author of authors) {
    const agent: models.ResponsibleAgent = {
      nameString: author,
      identifiers: [],
      givenName: '',
      familyName: '',
    }
    const role: models.AgentRole = {
      roleType: enums.roleType.author,
      heldBy: agent,
      identifiers: [],
    }
    contributors.push(role);
  }
  return contributors;
}

export function OCR2MetaData(ocr: models.OCRData): Metadata {
  console.log('Extracting OCR data from', ocr);
  const ocrDate = new Date(ocr.date);
  const obj =  {
    title: ocr.title || '',
    subtitle: '',
    number: ocr.volume || '',
    contributors: authors2contributors(ocr.authors),
    publicationDate: ocrDate,
    identifiers: [],
    type: enums.resourceType.report,
    edition: '',
  };
  console.log('Extracted', obj);
  return obj;

}

/* Our own enum for provenance data */
// DEPRECATED, use data.source instead
export enum Provenance {
  unknown = 'Unknown',
  gScholar = 'Google Scholar',
  crossref = 'CrossRef',
  swb = 'SWB',
  locdb = 'LOC-DB',
  local = 'Local'
}

export class TypedResourceView implements Metadata {
  readonly data: models.BibliographicResource | models.ToDo;
  private _prefix: string;
  readonly viewport_: string;
  children: Array<TypedResourceView> | undefined;

  constructor(brOrToDo: models.BibliographicResource | models.ToDo, astype?: string) {
    // this will throw if type is invalid!, but that s not too bad.
    this.viewport_ = astype ? astype : brOrToDo.type;
    // console.log(this.viewport_);
    this._prefix = PropertyPrefixByType[this.viewport_] + '_';
    this.data = brOrToDo;


    // New: directly make children also typed resources
    if (brOrToDo.hasOwnProperty('children')) {
      const todo = <models.ToDo>brOrToDo;
      // WARNING: this is essentially recursive, child resources should not
      // have too many levels of children
      this.children = todo.children.map(child => new TypedResourceView(child));
    } else {
      this.children = undefined;
    }

  }

  /* Short-hand to decide whether the underlying resource is a ToDo item.
  This is preferred over checking for childrens directly, as the types and
  implementation may change.

  */
  isTodo() {
    if (this.status === enums.status.valid) {
      // valid resources are not To Do, per def
      return false;
    }

    if (this.status === enums.status.ocrProcessed
      || this.status === enums.status.ocrProcessing
      || this.status === enums.status.notOcrProcessed) {
      // Status is OCR related
      return true;
    }

    if (this.status === enums.status.external && this.data.parts && this.data.parts.length) {
      // Status is external and has some notion of references (parts)
      return true;
    }

    if (!this.status) {
      // Some explicit ToDo items do not have an actual status
      return true;
    }

    // default-case
    return false;
  }

  set_from(other: Partial<Metadata>): void {
    /* Sets typed properties from metadata */
    this.identifiers = other.identifiers;
    this.title = other.title;
    this.subtitle = other.subtitle;
    this.edition = other.edition;
    this.number = other.number;
    this.contributors = other.contributors;
    this.publicationDate = other.publicationDate;
  }

  getTypedPropertyWrap(type: enums.resourceType, property: string) {
    console.log('raise DeprecationWarning, use getTypedProperty, wrapper is now obsolete');
    return this.getTypedProperty(type, property)
  }

  getTypedProperty(type: enums.resourceType, property: string) {
    const typed_property = typedProperty(type, property);
    return this.data[typed_property];
  }

  /** Returns new View of different type on same resource  */
  astype(otherType): TypedResourceView {
    return new TypedResourceView(this.data, otherType);
  }

  getForeignProperties() {
    return foreignPropertiesByType(<enums.resourceType>this.viewport_);
  }

  isJournalLike() {
    // could use viewport instead
    const rType = this.type;
    return rType === enums.resourceType.journalIssue || rType === enums.resourceType.journalVolume;
  }

  isBookLike() {
    // could use viewport instead
    const rType = this.type;
    return (
      rType === enums.resourceType.monograph ||
      rType === enums.resourceType.editedBook ||
      rType === enums.resourceType.book ||
      rType === enums.resourceType.referenceBook
    )
  }

  toString(): string {
    /** Method to return a short-hand string representation
     *  which can be used for auto-completion techniques.
     *  It is also used for the main-title generation.
     */
    const value = this;
    if (this.isJournalLike()) {
      const components: Array<string> = [];

      if (value.title) {
        let ownTitle = value.title;
        if (value.subtitle) {
          ownTitle += ' ' + value.subtitle;
        }
        components.push(ownTitle);
      }

      let journalTitle = value.astype(enums.resourceType.journal).title;

      if (journalTitle) {

        const journalSubtitle = value.astype(enums.resourceType.journal).subtitle;
        if (journalSubtitle) {
          journalTitle += ' ' + journalSubtitle;
        }
        components.push(journalTitle);
      }

      const volumeNumber = value.astype(enums.resourceType.journalVolume).number;
      if (volumeNumber) {
        components.push('Vol. ' + volumeNumber);
      }

      const issueNumber = value.astype(enums.resourceType.journalIssue).number;
      if (issueNumber) {
        components.push('Issue ' + issueNumber);
      }

        // journals issues and volumes do not need anything else, we're done here.
      return components.join(', ');
    }

    // Otherwise, always use own title:
    // the very important default, is the resource's OWN TITLE.
    // also plain journals are dealt with here
    let s = '';
    if (value.title) {
      s += value.title;
      if (value.subtitle) {
        s += ' ' + value.subtitle;
      }
    } else if (value.number) {
      // If no title is given, e.g. for a book chapter, use try to use its number
      s += value.number;
    }

    if (this.isBookLike()) {
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

    return s;
  }

  authorString(): string {
    let s = '';
    const editors = this.contributors.filter(x => x.roleType === enums.roleType.editor);
    const authors = this.contributors.filter(x => x.roleType === enums.roleType.author);

    if (authors.length) {
      // If authors are given use authors!
      const authorString = authors.map(x => x.heldBy.nameString).join('; ');
      s += authorString;
    } else if (editors.length) {
      // fall-back to editors if no authors available
      const editorString = editors.map(x => x.heldBy.nameString).join('; ')
      s += editorString + ' (ed.)';
    }
    return s;
  }

  publisherString(): string {
    let s = '';
    const publishers = this.contributors.filter(x => x.roleType === enums.roleType.publisher);
    if (publishers.length) {
      s += publishers[0].heldBy.nameString;
    }
    return s;
  }

  // forward native attributes
  get _id() {
    return this.data._id;
  }

  get cites(): Array<string> {
    return this.data.cites;
  }

  get parts(): Array<models.BibliographicEntry> {
    return this.data.parts;
  }

  get partOf(): string {
    return this.data.partOf;
  }

  get status(): enums.status {
    return <enums.status>this.data.status;
  }

  set status( newStatus: enums.status) {
    this.data.status = newStatus;
  }

  get type (): enums.resourceType {
    return <enums.resourceType>this.data.type;
  }

  set type ( newType: enums.resourceType ) {
    this.data.type = newType;
  }

  get identifiers(): Array<models.Identifier> {
    return this.data[this._prefix + 'identifiers'];
  }
  set identifiers( identifiers: Array<models.Identifier> ) {
    this.data[this._prefix + 'identifiers'] = identifiers;
  }

  get title(): string {
    return this.data[this._prefix + 'title'];
  }

  set title( newTitle: string) {
    this.data[this._prefix + 'title'] = newTitle;
  }

  get subtitle(): string {
    return this.data[this._prefix + 'subtitle'];
  }

  set subtitle( newSubtitle: string) {
    this.data[this._prefix + 'subtitle'] = newSubtitle;
  }

  get edition(): string {
    return this.data[this._prefix + 'edition'];
  }

  set edition(newEdition: string) {
    this.data[this._prefix + 'edition'] = newEdition;
  }

  get number(): string {
    return this.data[this._prefix + 'number'];
  }

  set number(newNumber: string) {
    this.data[this._prefix + 'number'] = newNumber;
  }

  get contributors(): Array<models.AgentRole> {
    return this.data[this._prefix + 'contributors'];
  }

  set contributors( newContributors: Array<models.AgentRole>) {
    this.data[this._prefix + 'contributors'] = newContributors;
  }

  get publicationDate(): Date {
    const strDate = this.data[this._prefix + 'publicationDate'];
    if (!strDate) { return null; }
    const date = new Date(strDate);
    if (!isValidDate(date)) {
      // return null if not valid
      return null;
    }
    return date;
  }

  set publicationDate(newDate: Date) {
    console.log('Date setter called with', newDate);
    if (!isValidDate(newDate)) {
      console.log('Date was not valid, discarding', newDate);
      this.data[this._prefix + 'publicationDate'] = undefined;
    } else {
      // console.log("setDate", newDate)
      let isoDate = newDate.toISOString();
      isoDate = isoDate.slice(0, isoDate.indexOf('T'));
      console.log('Setting publicationDate', isoDate);
      this.data[this._prefix + 'publicationDate'] = isoDate;
    }
  }

  get embodiedAs(): Array<models.ResourceEmbodiment> {
    return this.data[this._prefix + 'embodiedAs'];
  }

  set embodiedAs(newEmbodiments: Array<models.ResourceEmbodiment>) {
    this.data[this._prefix + 'embodiedAs'] = newEmbodiments;
  }

  get source(): string {
      return (<models.BibliographicResource> this.data)['source'];
  }


  fixDate() {
    // Apply getter and setter to fix the date.... n/c
    // Necessary until back-end accepts the date format it sends
    this.publicationDate = this.publicationDate;
  }

}


export function decomposeName(someString: string): Partial<models.ResponsibleAgent> {
  const [lastname, firstname, ...other] = someString.split(NAME_SEPARATOR);
  return {
    givenName: firstname,
    familyName: lastname,
    nameString: someString
  }
}

export function composeName(heldBy: models.ResponsibleAgent): string {
  /* Carefully extracts  givenName and familyName from a responsible agent.
   * Falls back to nameString if nothing is present. */
  if (!heldBy) { return 'UNK'; } // guard
  if (heldBy.givenName && heldBy.familyName) {
    return heldBy.familyName + NAME_SEPARATOR + heldBy.givenName
  } else if (heldBy.familyName) {
    return heldBy.familyName;
  } else if (heldBy.givenName) {
    return heldBy.givenName;
  } else if (heldBy.nameString) {
    return heldBy.nameString;
  }
  return 'UNK';
}

// Helpers to deal with contributors
export function extractRoleFromContribs(contribs: Array<models.AgentRole>, roleType): Array<models.AgentRole> {
  return contribs.filter(x => x.roleType === roleType);
}

export function extractAgentsFromContribs(contribs: Array<models.AgentRole>,
  property?: string): Array<models.ResponsibleAgent> | Array<any> {
  if (property) {
    return contribs.map(r => r.heldBy[property]);
  } else {
    return contribs.map(r => r.heldBy);
  }

}
