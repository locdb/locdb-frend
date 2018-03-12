// Just a foward from generated code.


import * as models from './typescript-angular2-client/model/models'

export {models};

// MAKE ENUMS ACCESSIBLE
// use this enums with Object.keys or Object.values if necessary
import * as enums from './enums';
export { enums };



export function invert_enum(obj: Object) {
  let inverse = new Object();
  for (let key in obj) {
    let val = obj[key]
    if (val in inverse) {
      Error("Mapping not invertible. Duplicate value: " + val);
    }
    inverse[val] = key
  }
  return inverse;
}

export function enum_values(obj) {
  let values = []
  for (let prop in obj) {
    values.push(obj[prop]);
  }
  return values;
}


/* This holds all possible enum values under same keys as in `enums` */
interface KeyedStringValues {
  [key: string]: Array<string>;
}

export const PropertyPrefixByType = invert_enum(enums.resourceType);
export function typedProperty(type : string, property: string) {
  return PropertyPrefixByType[type] + '_' + property;
}

export function containerTypes (type: enums.resourceType): Array<enums.resourceType>{
  const resourceType = enums.resourceType;
    switch(type) {
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
export interface MetaData {
  identifiers: Array<models.Identifier>;
  type: enums.resourceType;
  title: string;
  subtitle: string;
  edition: string;
  number: string;
  contributors: Array<models.AgentRole>;
  publicationYear: string;
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

export function OCR2MetaData(ocr: models.OCRData) : MetaData {
  return {
    title: ocr.title || '',
    subtitle: '',
    number: ocr.volume || '',
    contributors: authors2contributors(ocr.authors),
    publicationYear: ocr.date,
    identifiers: [],
    type: enums.resourceType.report,
    edition: '',
  };

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

export class TypedResourceView implements MetaData {
  readonly data: models.BibliographicResource;
  private _prefix: string;
  readonly viewport_: string;

  constructor(br: models.BibliographicResource | models.ToDo, astype?: string) {
    // this will throw if type is invalid!, but that s not too bad.
    this.viewport_ = astype ? astype : br.type;
    this._prefix = PropertyPrefixByType[this.viewport_] + '_';
    this.data = br;
  }

  /** ToDo Specific **/
  children(): Array<models.BibliographicResource> {
    if (this.data.hasOwnProperty('children')) {
      // TODO could map these to typed views, or do it on client side
      return (<models.ToDo>this.data).children;
    }
    // TODO could change this to empty array if more convenient
    return null;
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
    if (this.publicationYear) {
      s += `(${this.publicationYear})`;
    }
    s += '.';
    s += this.title + '.';
    return s;
  }

  authorString(): string {
    let s = '';
    let editors = this.contributors.filter(x => x.roleType === enums.roleType.editor);
    let authors = this.contributors.filter(x => x.roleType === enums.roleType.author);

    if (authors.length) {
      // If authors are given use authors!
      let authorString = authors.map(x => x.heldBy.nameString).join('; ');
      s += authorString;
    } else if (editors.length) {
      // fall-back to editors if no authors available
      let editorString = editors.map(x => x.heldBy.nameString).join('; ')
      s += editorString + ' (ed.)';
    }
    return s;
  }

  publisherString(): string {
    let s = '';
    let publishers = this.contributors.filter(x => x.roleType === enums.roleType.publisher);
    if (publishers.length){
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

  get cites() : Array<string> {
    return this.data.cites;
  }

  get parts() : Array<models.BibliographicEntry> {
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
  // forward native attributes end

  getTypedAttr(property: string, type: string): any {
    let prop = typedProperty(type, property);
    return this.data[prop];
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

  get subtitle() : string {
    return this.data[this._prefix + 'subtitle'];
  }

  set subtitle( newSubtitle: string) {
    this.data[this._prefix + 'subtitle'] = newSubtitle;
  }

  get edition() : string {
    return this.data[this._prefix + 'edition'];
  }

  set edition(newEdition: string) {
    this.data[this._prefix + 'edition'] = newEdition;
  }

  get number() : string {
    return this.data[this._prefix + 'number'];
  }

  set number(newNumber: string) {
    this.data[this._prefix + 'number'] = newNumber;
  }

  get contributors(): Array<models.AgentRole> {
    return this.data[this._prefix + 'contributors'];
  }

  set contributors( newContributors : Array<models.AgentRole>) {
    this.data[this._prefix + 'contributors'] = newContributors;
  }

  get publicationYear() : string {
    return this.data[this._prefix + 'publicationYear'];
  }

  set publicationYear(newYear: string) {
    this.data[this._prefix + 'publicationYear'] = newYear;
  }

  get embodiedAs() : Array<models.ResourceEmbodiment> {
    return this.data[this._prefix + 'embodiedAs'];
  }

  set embodiedAs(newEmbodiments: Array<models.ResourceEmbodiment>) {
    this.data[this._prefix + 'embodiedAs'] = newEmbodiments;
  }

}

// Helpers to deal with contributors
export function extractRoleFromContribs(contribs: Array<models.AgentRole>, roleType): Array<models.AgentRole> {
  return contribs.filter(x => x.roleType === roleType);
}

export function extractAgentsFromContribs(contribs: Array<models.AgentRole>, property?: string) : Array<models.ResponsibleAgent> | Array<any> {
  if (property) {
    return contribs.map(r => r.heldBy[property]);
  } else {
    return contribs.map(r => r.heldBy);
  }

}


export {BibliographicResource, AgentRole, BibliographicEntry, ErrorResponse, Feed, FeedEntry,
FeedEntryEnclosures, FeedEntryImage, FeedEntryMeta, Identifier, LogRequest,
ResourceEmbodiment, ResponsibleAgent, SuccessResponse, ToDo, ToDoParts,
ToDoScans, User, OCRData} from './typescript-angular2-client/model/models';
