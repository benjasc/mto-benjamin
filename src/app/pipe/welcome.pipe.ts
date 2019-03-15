import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'welcome'
})
export class WelcomePipe implements PipeTransform {

  transform(value: string): string {
    const message = 'Welcome to ' + value;
    return message;
  }

}
