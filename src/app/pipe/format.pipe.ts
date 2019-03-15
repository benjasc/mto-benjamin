import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {

  transform(value: any | any, locale?: any): any {
    if (value > 0) {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0
      }).format(Number(value));
    } else {
      return 0;
    }
  }

}
