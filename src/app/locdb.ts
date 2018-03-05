// Just a foward from generated code.


import * as models from './typescript-angular2-client/model/models'

class BibliographicResource implements models.BibliographicResource {
  type : string;
  get identifiers(): Array<models.Identifier> {
    return this[this.type + 'Identifiers'];
  }
  set identifiers( identifiers: Array<models.identifier> ) {
    this[this.type + 'Identifiers'] = identifiers;
  }
  get title() {
    return this[this.type + 'Title'];
  }


}

export { BibliographicResource } ;

export {AgentRole, BibliographicEntry, ErrorResponse, Feed, FeedEntry,
FeedEntryEnclosures, FeedEntryImage, FeedEntryMeta, Identifier, LogRequest,
ResourceEmbodiment, ResponsibleAgent, SuccessResponse, ToDo, ToDoParts,
ToDoScans, User} from './typescript-angular2-client/model/models';
