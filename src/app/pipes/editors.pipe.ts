import { Pipe, PipeTransform } from '@angular/core';
import { models, enums, composeName } from '../locdb'


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'editors'})
export class EditorsPipe implements PipeTransform {
  transform(contributors: Array<models.AgentRole>, seperator: string = ' (ed.); '): string {
    if(contributors != undefined){
      const editors = contributors.filter(x => x.roleType === enums.roleType.editor);
      const editorString = editors.map(x => composeName(x.heldBy)).join(seperator);
      return editorString;
    } else {
      return ''
    }
  }
}
