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

export class TypedResource implements models.BibliographicResource {
  private _prefix: string;

  constructor(br: models.BibliographicResource) {
    // this will throw if type not possible!
    this._prefix = PropertyPrefixByType[br.type] + '_';
    Object.assign(this, br);
  }

  set type ( newType: string ) {
    // this will throw if type not possible!
    this._prefix = PropertyPrefixByType[newType] + '_';
    this.type = newType;
  }

  get identifiers(): Array<models.Identifier> {
    return this[this._prefix + 'identifiers'];
  }
  set identifiers( identifiers: Array<models.Identifier> ) {
    this[this._prefix + 'identifiers'] = identifiers;
  }

  get title(): string {
    return this[this._prefix + 'title'];
  }

  set title( newTitle: string) {
    this[this._prefix + 'title'] = newTitle;
  }

  get subtitle() : string {
    return this[this._prefix + 'subtitle'];
  }

  set subtitle( newSubtitle: string) {
    this[this._prefix + 'subtitle'] = newSubtitle;
  }

  get edition() : string {
    return this[this._prefix + 'edition'];
  }

  set edition(newEdition: string) {
    this[this._prefix + 'edition'] = newEdition;
  }

  get number() : string {
    return this[this._prefix + 'number'];
  }

  set number(newNumber: string) {
    this[this._prefix + 'number'] = newNumber;
  }

  get contributors(): Array<models.AgentRole> {
    return this[this._prefix + 'contributors'];
  }

  set contributors( newContributors : Array<models.AgentRole>) {
    this[this._prefix + 'contributors'] = newContributors;
  }

  get publicationYear() : string {
    return this[this._prefix + 'publicationYear'];
  }

  set publicationYear(newYear: string) {
    this[this._prefix + 'publicationYear'] = newYear;
  }

  get embodiedAs() : Array<models.ResourceEmbodiment> {
    return this[this._prefix + 'embodiedAs'];
  }

  set embodiedAs(newEmbodiments: Array<models.ResourceEmbodiment>) {
    this[this._prefix + 'embodiedAs'] = newEmbodiments;
  }
}


export {BibliographicResource, AgentRole, BibliographicEntry, ErrorResponse, Feed, FeedEntry,
FeedEntryEnclosures, FeedEntryImage, FeedEntryMeta, Identifier, LogRequest,
ResourceEmbodiment, ResponsibleAgent, SuccessResponse, ToDo, ToDoParts,
ToDoScans, User, OCRData} from './typescript-angular2-client/model/models';
