// Just a foward from generated code.

import * as moment from 'moment';
import * as models from './typescript-angular-client/model/models'

export {models};

// MAKE ENUMS ACCESSIBLE
// use this enums with Object.keys or Object.values if necessary
import * as enums from './enums';
export { enums };


export const NAME_SEPARATOR = ', '

export function invert_enum(obj: Object) {
  const inverse = new Object();
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    if (inverse.hasOwnProperty(val)) {
      // Error("Mapping not invertible. Duplicate value: " + val);
      console.log('Error inverting enum, yet proceeding');
    }
    inverse[val] = key
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
  console.log("Extracting OCR data from", ocr);
  const ocrDate = moment(ocr.date, "YYYY").toDate();
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
  console.log("Extracted", obj);
  return obj;

}

export function isoFullDate(date: Date | string): string {
  // used in forms to provide initial value
  // we could also use Angular DatePipe here
  return moment(date).format("YYYY-MM-DD");
}

/* Our own enum for provenance data */
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

  constructor(brOrToDo: models.BibliographicResource | models.ToDo, astype?: string) {
    // this will throw if type is invalid!, but that s not too bad.
    this.viewport_ = astype ? astype : brOrToDo.type;
    // console.log(this.viewport_);
    this._prefix = PropertyPrefixByType[this.viewport_] + '_';
    this.data = brOrToDo;
  }

  /** ToDo Specific **/
  children(typed: boolean = true): Array<models.BibliographicResource> | Array<TypedResourceView> {
    if (this.data.hasOwnProperty('children')) {
      const children = (<models.ToDo>this.data).children;
      if (typed) {
        return children.map(child => new TypedResourceView(child));
      } else {
        // return as plain BRs
        return children;
      }
    }
    return null;
  }

  /* Short-hand to decide whether the underlying resource is a ToDo item.
  This is preferred over checking for childrens directly, as the types and
  implementation may change.

  */
  isTodo() {
    return this.children != null;
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

  getTypedProperty(type: enums.resourceType, property: string) {
    const prefix = PropertyPrefixByType[type];
    const typed_property = prefix + 'property';
    return this.data[typed_property];
  }



  /** Returns new View of different type on same resource  */
  astype(otherType): TypedResourceView {
    return new TypedResourceView(this.data, otherType);
  }

  toString(): string {
    /** Method to return authors or editors plus title, note
    that this can be reused but is not sufficient for itself.
    Where to place the 'year' depends on whether a container is available. */
      // could treat editors differently
    // always put title!
    let s = this.authorString();
    if (this.publicationDate) {
      s += `(${this.publicationDate})`;
    }
    s += '.';
    s += this.title + '.';
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

  get provenance(): Provenance {
    // could cache, yet identifiers may change ;)
    let prov = Provenance.unknown;
    if (this._id) {
      prov = Provenance.locdb;
    } else if (this.identifiers && this.identifiers.find(id => id.scheme === enums.externalSources.swb)) {
      prov =  Provenance.swb;
    } else if (this.identifiers && this.identifiers.find(id => id.scheme === enums.externalSources.crossref )) {
      prov = Provenance.crossref
    } else if (this.identifiers && this.identifiers.find(id => id.scheme === enums.externalSources.gScholar)) {
      prov = Provenance.gScholar;
    }
    return prov;
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
    // rely on moment library to do the conversion from string
    // moment can deal with both the initial date-time and later on full-date
    const strDate = this.data[this._prefix + 'publicationDate'];
    const mom = moment(strDate);
    const date = mom.toDate();
    return date;
  }

  set publicationDate(newDate: Date) {
    const dateMoment = moment(newDate);
    const isoFullDate = dateMoment.format("YYYY-MM-DD");
    this.data[this._prefix + 'publicationDate'] = isoFullDate;
  }

  get embodiedAs(): Array<models.ResourceEmbodiment> {
    return this.data[this._prefix + 'embodiedAs'];
  }

  set embodiedAs(newEmbodiments: Array<models.ResourceEmbodiment>) {
    this.data[this._prefix + 'embodiedAs'] = newEmbodiments;
  }

}

export function findContainerMetadata(trv: TypedResourceView, checkInitial = true): TypedResourceView {
  /* Finds the least general container type that has meta data available,
   * traverses the list of preferred container types for the current type
   * from most preferable to least preferable.
   * Designed for usage in metadata's of part.
   * When `checkInitial` is false, the initial `trv` will not be checked against the condition.
   * As a fallback, the same view as the input is returned.
   * TODO: this could even be recursive, but for now we assume that our lookup table is flattened.
   */
  if (!trv) { return null; };
  if (checkInitial && trv.title) { return trv; };

  console.log("Find correct container meta for", trv);
  const validTypes = containerTypes(trv.type);
  for (const candidateType of validTypes) {
    const view = trv.astype(candidateType);
    // could even put callback as condition...
    if (view.title) { return view };
  }
  return trv;
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
