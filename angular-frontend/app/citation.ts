export class Author {
  constructor(
  public id: number,
  public name: string
  ) { }
}
export class Citation {
  constructor(
  public id: number,
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
  // deleteAuthor(author: string) {
  //   // submit also called???
  //   let index = myArray.indexOf(author, 0);
  //   if (index > -1) {
  //        myArray.splice(index, 1);
  //   }
  // }
}

