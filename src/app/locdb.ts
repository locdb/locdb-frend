/** A Bibliographic Resource */
export class BibliographicResource {
  _id?: string;
  identifiers?: Identifier[];
  type?: string;
  title?: string;
  subtitle?: string;
  edition?: string;
  number?: number;
  contributors?: AgentRole[];
  publicationYear?: string;
  status?: string;
  parts?: BibliographicEntry[];
  partOf?: string;
  embodiedAs?: ResourceEmbodiment[];
  /* should be aggregate of parts.references */
  cites?: string[];

  // can be handled by casting
  // constructor(other: BibliographicResource) {
  //   this._id = other._id;
  //   this.identifiers = other.identifiers;
  //   this.type = other.type;
  //   this.title = other.title;
  //   this.subtitle = other.subtitle;
  //   this.edition = other.edition;
  //   this.number = other.number;
  //   this.contributors = other.contributors;
  //   this.publicationYear = other.publicationYear;
  //   this.status = other.status;
  //   this.partOf = other.partOf;
  //   this.parts = other.parts;
  //   this.embodiedAs = other.embodiedAs;
  //   this.cites = other.cites;
  // }
}


/** Generic identifier */
export class Identifier {
  literalValue: string;
  scheme: string;
}

export const ROLES = [
   'archivist',
   'author',
   'author\'s agent',
   'biographer',
   'blogger',
   'commissioning editor',
   'compiler',
   'contributor',
   'copy editor',
   'copyright owner',
   'critic',
   'deputy editor',
   'distributor',
   'editor',
   'editor-in-chief',
   'executive editor',
   'ghost writer',
   'guest editor',
   'illustrator',
   'journalist',
   'librarian',
   'managing editor',
   'peer reviewer',
   'printer',
   'producer',
   'production editor',
   'proof reader',
   'publisher',
   'reader',
   'reviewer',
   'senior editor',
   'series editor',
   'translator',
];

/** An intermediate class to model N:M relationships between resources and
 * agents */
export class AgentRole {
  _id?: string;
  identifiers: Identifier[];
  roleType: string;
  heldBy?: ResponsibleAgent;

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
  identifiers?: Identifier[];
  nameString: string;
  givenName?: string;
  familyName?: string;
}

/** Apart from the children property, todo items are basically resource */
export class ToDo extends BibliographicResource {
  children?: ToDoParts[];
  scans?: ToDoScans[]; // for monographs, scans are directly attached to the BR
}

/** A possible child of a ToDo item */
export class ToDoParts {
  _id: string;
  scans?: ToDoScans[];
}

/** Wrapping a Scan image by its identifier that can be accessed by /scans/<identifier> */
export class ToDoScans {
  status: string;
  _id: string;
}


/** External Resource Placeholder */
export class ExternalResource {
  identifiers?: Identifier[];
  status?: string;
  authors: string[];
  title: string;
  publisher?: string;
  year?: number;
  number?: number;
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
