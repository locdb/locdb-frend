import { Pipe, PipeTransform } from '@angular/core';
import { models, enums, composeName, TypedResourceView } from '../locdb';
import { StandardPipe, JournalStandardPipe } from './type-pipes';


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'container'})
export class ContainerPipe implements PipeTransform {
  transform(typedResource: TypedResourceView, standalone: boolean = false): string {
    // Use colon ':' when its a standalone resource, else ',' by default
    const author_suffix = standalone ? ': ' : ', ';
    const standardPepe = new StandardPipe()
    const journalStandardPepe = new JournalStandardPipe()
    // !<something> catches null and undefined
    if (!typedResource) { return '(no resource)'; }

    if (typedResource.partOf !== undefined) {
      console.log('[warning] Maybe ContainerPipe received child...');
    }
    // <Journal>, <Journal Issue>, <Journal Volume>
    // <eigene>, <bookSet>, <bookSeries>
    let containerString = '';

    // always show the real type of the resource
    containerString += '<span class="badge badge-primary">' + typedResource.type + '</span> ';
    // containerString += 'TYPE' + typedResource.type;
    // console.log('Container pipe called', containerString);


    const seperator = ' '; // semicolon should be only used to separate authors
    // if type is Journal, Journal Issue or Journal Volume gather metadata from all three
    if ([enums.resourceType.journal.valueOf(),
      enums.resourceType.journalIssue.valueOf(),
      enums.resourceType.journalVolume.valueOf()]
      .indexOf(typedResource.type) !== -1) {
      // truely awesome stuff
      // let standardString = standardPepe.transform(typedResource, enums.resourceType.journal, ', ', author_suffix)
      // containerString += (standardString.trim().length > 0 ? standardString + seperator : '')
      // standardString = standardPepe.transform(typedResource, enums.resourceType.journalIssue, ', ', author_suffix)
      // containerString += (standardString.trim().length > 0 ? standardString + seperator : '')
      // containerString += standardPepe.transform(typedResource, enums.resourceType.journalVolume, ', ', author_suffix)
      // handpicked values
      containerString += journalStandardPepe.transform(typedResource, ', ', standalone)
    } else {
      // if not Journal, Journal Issue or Journal Volume just gather metadata from this resourceType
      containerString += standardPepe.transform(typedResource, null, ', ', standalone)
    }
    // additionally if type is either bookSet nor bookSeries add metadata from this types
    if ([enums.resourceType.bookSet.valueOf(),
      enums.resourceType.bookSeries.valueOf()
      // enums.resourceType.journal.valueOf(),
      // enums.resourceType.journalIssue.valueOf(),
      // enums.resourceType.journalVolume.valueOf()
    ].indexOf(typedResource.type) !== -1) {
      let standardString = standardPepe.transform(typedResource, enums.resourceType.bookSet, ', ', standalone)
      containerString += (standardString.trim().length > 0 ? seperator + standardString : '')
      standardString = standardPepe.transform(typedResource, enums.resourceType.bookSeries, ', ', standalone)
      containerString += (standardString.trim().length > 0 ? seperator + standardString : '')
    }
    return containerString;
  }
}
