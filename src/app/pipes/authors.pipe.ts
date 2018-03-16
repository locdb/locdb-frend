import { Pipe, PipeTransform } from '@angular/core';
import { models, enums } from '../locdb'


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'authors'})
export class AuthorsPipe implements PipeTransform {
  transform(contributors: Array<models.AgentRole>, seperator:string='; '): string {
    const authors = contributors.filter(x => x.roleType === enums.roleType.author);
    const authorString = authors.map(x => x.heldBy.nameString).join(seperator);
    return authorString;
  }
}
