/** A Bibliographic Resource */
// actually a partial resource
export class BibliographicResource {
  _id?: string;
  identifiers?: Identifier[];
  type?: string;
  title?: string;
  subtitle?: string;
  edition?: string;
  number?: string;
  contributors?: AgentRole[];
  publicationYear?: string;
  status?: string;
  parts?: BibliographicEntry[];
  partOf?: string; // _id of other resource
  containerTitle?: string;
  embodiedAs?: ResourceEmbodiment[];
  /* should be aggregate of parts.references */
  cites?: string[];

  constructor(br: Partial<BibliographicResource>) {
    // TODO do this properly, recursively call subconstructors
    this._id = br._id;
    this.identifiers = br.identifiers.map(id => new Identifier(id))
    this.type = br.type;
    this.title = br.title;
    this.subtitle = br.subtitle;
    this.edition = br.edition;
    this.number = br.number;
    this.contributors = br.contributors.map(c => new AgentRole(c));
    this.publicationYear = br.publicationYear;
    this.status = br.status;
    this.parts = br.parts.map(br => new BibliographicEntry(br));
    this.partOf = br.partOf;
    this.containerTitle = br.containerTitle;
    this.cites = br.cites;
  }

  get authors() {
    return this.contributors.filter(c => c.roleType === 'AUTHOR').map(authrole => authrole.heldBy.nameString);
  }

  identifierValues(forScheme: string): string[] {
    return this.identifiers.filter(ident => ident.scheme === forScheme).map(ident => ident.literalValue);
  }
}

type PartialResource = Partial<BibliographicResource>;


/** Generic identifier */
export class Identifier {
  literalValue: string;
  scheme: string;

  constructor (id: Partial<Identifier> ) {
    this.literalValue = id.literalValue;
    this.scheme = id.scheme;
  }

  toString(): string {
    return `${this.scheme}=${this.literalValue}`;
  }
}

export const ROLES = [
   'ARCHIVIST',
   'AUTHOR',
   'AUTHOR\'S AGENT',
   'BIOGRAPHER',
   'BLOGGER',
   'COMMISSIONING EDITOR',
   'COMPILER',
   'CONTRIBUTOR',
   'COPY EDITOR',
   'COPYRIGHT OWNER',
   'CRITIC',
   'DEPUTY EDITOR',
   'DISTRIBUTOR',
   'EDITOR',
   'EDITOR-IN-CHIEF',
   'EXECUTIVE EDITOR',
   'GHOST WRITER',
   'GUEST EDITOR',
   'ILLUSTRATOR',
   'JOURNALIST',
   'LIBRARIAN',
   'MANAGING EDITOR',
   'PEER REVIEWER',
   'PRINTER',
   'PRODUCER',
   'PRODUCTION EDITOR',
   'PROOF READER',
   'PUBLISHER',
   'READER',
   'REVIEWER',
   'SENIOR EDITOR',
   'SERIES EDITOR',
   'TRANSLATOR',
];


/** An intermediate class to model N:M relationships between resources and
 * agents */
export class AgentRole {
  _id?: string;
  identifiers: Identifier[];
  roleType: string;
  heldBy: ResponsibleAgent;

  constructor(role: Partial<AgentRole>) {
    this._id = role._id;
    this.identifiers = role.identifiers.map(id => new Identifier(id));
    this.roleType = role.roleType;
    this.heldBy = new ResponsibleAgent(role.heldBy);
  }

  // extracted from http://www.sparontologies.net/ontologies/pro/source.html#d4e361
  // as referenced by OCC metadata model
  // could be an enum
}

/** An entry in the references list of a resource */
export class BibliographicEntry {
  _id?: string;
  bibliographicEntryText?: string;
  references?: string;
  scanId?: string;
  status?: string;
  ocrData?: OCRData;
  identifiers?: Identifier[];
  constructor (be: Partial<BibliographicEntry>) {
    this._id = be._id;
    this.bibliographicEntryText = be.bibliographicEntryText;
    this.references = be.references;
    this.scanId = be.scanId;
    this.status = be.status;
    this.ocrData = be.ocrData;
    this.identifiers = be.identifiers.map(id => new Identifier(id));
  }
}

/** Addition to the OCC Metadata model to support OCR data */
export class OCRData {
  coordinates?: string;
  authors?: string[];
  title?: string;
  date?: string;
  marker?: string;
  comments?: string;
  journal?: string;
  volume?: string;
}

/** A model for embodiments of a resource */
export class ResourceEmbodiment {
  typeMongo?: string;
  format?: string;
  firstPage?: number;
  lastPage?: number;
  url?: string;
  scans?: ToDoParts[];
}


/** This is the model for agents, e.g. actual persons */
export class ResponsibleAgent {
  identifiers: Identifier[];
  nameString: string;
  givenName?: string;
  familyName?: string;
  constructor(agent: Partial<ResponsibleAgent>) {
    this.identifiers = agent.identifiers.map(id => new Identifier(id));
    this.nameString = agent.nameString;
    this.givenName = agent.givenName;
    this.familyName = agent.familyName;
  }
  toString() {
    return this.nameString;
  }
}

/** Apart from the children and scan properties, todo items are basically resource */
export class ToDoResource extends BibliographicResource {
  children?: Partial<ToDoParts>[]; // childs does not need to be full resource
  scans?: ToDoScans[]; // for monographs, scans are directly attached to the BR
  constructor(t: Partial<ToDoResource>) {
    super(t);
    this.children = t.children.map(c => new ToDoPartsResource(c));
    this.scans = t.scans as ToDoScans[];
  }
}

export type ToDo = Partial<ToDoResource>

/** A possible child of a ToDo item */
export class ToDoPartsResource extends BibliographicResource {
  scans?: ToDoScans[];
  constructor(tp: Partial<ToDoPartsResource>) {
    super(tp);
    // does not have children
    this.scans = tp.scans as ToDoScans[];
  }
}
export type ToDoParts = Partial<ToDoPartsResource>;

/** Wrapping a Scan image by its identifier that can be accessed by /scans/<identifier> */
export class ToDoScans {
  status: ToDoStates;
  _id: string;
  firstpage?: number;
  lastpage?: number;
}


export class ProvenResource extends BibliographicResource {
  constructor(br: Partial<ProvenResource>) {
    super(br);
  }
  get provenance(): Provenance {
    // could cache
    let prov = Provenance.unknown;
    if (this._id) {
      prov = Provenance.locdb;
    } else if (this.identifiers.find(id => id.scheme === ExternalSource.swb)) {
      prov =  Provenance.swb;
    } else if (this.identifiers.find(id => id.scheme === ExternalSource.crossref )) {
      prov = Provenance.crossref
    } else if (this.identifiers.find(id => id.scheme === ExternalSource.gScholar)) {
      prov = Provenance.gScholar;
    }

    return prov
  }
}

export interface Feed {
  _id: string;
  name: string;
  url: string;
}


export function synCites_(br: BibliographicResource) {
  if (br.parts) {
    const citations: string[] = br.parts.map(x => x.references);
    br.cites = citations;
  }
}

/** ENUMS */
export enum ToDoStates {
  ocr = 'OCR_PROCESSED',
  nocr = 'NOT_OCR_PROCESSED',
  iocr = 'OCR_PROCESSING',
  ext = 'EXTERNAL',
  valid = 'VALID',
}

export enum IdentifierScheme {
  isbn = 'ISBN',
  issn = 'ISSN',
  ppn = 'PPN',
  doi = 'DOI'
}

export enum ResourceType {
  monograph = 'MONOGRAPH',
  collection = 'BOOK_CHAPTER',
  journal = 'JOURNAL'
}

export const RESOURCE_TYPES = [
  'MONOGRAPH',
  'COLLECTION',
  'JOURNAL',
]



export enum EmbodimentType {
  digital = 'DIGITAL',
  print = 'PRINT'
}

export enum ExternalSource {
  gScholar = 'URL_GOOGLE_SCHOLAR',
  crossref = 'URL_CROSSREF',
  swb = 'URL_SWB'
}

export enum Provenance {
  unknown = 'Unknown',
  gScholar = 'Google Scholar',
  crossref = 'CrossRef',
  swb = 'SWB',
  locdb = 'LOC-DB',
  local = 'Local'
}
