import { Pipe, PipeTransform } from '@angular/core';
import { models, enums, composeName } from '../locdb';


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'authors'})
export class AuthorsPipe implements PipeTransform {
  transform(contributors: Array<models.AgentRole>, seperator: string = '; '): string {
    if (contributors != undefined){
      const authors = contributors.filter(x => x.roleType === enums.roleType.author);
      const authorString = authors.map(x => composeName(x.heldBy)).join(seperator);
      return authorString;
    } else {
      return "(no contributors)";
    }
  }
}
