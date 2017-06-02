export class BibliographicResource {
  _id?: string;
  identifiers?: Identifier[];
  type?: string;
  title?: string;
  subtitle?: string;
  edition?: string;
  number?: number;
  contributors?: AgentRole[];
  publicationYear?: number;
  status?: string;
  parts?: BibliographicEntry[];
  partOf?: string;
  embodiedAs?: ResourceEmbodiment[];
}

export class Identifier {
  literalValue: string;
  scheme: string;
}

export const ROLES = [
   "archivist",
   "author",
   "author's agent",
   "biographer",
   "blogger",
   "commissioning editor",
   "compiler",
   "contributor",
   "copy editor",
   "copyright owner",
   "critic",
   "deputy editor",
   "distributor",
   "editor",
   "editor-in-chief",
   "executive editor",
   "ghost writer",
   "guest editor",
   "illustrator",
   "journalist",
   "librarian",
   "managing editor",
   "peer reviewer",
   "printer",
   "producer",
   "production editor",
   "proof reader",
   "publisher",
   "reader",
   "reviewer",
   "senior editor",
   "series editor",
   "translator",
]

export class AgentRole {
  _id?: string;
  identifiers?: Identifier[];
  roleType: string;
  heldBy?: ResponsibleAgent;

  // extracted from http://www.sparontologies.net/ontologies/pro/source.html#d4e361
  // as referenced by OCC metadata model
  // could be an enum
}

export class BibliographicEntry {
  _id?: string;
  bibliographicEntryText?: string;
  references?: string;
  scanId?: string;
  status?: string;
  ocrData?: OCRData;
}
export class OCRData {
  coordinates?: string;
  authors?: string[];
  title?: string;
  date?: string;
  marker?: string;
  comments?: string;
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

export class ToDo extends BibliographicResource {
  children?: ToDoParts[];
}

// export class ToDo {
//   _id: string;
//   identifiers?: Identifier[];
//   type?: string;
//   title?: string;
//   subtitle?: string;
//   edition?: string;
//   number?: number;
//   contributors?: AgentRole[];
//   publicationYear?: number;
//   children?: ToDoParts[];
// }

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
