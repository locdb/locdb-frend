export class BibliographicResource {
  _id: string;
  identifiers?: Identifier[];
  type?: string;
  title?: string;
  subtitle?: string;
  edition?: string;
  number?: number;
  contributors?: AgentRole[];
  publicationYear?: number;
  parts?: BibliographicEntry[];
  partOf?: string;
  embodiedAs?: ResourceEmbodiment[];
}
export class Identifier {
  literalValue: string;
  scheme: string;
}
export class AgentRole {
  identifiers?: Identifier[];
  roleType: string;
  heldBy?: ResponsibleAgent;
}
export class BibliographicEntry extends BibliographicResource {
  bibliographicEntryText?: string;
  references?: string;
  coordinates?: string;
  scanId?: string;
  status?: string;
  authors?: string[];
  title?: string;
  date?: string;
  marker?: string;
  // added
  publisher?: string;
  // _id: string;
}
export class ResourceEmbodiment {
  typeMongo?: string;
  format?: string;
  firstPage?: number;
  lastPage?: number;
  url?: string;
  scans?: ToDoParts[];
}
export class ResponsibleAgent {
  identifiers?: Identifier[];
  nameString: string;
  givenName?: string;
  familyName?: string;
}
export class ToDo {
  _id: string;
  // parts?: ToDoParts[];
  children?: ToDoParts[];
}
export class ToDoParts {
  _id: string;
  status?: string;
  scans?: ToDoScans[];
}
export class ToDoScans {
  _id: string;
  status?: string;
}

export class ExternalResource {
  identifiers?: Identifier[];
  status?: string;
  authors: string[];
  title: string;
  // added
  publisher:string;
  year:number;
  number?: number;
}
