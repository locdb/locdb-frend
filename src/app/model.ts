export class BibliographicResource {
  constructor(

    _id: string,
    identifiers?:  [Identifier],
    type?:  string,
    title?:  string,
    subtitle?:  string,
    edition?:  string,
    number?:  number,
    contributors?:  [AgentRole],
    publicationYear?:  number,
    parts?:  [BibliographicEntry],
    partOf?:  string,
    embodiedAs?:  [ResourceEmbodiment],

  ) { } 
}
export class Identifier {
  constructor(

    literalValue: string,
    scheme: string,

  ) { } 
}
export class AgentRole {
  constructor(

    identifiers?:  [Identifier],
    roleType: string,
    heldBy?:  ResponsibleAgent,

  ) { } 
}
export class BibliographicEntry {
  constructor(

    bibliographicEntryText?:  string,
    references?:  string,
    coordinates?:  string,
    scanId?:  string,
    status?:  string,
    authors?:  [string],
    title?:  string,
    date?:  string,
    marker?:  string,

  ) { } 
}
export class ResourceEmbodiment {
  constructor(

    typeMongo?:  string,
    format?:  string,
    firstPage?:  number,
    lastPage?:  number,
    url?:  string,
    scans?:  [ToDoParts],

  ) { } 
}
export class ResponsibleAgent {
  constructor(

    identifiers?:  [Identifier],
    nameString: string,
    givenName?:  string,
    familyName?:  string,

  ) { } 
}
export class ToDoParts {
  constructor(

    _id: string,
    status?:  string,
    scans?:  [ToDoScans],

  ) { } 
}
export class ToDoScans {
  constructor(

    _id: string,
    status?:  string,

  ) { } 
}
