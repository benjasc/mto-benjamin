import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberValidations]'
})
export class NumberDirectiveDirective {
  oldVal: any = null;

  constructor(private element: ElementRef) { }

  @HostListener('keyup') onMouseEnter() {
    if ((Number(this.element.nativeElement.value) >
      Number(this.element.nativeElement.max)) &&
      this.element.nativeElement.keyCode !== 46 && // delete
      this.element.nativeElement.keyCode !== 8 // backspace
    ) {
      this.element.nativeElement.value = this.oldVal;
    } else if ((Number(this.element.nativeElement.value) <
      Number(this.element.nativeElement.min)) &&
      this.element.nativeElement.keyCode !== 46 && // delete
      this.element.nativeElement.keyCode !== 8 // backspace
    ) {
      this.element.nativeElement.value = null;
    } else {
      this.oldVal = Number(this.element.nativeElement.value);
    }
  }
}

