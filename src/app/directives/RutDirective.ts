import { Directive, Renderer, ElementRef, HostListener, EventEmitter, Output, Component } from '@angular/core';
import * as rutHelpers from 'rut-helpers';

@Directive({
  selector: '[appRutValidation]'
})
export class RutDirective {
  @Output() public rutChange: EventEmitter<any>;
  cleanedRut: string = null;
  formattedRut: string = null;

  constructor( private elementRef: ElementRef, private renderer: Renderer) {
      this.rutChange = new EventEmitter();
    }

  @HostListener('focus') focus() {
//   public onFocus(value: string) {
    this.cleanedRut = rutHelpers.rutClean(this.elementRef.nativeElement.value);
    this.renderer.setElementProperty(this.elementRef.nativeElement, 'value', this.cleanedRut);
  }

  @HostListener('blur') blur() {
//   public onBlur(value: string) {
    this.formattedRut = rutHelpers.rutFormat(this.elementRef.nativeElement.value) || '';
    this.renderer.setElementProperty(this.elementRef.nativeElement, 'value', this.formattedRut);
  }

@HostListener('change') change() {
//   public onChange(value: string) {
    this.rutChange.emit(rutHelpers.rutClean(this.elementRef.nativeElement.value));
  }
}
