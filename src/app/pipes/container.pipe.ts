import { Pipe, PipeTransform } from '@angular/core';
import { models, enums, composeName, TypedResourceView } from '../locdb';
import { StandardPipe }from './type-pipes';


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'container'})
export class ContainerPipe implements PipeTransform {
  transform(typedResource: TypedResourceView, seperator: string = '; '): string {
    const standardPepe = new StandardPipe()
    if (typedResource != undefined){
      if(typedResource.partOf != undefined){
        console.log("Maybe ContainerPipe recieved child...")
      }
      // <Journal>, <Journal Issue>, <Journal Volume>
      // <eigene>, <bookSet>, <bookSeries>
      let containerString = ""
      // if type is Journal, Journal Issue or Journal Volume gather metadata from all three
      if([enums.resourceType.journal.valueOf(),
          enums.resourceType.journalIssue.valueOf(),
          enums.resourceType.journalVolume.valueOf()]
          .indexOf(typedResource.type) !== -1){
        let standardString = standardPepe.transform(typedResource, enums.resourceType.journal)
        containerString += (standardString.trim().length > 0 ? standardString + seperator : '')
        standardString = standardPepe.transform(typedResource, enums.resourceType.journalIssue)
        containerString += (standardString.trim().length > 0 ? standardString + seperator : '')
        containerString += standardPepe.transform(typedResource, enums.resourceType.journalVolume)
      }
      // if not Journal, Journal Issue or Journal Volume just gather metadata from this resourceType
      else {

        containerString = standardPepe.transform(typedResource)
      }
      // additionally if type is nether bookSet nor bookSeries add metadata from this types
      if([enums.resourceType.bookSet.valueOf(),
          enums.resourceType.bookSeries.valueOf(),
          enums.resourceType.journal.valueOf(),
          enums.resourceType.journalIssue.valueOf(),
          enums.resourceType.journalVolume.valueOf()]
          .indexOf(typedResource.type) == -1){
      let standardString = standardPepe.transform(typedResource, enums.resourceType.bookSet)
      containerString += (standardString.trim().length > 0 ? seperator + standardString : '')
      standardString = standardPepe.transform(typedResource, enums.resourceType.bookSeries)
      containerString += (standardString.trim().length > 0 ? seperator + standardString : '')
    }
    // console.log("Typed References", typedResource)
    // console.log("Container String", containerString)
    return containerString;
  } else {
      return "(no resource)";
    }
  }
}
