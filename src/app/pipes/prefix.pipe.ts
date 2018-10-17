import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prefix'
})
export class PrefixPipe implements PipeTransform {

  transform(value: any, prefix: string = ', '): string {
    if (!!value) {
      return prefix + value;
    }
    return '';
  }

}
