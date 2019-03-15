import { Directive, Renderer, ElementRef, HostListener, EventEmitter, Output, Component } from '@angular/core';
import { MessageService } from './../modulos/shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';

@Directive({
  selector: '[appSkuValidation]'
})
export class SkuDirective {
  @Output() public skuChange: EventEmitter<any>;
  skuAux: any = 0;
  skuLength: any = 0;

  constructor( private elementRef: ElementRef, private renderer: Renderer,
    private messageService: MessageService, private dialogService: DialogService) {
      this.skuChange = new EventEmitter();
    }

  @HostListener('blur') blur() {
    this.skuAux = this.elementRef.nativeElement.value;
    this.skuLength = ('' + this.skuAux).length;
    // console.log('SKU BLUR () : ' + this.skuAux);

    if (this.skuLength !== 0 && this.skuLength !== 6 && this.skuLength !== 9) {
        this.messageService.enviarMensaje('Error búsqueda', ['SKU inválido (ingresar 6 o 9 dígitos)'], 'info', this.dialogService);
        this.renderer.setElementProperty(this.elementRef.nativeElement, 'value', '');
    } else {
        this.renderer.setElementProperty(this.elementRef.nativeElement, 'value', this.skuAux);
    }

  }
}
