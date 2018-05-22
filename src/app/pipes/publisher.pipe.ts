import { Pipe, PipeTransform } from '@angular/core';
import { models, enums, composeName } from '../locdb'


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'publisher'})
export class PublisherPipe implements PipeTransform {
  transform(contributors: Array<models.AgentRole>): string {
    if(contributors != undefined){
      const publisher = contributors.filter(x => x.roleType === enums.roleType.publisher);
      if (!publisher.length) { return ''; }
      const publisherString = composeName(publisher[0].heldBy);
      return publisherString;
    } else {
      return ''
    }
  }
}
