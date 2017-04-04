export class Citation {
  public static REFTYPES = ['Article', 'Journal', 'Book', 'Other'];
  constructor(
    public id?: number,
    public source?: string,
    public reftype?: string,
    public authors?: any[],
    public title?: string,
    public year?: number,
    public journal?: string,
    public volume?: number,
    public issue?: number,
    public pages?: string,
  ) {  }

  remove_author(position: number) {
    return this.authors.splice(position, 1);
  }
  add_author(name: string) {
    return this.authors.push(name);
  }

  pretty_print_authors() {
    return this.authors.join(' & ');
  }

  deepcopy() {
    return new Citation(this.id,
      this.source,
      this.reftype,
      Object.create(this.authors),
      this.title,
      this.year,
      this.journal,
      this.volume,
      this.issue,
      this.pages);
  }
}
