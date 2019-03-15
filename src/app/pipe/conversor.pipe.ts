import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'conversor'
})
export class ConversorPipe implements PipeTransform {
  constructor(
    private datePipe: DatePipe
  ) {

  }

  transform(value: any, args?: any): any {
    return null;
  }

  public transformDate(value: any) {
    if (value) {
      return this.datePipe.transform(value, 'dd/MM/yyyy');
    }
    return value;
  }
}
