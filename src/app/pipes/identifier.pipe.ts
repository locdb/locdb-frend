import { Pipe, PipeTransform } from '@angular/core';
import { models, enums, composeName } from '../locdb';


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'identifier'})
export class IdentifierPipe implements PipeTransform {
  transform(identifiers: Array<models.Identifier>, seperator: string = ';'): string {
    console.log("identifier")
    if (identifiers != undefined){
      // const identifier = identifiers.filter(x => x.roleType === enums.roleType.author);
      const identifierString = identifiers.map(x => this.spanIdentifier(x)).join(seperator);
      return identifierString;
    } else {
      return "(no identifiers)";
    }
  }

  spanIdentifier(i: models.Identifier){
    console.log("identifier", i)
    if(['URI','URL_CROSSREF', 'URL_SWB'].indexOf(i.scheme) == -1){
        return '<span class="badge badge-info">' + i.scheme + ': ' + i.literalValue + '</span>'
    }
    else {
        return ''
        //  <span class="badge badge-info" href="' + i.literalValue + '">' + i.scheme + ': ' + i.literalValue.split("/")[2] + '</span>'
    }
  }
}
