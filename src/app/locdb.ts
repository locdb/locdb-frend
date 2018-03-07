// Just a foward from generated code.


import * as models from './typescript-angular2-client/model/models'

// MAKE ENUMS ACCESSIBLE
export const enums = require('backend/api/schema/enum.json')

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

export const PropertyPrefixByType = invert_enum(enums["resourceType"]);
const resourceType = enums.resourceType;

export function PropertyByType(type : string, property: string) {
  return PropertyPrefixByType[type] + '_' + property;
}

export function containerTypes (type: string){
    switch(type){
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
            // return as default just book
            return []
    }
}

export class TypedResource {
  private br: models.BibliographicResource;
  private _prefix: string;

  constructor(br: models.BibliographicResource) {
    // this will throw if type not possible!
    this._prefix = PropertyPrefixByType[br.type] + '_';
    this.br = br;
  }

  get _id() {
    return this.br._id;
  }

  get cites() : Array<string> {
    return this.br.cites;
  }

  get parts() : Array<models.BibliographicEntry> {
    return this.br.parts;
  }

  get partOf(): string {
    return this.br.partOf;
  }

  get status(): string {
    return this.br.status;
  }

  set type ( newType: string ) {
    // this will throw if type not possible!
    this._prefix = PropertyPrefixByType[newType] + '_';
    this.br.type = newType;
  }

  get identifiers(): Array<models.Identifier> {
    return this.br[this._prefix + 'identifiers'];
  }
  set identifiers( identifiers: Array<models.Identifier> ) {
    this.br[this._prefix + 'identifiers'] = identifiers;
  }

  get title(): string {
    return this.br[this._prefix + 'title'];
  }

  set title( newTitle: string) {
    this.br[this._prefix + 'title'] = newTitle;
  }

  get subtitle() : string {
    return this.br[this._prefix + 'subtitle'];
  }

  set subtitle( newSubtitle: string) {
    this.br[this._prefix + 'subtitle'] = newSubtitle;
  }

  get edition() : string {
    return this.br[this._prefix + 'edition'];
  }

  set edition(newEdition: string) {
    this.br[this._prefix + 'edition'] = newEdition;
  }

  get number() : string {
    return this.br[this._prefix + 'number'];
  }

  set number(newNumber: string) {
    this.br[this._prefix + 'number'] = newNumber;
  }

  get contributors(): Array<models.AgentRole> {
    return this.br[this._prefix + 'contributors'];
  }

  set contributors( newContributors : Array<models.AgentRole>) {
    this.br[this._prefix + 'contributors'] = newContributors;
  }

  get publicationYear() : string {
    return this.br[this._prefix + 'publicationYear'];
  }

  set publicationYear(newYear: string) {
    this.br[this._prefix + 'publicationYear'] = newYear;
  }

  get embodiedAs() : Array<models.ResourceEmbodiment> {
    return this.br[this._prefix + 'embodiedAs'];
  }

  set embodiedAs(newEmbodiments: Array<models.ResourceEmbodiment>) {
    this.br[this._prefix + 'embodiedAs'] = newEmbodiments;
  }

}


export {BibliographicResource, AgentRole, BibliographicEntry, ErrorResponse, Feed, FeedEntry,
FeedEntryEnclosures, FeedEntryImage, FeedEntryMeta, Identifier, LogRequest,
ResourceEmbodiment, ResponsibleAgent, SuccessResponse, ToDo, ToDoParts,
ToDoScans, User, OCRData} from './typescript-angular2-client/model/models';
