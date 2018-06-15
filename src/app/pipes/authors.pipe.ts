import { Pipe, PipeTransform } from '@angular/core';
import { models, enums, composeName } from '../locdb';


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'authors'})
export class AuthorsPipe implements PipeTransform {
  transform(
    contributors: Array<models.AgentRole>,
    seperator: string = '; ',
    author_suffix: string = null
  ): string {

    if (!contributors) { return ''; }
    const authors = contributors.filter(x => x.roleType === enums.roleType.author);
    if (!authors) { return ''; }
    let authorString = authors.map(x => composeName(x.heldBy)).join(seperator);
    if (author_suffix) {
      authorString += author_suffix;
    }
    return authorString;
  }
}
