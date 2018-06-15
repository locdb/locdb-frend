import { Pipe, PipeTransform } from '@angular/core';
import { models, enums, composeName } from '../locdb'


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'editors'})
export class EditorsPipe implements PipeTransform {
  transform(
    contributors: Array<models.AgentRole>,
    seperator: string = '; ',
    editor_suffix: string = ' (ed.):'
  ): string {
    if (!contributors) { return ''; }
    const editors = contributors.filter(x => x.roleType === enums.roleType.editor);
    if (!editors.length) { return ''; }
    let editorString = editors.map(x => composeName(x.heldBy)).join(seperator);
    if (editorString) {
      editorString += editor_suffix;
    }
    return editorString;
  }
}
