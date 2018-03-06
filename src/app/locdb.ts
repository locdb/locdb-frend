/** A Bibliographic Resource */
// actually a partial resource
export class BibliographicResourceAbs {
  _id?: string;
  identifiers?: Identifier[];
  type?: string;
  title?: string;
  subtitle?: string;
  edition?: string;
  number?: string;
  contributors?: AgentRole[];
  publicationYear?: string;
  status?: ResourceStatus;
  parts?: BibliographicEntry[];
  partOf?: string; // _id of other resource
  containerTitle?: string;
  embodiedAs?: ResourceEmbodiment[];
  /* should be aggregate of parts.references */
  cites?: string[];

    get authors() {
      return this.contributors.filter(c => c.roleType === 'AUTHOR').map(authrole => authrole.heldBy.nameString);
    }
    get doi() {
      return this.identifiers.filter(i => i.scheme === 'DOI').map(identifier => identifier.literalValue);
    }

    identifierValues(forScheme: string): string[] {
      return this.identifiers.filter(ident => ident.scheme === forScheme).map(ident => ident.literalValue);
  }

}
export class BibliographicResource extends BibliographicResourceAbs {

  constructor(br: Partial<BibliographicResource>) {
    super();
    // TODO do this properly, recursively call subconstructors
    this._id = br._id;
    this.identifiers = [] // br.identifiers.map(id => new Identifier(id))
    for(let identifier of br.identifiers){
      this.identifiers.push(new Identifier(identifier.scheme, identifier.literalValue))
    }
    this.type = br.type;
    this.title = br.title;
    this.subtitle = br.subtitle;
    this.edition = br.edition;
    this.number = br.number;
    this.contributors = [] //br.contributors.map(c => new AgentRole(c));
    for(let contributor of br.contributors){
      this.contributors.push(contributor)
    }
    this.publicationYear = br.publicationYear;
    this.status = br.status;
    this.parts = [] //br.parts.map(be => new BibliographicEntry(be));
    for(let part of br.parts){
      this.parts.push(part)
    }
    this.partOf = br.partOf;
    this.containerTitle = br.containerTitle;
    this.cites = br.cites;
  }

}


/** Generic identifier */
export class Identifier {
  literalValue: string;
  scheme: string;
  constructor (scheme: string, literalValue: string ) {
    this.literalValue = literalValue;
    this.scheme = scheme;
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
  // constructor (id: string, identifiers: Identifier[], roleType: string, heldBy: ResponsibleAgent) {
  //   this._id  = id;
  //   this.identifiers = identifiers;
  //   this.roleType = roleType;
  //   this.heldBy = heldBy;
  // }
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
}

/** Apart from the children property, todo items are basically resource */
export class ToDo extends BibliographicResourceAbs {
  children?: ToDoParts[];
  scans?: ToDoScans[]; // for monographs, scans are directly attached to the BR
}

/** A possible child of a ToDo item */
export class ToDoParts extends BibliographicResourceAbs {
  _id: string;
  scans?: ToDoScans[];
}

/** Wrapping a Scan image by its identifier that can be accessed by /scans/<identifier> */
export class ToDoScans {
  status: ToDoStatus;
  _id: string;
  firstpage?: number;
  lastpage?: number;
}


export class ProvenResource extends BibliographicResource {
  constructor(br: BibliographicResource) {
    super(br);
    Object.assign(this, br);
  }
  get provenance(): Provenance {
    // could cache
    let prov = Provenance.unknown;
    if (this._id) {
      prov = Provenance.locdb;
    } else if (this.identifiers && this.identifiers.find(id => id.scheme === ExternalSource.swb)) {
      prov =  Provenance.swb;
    } else if (this.identifiers && this.identifiers.find(id => id.scheme === ExternalSource.crossref )) {
      prov = Provenance.crossref
    } else if (this.identifiers && this.identifiers.find(id => id.scheme === ExternalSource.gScholar)) {
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
export enum ToDoStatus {
  ocr = 'OCR_PROCESSED',
  nocr = 'NOT_OCR_PROCESSED',
  iocr = 'OCR_PROCESSING',
  ext = 'EXTERNAL',
  valid = 'VALID',
}

export enum ResourceStatus {
  external = 'EXTERNAL',
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
  'Book',
  'Book chapter',
  'Book part',
  'Book section',
  'Book series',
  'Book set',
  'Book track',
  'Component',
  'Dataset',
  'Dissertation',
  'Edited book',
  'Journal article',
  'Journal Issue',
  'Journal Volume',
  'Journal',
  'Monograph',
  'Proceedings article',
  'Proceedings',
  'Reference book',
  'Reference entry',
  'Report series',
  'Report',
  'Standard series',
  'Standard',
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

export enum Origin {
  ocr = 'OCR',
  internal = 'INTERNAL',
  external = 'EXTERNAL'
}
