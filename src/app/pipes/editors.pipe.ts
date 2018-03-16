import { Pipe, PipeTransform } from '@angular/core';
import { models, enums } from '../locdb'


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'editors'})
export class EditorsPipe implements PipeTransform {
  transform(contributors: Array<models.AgentRole>, seperator:string='; '): string {
    const editors = contributors.filter(x => x.roleType === enums.roleType.editor);
    const editorString = editors.map(x => x.heldBy.nameString).join(seperator);
    return editorString;
  }
}
