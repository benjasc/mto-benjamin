import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRut]'
})
export class RutDirective {
  rut: String;

  constructor(private el: ElementRef) {
    this.rut = '';
  }

  @HostListener('blur') blur() {
    this.rut = this.el.nativeElement.value;
    if (this.rutValidate(this.rut)) {
      this.rut = this.rutFormat(this.rut);
      console.log(this.rut);
      this.el.nativeElement.value = this.rut;
    } else {
      this.el.nativeElement.value = 'No Válido value';
      this.el.nativeElement.innerText = 'No Válido inner';
    }
  }

  rutFormat(value) {
// tslint:disable-next-line: prefer-const
    let rut = this.rutClean(value);
    if (rut.length <= 1) {
        return rut;
    }
    let result = rut.slice(-4, -1) + '-' + rut.substr(rut.length - 1);
    for (let i = 4; i < rut.length; i += 3) {
        result = rut.slice(-3 - i, -i) + '.' + result;
    }
    return result;
  }

  rutValidate(value) {
    if (typeof value !== 'string') {
        return false;
    }
    // tslint:disable-next-line: prefer-const
    let rut = this.rutClean(value);
    let rutDigits = parseInt(rut.slice(0, -1), 10);
    let m = 0;
    let s = 1;
    while (rutDigits > 0) {
        s = (s + rutDigits % 10 * (9 - m++ % 6)) % 11;
        rutDigits = Math.floor(rutDigits / 10);
    }
    // tslint:disable-next-line: prefer-const
    let checkDigit = (s > 0) ? String((s - 1)) : 'K';
    return (checkDigit === rut.slice(-1));
}

  rutClean(value) {
    return typeof value === 'string' ? value.replace(/[^0-9kK]+/g, '').toUpperCase() : '';
  }
}
