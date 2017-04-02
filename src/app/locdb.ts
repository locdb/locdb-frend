export class BibliographicResource {
  constructor(
    _id: string,
    identifiers?: Identifier[],
    type?: string,
    title?: string,
    subtitle?: string,
    edition?: string,
    number?: number,
    contributors?: AgentRole[],
    publicationYear?: number,
    parts?: BibliographicEntry[],
    partOf?: string,
    embodiedAs?: ResourceEmbodiment[]
  ) { } 
}
export class Identifier {
  constructor(
    literalValue: string,
    scheme: string
  ) { } 
}
export class AgentRole {
  constructor(
    roleType: string,
    identifiers?: Identifier[],
    heldBy?: ResponsibleAgent
  ) { } 
}
export class BibliographicEntry {
  constructor(
    bibliographicEntryText?: string,
    references?: string,
    coordinates?: string,
    scanId?: string,
    status?: string,
    authors?: string[],
    title?: string,
    date?: string,
    marker?: string
  ) { } 
}
export class ResourceEmbodiment {
  constructor(
    typeMongo?: string,
    format?: string,
    firstPage?: number,
    lastPage?: number,
    url?: string,
    scans?: ToDoParts[]
  ) { } 
}
export class ResponsibleAgent {
  constructor(
    nameString: string,
    identifiers?: Identifier[],
    givenName?: string,
    familyName?: string
  ) { } 
}
export class ToDo {
  _id: string;
  parts?: ToDoParts[];
  constructor(
    _id: string,
    parts?: ToDoParts[]
  ) { } 
}
export class ToDoParts {
  _id: string;
  status?: string;
  scans?: ToDoScans[];
  constructor(
    _id: string,
    status?: string,
    scans?: ToDoScans[]
  ) { } 
}
export class ToDoScans {
  _id: string;
  status?: string;
  constructor(
    _id: string,
    status?: string
  ) { } 
}
