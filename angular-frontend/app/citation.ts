export class Citation {
  public static REFTYPES = ['Article', 'Journal', 'Book', 'Other'];
  constructor(
  public id: number,
  public source: string,
  public reftype: string,
  public authors: any[],
  public title: string,
  public year: number,
  public journal: string,
  public volume?: number,
  public issue?: number,
  public pages?: string,
  ) {  }

  removeAuthor(position: number) {
    return this.authors.splice(position, 1);
  }
  addAuthor(name: string) {
    return this.authors.push(name);
  }

  // deepcopy() {
  // }
}

