import { Identifier } from "./identifier" 

export class BibliographicResource {
  constructor(
    identifiers?: [Identifier],
    type?: string,
    title?: string,
    subtitle?: string,
    edition?: string,
    number?: number, // e.g. number of an article in journal
    contributors?: [{
        identifiers: [Identifier],
        roleType: string,
        heldBy: {
            identifiers: [Identifier],
            nameString: string,
            givenName: string,
            familyName: string
        }
    }],
    // keywords: [string],
    publicationYear?: number,
    parts?: [{
        bibliographicEntryText: string,
        references: string // link to other br
    }], // reference entries
    partOf?: string, // link to other br
    cites?: [string], // links to other brs
    embodiedAs?: [{ // link to ressource embodiment
        type_: string, // digital or print
        format: string, // IANA media type
        firstPage: number,
        lastPage: number,
        url: string
    }]
  ) {  }

  remove_author(position: number) {
    // return this.authors.splice(position, 1);
  }
  add_author(name: string) {
    // return this.authors.push(name);
  }

  pretty_print_authors() {
    // return this.authors.join(' & ');
  }

  deepcopy() {
    // return new Citation(this.id,
    //   this.source,
    //   this.reftype,
    //   Object.create(this.authors),
    //   this.title,
    //   this.year,
    //   this.journal,
    //   this.volume,
    //   this.issue,
    //   this.pages);
  }
}

export type BR = BibliographicResource;
export interface MarkedBR { bibligraphicResource: BR; marked: boolean; };
