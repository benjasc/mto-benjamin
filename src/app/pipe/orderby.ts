import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderby'
})

export class OrderByPipe implements PipeTransform {
  transform(array: Array<String>, args?) {

    // Check if array exists, in this case array contains articles and args is an array that has 1 element : !id

    if (array) {

      // get the first element
      let orderByValue = args;
      let byVal = 1;

      let isDate = false;

      if (orderByValue.charAt(0) === '*') {
        isDate = true;
        orderByValue = orderByValue.substring(1);
        console.log('es date : ' + isDate);
      }

      // check if exclamation point
      if (orderByValue.charAt(0) === '-') {
        // reverse the array
        byVal = -1;
        orderByValue = orderByValue.substring(1);
      } else {
        byVal = 1;
        orderByValue = orderByValue.substring(1);
      }
      console.log('order by ' + orderByValue);
      console.log('order ' + byVal);

      array.sort((a: any, b: any) => {
        let ele1;
        let ele2;

      if (isDate) {
        ele1 = this.fromStr2Date(a[orderByValue]);
        ele2 = this.fromStr2Date(b[orderByValue]);
      } else {
        ele1 = a[orderByValue];
        ele2 = b[orderByValue];
      }

        if (ele1 < ele2) {
          return -1 * byVal;
        } else if (ele1 > ele2) {
          return 1 * byVal;
        } else {
          return 0;
        }
      });
      return array;
    }
  }

  fromStr2Date (date) {
    const days = +date.substr(0, 2);
    const month = +date.substr(3, 2);
    const year = +date.substr(6, 4);
    return new Date(year, month, days);
  }

}
