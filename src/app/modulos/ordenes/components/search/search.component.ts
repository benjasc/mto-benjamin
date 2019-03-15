import { Utils } from './../../../shared/utils/utils';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SearchService } from './../../../shared/services/searchservice';
import { OrderTypeService } from './../../../shared/services/ordertypeservice';
import { IMyDateModel } from 'mydatepicker';
import { DateFormat } from './dateFormat';
import { GLOBAL } from './../../../shared/services/global';
import * as XLSX from 'xlsx';

import { MessageService } from './../../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { EmailService } from './../../../shared/services/email.service';
import { Usuario } from './../../../shared/vo/usuario';
import { Globals } from './../../../shared/utils/globals';
import { MenuProfile } from './../../../shared/vo/menu';
import { Router } from '@angular/router';
import { RutDirective } from '../../../shared/directives/rut.directive';


const INPUT_INIT_OC = 'Ingrese N° OC';
const INPUT_INIT_RUT =  'Ingrese Rut, Ejemplo 11.111.111-1';
const RUT = 'rut';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {



  radioButtonSelected: String;
  inputOCRut: String;
  textInput: String = INPUT_INIT_OC;
  // Rut
  cuerpoRut: string;
  dvRut: string;



  constructor(public searchInfo: SearchService, public emailInfo: EmailService, public messageService: MessageService,
    public dialogService: DialogService, public globals: Globals, public router: Router, public orderTypeService: OrderTypeService) {
      this.inputOCRut = '';
  }

  ngOnInit() {

  }

  buscarGuiasUnitarias() {
    console.log(this.inputOCRut);
    if (this.radioButtonSelected === RUT){
      console.log(this.inputOCRut);
      const isRutValido = this.validarRut(this.inputOCRut);
    } else {
      // Servicio que buscara los productos por OC
    }
  }

  validarRut(rutFull:String) {
    console.log(rutFull);
    const rut = rutFull.split('-');

    const cuerpoIn = rut[0];
    console.log(cuerpoIn);
    let dvIn = rut[1];
    console.log(dvIn);

    console.log(cuerpoIn,dvIn);

    let suma: any;
    let multiplo: any;
    let i: any;
    let index: any;
    let valor: any;
    let dvEsperado: string;

    valor = cuerpoIn + '' + dvIn;

    // Si no cumple con el mínimo ej. (n.nnn.nnn)
    if (cuerpoIn.length < 7) {
      console.log('Rut no cumple con largo minimo');
      return false;
    }

    // Calcular Dígito Verificador
    suma = 0;
    multiplo = 2;

    for (i = 1; i <= cuerpoIn.length; i++) {
      index = multiplo * valor.charAt(cuerpoIn.length - i);
      suma = suma + index;
      if (multiplo < 7) {
        multiplo = multiplo + 1;
      } else {
        multiplo = 2;
      }
    }

    // Calcular Dígito Verificador en base al Módulo 11
    dvEsperado = 11 - (suma % 11) + '';

    // Casos Especiales (0 y K)
    dvIn = dvIn === 'K' ? '10' : dvIn;
    dvIn = dvIn === '0' ? '11' : dvIn;

    // Validar que el Cuerpo coincide con su Dígito Verificador
    if (dvEsperado !== dvIn) {
      console.log('Rut no coincide con dv');
      return false;
    }

    console.log('Rut válido');
    return true;
  }



  validationOc(oc: any) {
    // tslint:disable-next-line:max-line-length
    const FACTOR_REGEXP = /^[0-9]{1,20}([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?$/;
    if (FACTOR_REGEXP.test(oc)) {
      return true;
    } else {
      return false;
    }
  }


  radioButtonChange(evt: any) {
    this.radioButtonSelected =  evt.srcElement.value;
    if (this.radioButtonSelected === RUT) {
        this.textInput = INPUT_INIT_RUT;
        this.inputOCRut = undefined;
    } else {
      this.textInput = INPUT_INIT_OC ;
      this.inputOCRut = undefined;
    }
  }
}
