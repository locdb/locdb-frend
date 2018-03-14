import { Pipe, PipeTransform } from '@angular/core';
import { models, enums } from '../locdb'


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'publisher'})
export class PublisherPipe implements PipeTransform {
  transform(contributors: Array<models.AgentRole>): string {
    const publisher = contributors.filter(x => x.roleType === enums.roleType.publisher);
    const publisherString = publisher[0].heldBy.nameString;
    return publisherString;
  }
}
