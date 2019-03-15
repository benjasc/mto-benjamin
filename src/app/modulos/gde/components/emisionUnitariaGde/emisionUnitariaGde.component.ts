import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Renderer } from '@angular/core';
import { Globals } from './../../../shared/utils/globals';
import { Router } from '@angular/router';
import { EmisionUnitariaModel } from '../../model/emisionUnitariaGde.model';
import { EmisionUnitariaGdeService } from '../../services/emisionUnitariaGde.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { TableConfigEmisionGDE } from '../../util/tableConfig.util';

const INPUT_INIT_OC = 'Ingrese N° OC';
const INPUT_INIT_RUT =  'Ingrese Rut, Ejemplo 11.111.111-1';
const RUT = 'rut';
const EXPRESSION_REGULAR_OC = /^[0-9]{1,20}([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?([,][0-9]{1,20})?$/;
const RUT_INVALIDO = 'El rut ingresado no es válido';
const OC_INVALIDA = 'La OC ingresada no es valida';
@Component({
  selector: ' app-emisionUnitaria ',
  templateUrl: './emisionUnitariaGde.component.html',
  styleUrls: ['./emisionUnitariaGde.component.scss']
})
export class EmisionUnitariaGdeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: any;
  dtTrigger:Subject<any> = new Subject();




  radioButtonSelected: String;
  inputOCRut: String;
  textInput: String = INPUT_INIT_OC;
  messageValidBoolean: Boolean;
  messageValid: String;

  arrayGuiaDespacho: Array<EmisionUnitariaModel>;
  ret: any;

  constructor(public globals: Globals,
    public router: Router,
    public emisionUnitariaGDEService: EmisionUnitariaGdeService,
    public renderer: Renderer,
    public configTable: TableConfigEmisionGDE) {
      this.inputOCRut = '';
      this.arrayGuiaDespacho = new Array();
  }

  ngOnInit() {
    this.messageValidBoolean = false;
    this.dtOptions = this.configTable.dtOptionsExport;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.renderer.listenGlobal('document', 'click', (event) => {
      if (event.target.hasAttribute("view-doc-id")) {
          console.log(event.target.hasAttribute("view-doc-id"));
          console.log('despues de view-doc-id');
          console.log($('#check').val());
          console.log(this.dtOptions.data);
      }
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  refrescarTable() {
    this.dtTrigger.next();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  buscarGuiasUnitarias() {
    if (this.radioButtonSelected === RUT){
      const isRutValido = this.validarRut(this.inputOCRut);
      if ( !isRutValido ) {
        this.messageValid = RUT_INVALIDO;
        this.messageValidBoolean = true;
        return;
      }
    } else {
      const isOcValida = this.validationOc(this.inputOCRut);
      if (!isOcValida) {
        this.messageValid = OC_INVALIDA;
        this.messageValidBoolean = true;
        return;
      }
    }
    this.getGuiasDespacho();
  }

  validarRut(rutFull: String) {
    rutFull = rutFull.replace('.', '');
    rutFull = rutFull.replace('.', '');
    const rut = rutFull.split('-');
    const cuerpoIn = rut[0];
    let dvIn = rut[1];
    let suma: any;
    let multiplo: any;
    let i: any;
    let index: any;
    let valor: any;
    let dvEsperado: string;

    valor = cuerpoIn + '' + dvIn;

    // Si no cumple con el mínimo ej. (n.nnn.nnn)
    if (cuerpoIn.length < 7) {

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
      return false;
    }
    return true;
  }



  validationOc(oc: any) {
    const FACTOR_REGEXP = EXPRESSION_REGULAR_OC;
    if (FACTOR_REGEXP.test(oc)) {
      return true;
    }  return false;
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

  getGuiasDespacho() {
    let objecto: EmisionUnitariaModel;
    objecto = {
      isSelected: false,
      modeloDespacho: '',
      estadoCDU: '',
      motivoCDU: '',
      estadoMotivoReserva: '',
      cud: 0,
      ubicacion: '',
      sku: 0,
      descripcionSKU:'',
      region: '',
      comuna: '',
      direccionDespacho: '',
      nBoleta: 0,
      cantidad: 0,
      sucursalVenta: '',
      sucursalStock: 'asdasdasdasd'
    }
    let objecto1: EmisionUnitariaModel;
    objecto = {
      isSelected: false,
      modeloDespacho: '',
      estadoCDU: '',
      motivoCDU: 'asdasdasdasd',
      estadoMotivoReserva: '',
      cud: 0,
      ubicacion: '',
      sku: 0,
      descripcionSKU:'',
      region: '',
      comuna: '',
      direccionDespacho: '',
      nBoleta: 0,
      cantidad: 0,
      sucursalVenta: '',
      sucursalStock: ''
    }

    let objecto2: EmisionUnitariaModel;
    objecto = {
      isSelected: false,
      modeloDespacho: '',
      estadoCDU: 'asdasdasd',
      motivoCDU: '',
      estadoMotivoReserva: '',
      cud: 0,
      ubicacion: '',
      sku: 0,
      descripcionSKU:'',
      region: '',
      comuna: '',
      direccionDespacho: '',
      nBoleta: 0,
      cantidad: 0,
      sucursalVenta: '',
      sucursalStock: ''
    }


    const ArrayObjeto = new Array();
    ArrayObjeto.push(objecto);
    ArrayObjeto.push(objecto1);
    ArrayObjeto.push(objecto2);

      this.arrayGuiaDespacho  = ArrayObjeto;


  //    this.emisionUnitariaGDEService.getGuiasDespacho(this.inputOCRut).subscribe((res: any) => this.ret = res,
  //    error => () => {
  //    },
  //    () => {
  //       this.arrayGuiaDespacho = this.ret.guiasDespacho;
  //       if (this.arrayGuiaDespacho.length === 0) {
  //       } else {

  //       }
  //    }
  //  );
  }

  hide() {
    this.messageValidBoolean = true ? false : true;
  }
}
