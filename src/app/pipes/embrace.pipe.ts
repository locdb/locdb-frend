import { Pipe, PipeTransform } from '@angular/core';
import { models, enums } from '../locdb'


/*
 * Pipe to extract metadata
*/

@Pipe({name: 'embrace'})
export class EmbracePipe implements PipeTransform {
  transform(something: string): string {
      return something ? '(' + something + ')' : something
  }
}
