import { Utils } from './../../../shared/utils/utils';
import { Context } from './../../../shared/vo/Context';
import { TrxIdentify } from './../../../../modulos/ordenes/vo/TrxIdentify';
import { TrxHdr } from './../../../../modulos/ordenes/vo/TrxHdr';
import { SearchService } from './../../../shared/services/searchservice';
import { OrderTypeService } from './../../../shared/services/ordertypeservice';
import { Component, OnInit, ViewChild } from '@angular/core';
import { InconsistenciasOcService } from './../../../../modulos/ordenes/services/inconsistencias-oc.service';
import { Producto } from './../../../../modulos/ordenes/vo/producto';
import { Pago } from './../../../../modulos/ordenes/vo/pago';
import { Sale } from './../../../../modulos/ordenes/vo/sale';
import { Shipping } from './../../../../modulos/ordenes/vo/shipping';
import { Transaction } from './../../../../modulos/ordenes/vo/transaction';
import { ConversorPipe } from './../../../../pipe/conversor.pipe';
import { IMyDateModel } from 'mydatepicker';
import { DateFormat } from './dateFormat';
import { GLOBAL } from './../../../shared/services/global';
import { TrxInject } from './../../../../modulos/ordenes/vo/TrxInject';
import { MessageService } from './../../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { Usuario } from './../../../shared/vo/usuario';
import { Globals } from './../../../shared/utils/globals';
import { MenuProfile } from './../../../shared/vo/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inconsistencias-oc',
  templateUrl: './inconsistencias-oc.component.html',
  styleUrls: ['./inconsistencias-oc.component.scss']
})
export class InconsistenciasOcComponent implements OnInit {
  public titulo: string;
  public states: any;
  public bugList: any;
  public files: any;

  model: any = {};
  loading = false;
  loadings = false;
  loadingDetail = false;
  loadingCheck = false;
  loadingCheckEomCreateSKu = false;
  loadingCheckEomCreate = false;
  loadingCheckEomAct = false;
  loadingCheckPpl = false;
  loadingCheckGc = false;
  loadingCheckEmail = false;
  loadingCheckUpdateTmas = false;

  message: any;
  dateNow = new Date();
  ret: any;
  ret2: any;
  retEvent: any;
  listLegacySFFC: Array<any>;
  listLegacySDV: Array<any>;
  listLegacyIOC: Array<any>;
  listLegacyEOMCreate: Array<any>;
  listLegacyEOMAct: Array<any>;
  listLegacyPPL: Array<any>;
  listLegacyGF: Array<any>;
  listLegacyEmail: Array<any>;
  listLegacyUpdateTmas: Array<any>;
  listOrdes: any;
  resultsDetail: any;
  mpagoDetailList: Pago[];
  productDetailList: Producto[];
  saleDetail: Sale[];
  shippingDetailList: Shipping[];
  trxDetailList: Transaction[];
  fechaCompraDesde: Date;
  fechaCompraHasta: Date;

  results: any;
  resultado: any;

  // Paginador
  pgrows: Number;
  pgCurrentSfcc: Number;
  pgCurrentIoc: Number;
  pgCurrentSdv: Number;
  pgCurrentEom: Number;
  pgCurrentEomCreate: Number;
  pgCurrentEomAct: Number;
  pgCurrentUpdateTmas: number;
  pgCurrentPpl: Number;
  pgCurrentGc: Number;

  // ordenar
  orderProperty: String;
  orderPropertySdv: String;
  currentColumn: any;
  currentDirection: any;
  dir: any;

  // reinjection
  reinjectLoading = false;
  sdv = 'SDV';

  // datePicker
  myDatePickerOptionsDesde: any;
  myDatePickerOptionsHasta: any;
  myDatePickerOptionsCopy: any;
  formatoFechaDesde: DateFormat;
  formatoFechaHasta: DateFormat;

  private usuario: Usuario;
  private config: any;
  formStateAction: number;
  editable: Boolean;
  editableSku: Boolean;
  editableUpdateDte: Boolean;
  private menu: MenuProfile[];
  resultUpdate: any;
  selectedAll: any;
  checkAll: any;
  listSend: Array<any>;
  selectedAllIngreso: any;
  listSendIngreso: Array<any>;
  selectedAllEomCreate: any;
  listSendEomCreate: Array<any>;
  selectedAllEomAct: any;
  listSendEomAct: Array<any>;
  selectedAllUpdateTmas: any;
  listSendUpdateTmas: Array<any>;
  selectedAllPpl: any;
  listSendPpl: Array<any>;
  selectedAllGc: any;
  listSendGc: Array<any>;
  selectedAllEmail: any;
  listSendEmail: Array<any>;
  url: String;
  public listTypeOrders: any;
  utils: Utils;

  @ViewChild('myModal')
  myModal;
  @ViewChild('myModalUpdateTransactionNumber')
  myModalUpdateTransactionNumber;

  constructor(public inconsistenciasOcService: InconsistenciasOcService, public conversorPipe: ConversorPipe,
    public searchInfo: SearchService, public messageService: MessageService, public dialogService: DialogService,
    public globals: Globals, private router: Router, public orderTypeService: OrderTypeService) {
      this.titulo = 'Listado de Errores';
      this.pgrows = GLOBAL.paginador_rows;
      this.pgCurrentSfcc = 1;
      this.pgCurrentSdv = 1;
      this.pgCurrentIoc = 1;
      this.pgCurrentEom = 1;
      this.pgCurrentEomCreate = 1;
      this.pgCurrentEomAct = 1;
      this.pgCurrentUpdateTmas = 1;
      this.pgCurrentPpl = 1;
      this.pgCurrentGc = 1;
      this.orderProperty = '+fileName';
      this.orderPropertySdv = '+orderNumber';
      this.config = this.globals.getValue();
      this.selectedAll = null;
      this.listSend = undefined;
      this.selectedAllEomCreate = null;
      this.listSendEomCreate = undefined;
      this.selectedAllEomAct = null;
      this.listSendEomAct = undefined;
      this.selectedAllUpdateTmas = null;
      this.listSendUpdateTmas = undefined;
      this.selectedAllPpl = null;
      this.listSendPpl = undefined;
      this.selectedAllGc = null;
      this.listSendGc = undefined;
      this.selectedAllEmail = null;
      this.listSendEmail = undefined;
      this.resultsDetail = [];
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
  }

  ngOnInit() {
    this.cleanSearch();
    this.messageService.cargando(true);
    // usuario
    this.usuario = this.config[1].val;
    // menu
    this.menu = this.config[2].val;
    // url
    this.url = this.router.url;
    // Modulos de acceso a ordenes

    console.log('Access : ' +  JSON.stringify(this.menu) + ' / ' + this.usuario.idUser + ' / ' + this.router.url );

    for (let i = 0; i < this.menu.length; i++) {
      for (let j = 0; j < this.menu[i].subItems.length; j++) {
        console.log('Access Menu: ' + this.menu[i].idAccess + ' / ' + this.menu[i].idModule + ' / ' +
            this.menu[i].name + ' / ' + this.menu[i].url);

        console.log('Access SubMenu: ' + this.menu[i].subItems[j].idAccess + ' / ' + this.menu[i].subItems[j].idModule +
            ' / ' + this.menu[i].subItems[j].name + ' / ' + ' / ' + this.menu[i].subItems[j].url);

        if (this.router.url === this.menu[i].subItems[j].url) {
          if (this.menu[i].subItems[j].idAccess > 1) {
            this.editable = true;
          } else {
            this.editable = false;
          }

          if (this.menu[i].subItems[j].idAccess > 2) {
            this.editableSku = true;
            this.editableUpdateDte = true;
          } else {
            this.editableSku = false;
            this.editableUpdateDte = false;
          }
        }
      }
    }
    console.log('Editable: ' + this.editable + ' / ' + this.editableSku + ' / ' + this.editableUpdateDte);

    this.orderTypeService.getOrderType().subscribe(
      result => {
        this.listTypeOrders = this.utils.validarRespuestaFormatear(result);
          // this.listTypeOrders = result.message.replace(/\n/ig, '');
          // this.listTypeOrders = JSON.parse(this.listTypeOrders);
          this.listTypeOrders = this.listTypeOrders.listTypeOrders;
          console.log(this.listTypeOrders);
      },
      error => {
        console.log(<any>error);
      }
    );

    const volverIc = sessionStorage.getItem('volverIc');
    if (volverIc === 'SI') {
      sessionStorage.removeItem('volverIc');
      this.legacyErrors();
    } else {
      console.log('No se ha ejecutado el boton volver');
    }

    // Obtener usuario logeado
    this.usuario = this.config[1].val;

    this.formatoFechaDesde = new DateFormat();
    this.formatoFechaHasta = new DateFormat();
    // Fecha Desde
    const d: Date = new Date();
    this.formatoFechaDesde.myDatePickerOptions.disableSince = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1};
    this.formatoFechaDesde.myDatePickerOptions.disableUntil = {year: d.getFullYear(), month: d.getMonth() - 12, day: d.getDate()};
    this.myDatePickerOptionsDesde = this.formatoFechaDesde.myDatePickerOptions;
    // Fecha Hasta
    this.formatoFechaHasta.myDatePickerOptions.disableSince = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1};
    this.formatoFechaHasta.myDatePickerOptions.disableUntil = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1};
    this.myDatePickerOptionsHasta = this.formatoFechaHasta.myDatePickerOptions;

    console.log('Cargando Estados');
    this.inconsistenciasOcService.getStateActions().subscribe(
      result => {
        this.states = this.utils.validarRespuestaFormatear(result);
        this.messageService.cargando(true);
        // this.states = result.message.replace(/\n/ig, '');
        // this.states = JSON.parse(this.states.toString());
        this.states = this.states.states;
        this.messageService.cargando(false);
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  clearForm() {}

  leadingZero(value) {
    if (value < 10) {
      return '0' + value.toString();
    }
    return value.toString();
  }

  cambiaFechaDesde(event: IMyDateModel) {
    // Fecha Hasta
    this.fechaCompraHasta = undefined;
    if (event.date.year) {
      const d: Date = new Date();
      const d2: Date = new Date();
      this.myDatePickerOptionsCopy = Object.assign({}, this.formatoFechaHasta.myDatePickerOptions);
      this.formatoFechaHasta.myDatePickerOptions.disableSince = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1};
      this.myDatePickerOptionsCopy.disableUntil = {year: event.date.year, month: event.date.month, day: event.date.day - 1};
      const months = new Date(event.date.year + ',' + event.date.month + ',' + event.date.day).getMonth() - d.getMonth();
      const days = event.date.day;
      const diasDif = new Date(event.date.year + ',' + event.date.month + ',' + event.date.day).getTime() - d.getTime();
      const dias = Math.round(diasDif / (1000 * 60 * 60 * 24));
      const meses = Math.round(dias / 31);
      const date = new Date();
      const primerDiaMesAnterior = new Date( event.date.year, event.date.month - 1, 1);
      const ultimoDiaMesAnterior = new Date(event.date.year, event.date.month - 1, 0);
      const ultimoYearsAnterior = new Date(event.date.year - 1, event.date.month , 0);

      if (+meses <= -3) {
        if (days === 1) {
          if (dias < -92) {
             this.myDatePickerOptionsCopy.disableSince = {year: event.date.year, month: event.date.month + 3, day: event.date.day + 1};
             this.myDatePickerOptionsCopy.disableUntil = {
               year: event.date.year, month: event.date.month - 1, day: ultimoDiaMesAnterior.getDate() };
          } else {
            this.myDatePickerOptionsCopy.disableUntil = {
              year: event.date.year, month: event.date.month - 1, day: ultimoDiaMesAnterior.getDate()};
          }
        } else {
          if (dias < -92) {
            this.myDatePickerOptionsCopy.disableSince = {year: event.date.year, month: event.date.month + 3, day: event.date.day + 1};
          } else {
            this.myDatePickerOptionsCopy.disableUntil = {year: event.date.year, month: event.date.month, day: event.date.day - 1};
          }
        }
      } else {
        if (days === 1) {
          if (ultimoDiaMesAnterior.getMonth() === 11) {
            this.myDatePickerOptionsCopy.disableUntil = {
              year: event.date.year - 1, month: ultimoDiaMesAnterior.getMonth() + 1, day: ultimoDiaMesAnterior.getDate() };
          } else {
            this.myDatePickerOptionsCopy.disableUntil = {
              year: event.date.year, month: event.date.month - 1, day: ultimoDiaMesAnterior.getDate()};
          }
        }
      }
      this.myDatePickerOptionsHasta = this.myDatePickerOptionsCopy;
    }
    this.fechaCompraDesde = event.date.year > 0 ? new Date(event.date.year + ',' + event.date.month + ',' + event.date.day) : undefined;
  }

  cambiaFechaHasta(event: IMyDateModel) {
    this.fechaCompraHasta = event.date.year > 0 ? new Date(event.date.year + ',' + event.date.month + ',' + event.date.day) : undefined;
  }

  doSearch(stateAction: string,  typeOrder: string, ordenCompraSearch: string) {
    this.messageService.cargando(true);
    console.log('>>' + stateAction + '>>' + typeOrder + '>>' + ordenCompraSearch);
    const jsonInitDate = this.fechaCompraDesde;
    const jsonEndDate = this.fechaCompraHasta;
    sessionStorage.removeItem('volver');

    console.log(jsonInitDate != null ? this.leadingZero(JSON.stringify(jsonInitDate.getDate())) + '/' +
      this.leadingZero(JSON.stringify(jsonInitDate.getMonth() + 1)) + '/' + this.leadingZero(JSON.stringify(jsonInitDate.getFullYear()))
      : this.conversorPipe.transformDate(this.dateNow));

    console.log(jsonEndDate != null ? this.leadingZero(JSON.stringify(jsonEndDate.getDate())) + '/' +
      this.leadingZero(JSON.stringify(jsonEndDate.getMonth() + 1)) + '/' + this.leadingZero(JSON.stringify(jsonEndDate.getFullYear()))
      : this.conversorPipe.transformDate(this.dateNow));

    if (this.fechaCompraDesde == null || this.fechaCompraHasta == null) {
      this.messageService.enviarMensaje('Error búsqueda', ['Debe seleccionar fecha desde/hasta'], 'info', this.dialogService);
      this.messageService.cargando(false);
      return;
    } else if ( ordenCompraSearch  !== undefined && ordenCompraSearch  !== null && ordenCompraSearch  !== '') {
        if (!this.validationOc(ordenCompraSearch)) {
          this.messageService.enviarMensaje('Error Editar',
            ['Orden de Compra no válida. Puede ingresar mas de uno separados por comas sin espacios'], 'info', this.dialogService);
            this.messageService.cargando(false);
          return;
      }
    }
    this.cleanSearch();

      this.inconsistenciasOcService
      .getListLegacyErrors(
        (stateAction !== undefined ? stateAction : '0'),
        jsonInitDate != null
          ? this.leadingZero(JSON.stringify(jsonInitDate.getDate())) +
              '/' +
              this.leadingZero(JSON.stringify(jsonInitDate.getMonth() + 1)) +
              '/' +
              this.leadingZero(JSON.stringify(jsonInitDate.getFullYear()))
          : this.conversorPipe.transformDate(this.dateNow),
        jsonEndDate != null
          ? this.leadingZero(JSON.stringify(jsonEndDate.getDate())) +
              '/' +
              this.leadingZero(JSON.stringify(jsonEndDate.getMonth() + 1)) +
              '/' +
              this.leadingZero(JSON.stringify(jsonEndDate.getFullYear()))
          : this.conversorPipe.transformDate(this.dateNow),
        -1,
        1,
        (ordenCompraSearch  !== undefined && ordenCompraSearch  !== null && ordenCompraSearch  !== '' ? ordenCompraSearch : '-1'),
         (typeOrder !== undefined ? typeOrder : '0')

      )
      .subscribe(
        result => {
            this.bugList = this.utils.validarRespuestaFormatear(result);
            // this.bugList = result.message.replace(/\n/ig, '');
            // this.bugList = JSON.parse(this.bugList);
            this.bugList = this.bugList.bugList;

            // Ingreso_OC	            1	  Insertar en BD
            // Emision_DTE	          2	  Solicitud Emisión DTE
            // Consulta_DTE	          3	  Consulta estado DTE
            // Creacion_TRX_SDV	      4	  Creación Trx Venta
            // Update_Giftcard	      5	  Actualiza Trx Venta
            // Email_DTE	            6	  Email Boleta
            // Email_Confirmacion	    7	  Email Programado Confirmacion sin boleta
            // Email_Confirmacion_DTE	8	  Email Programado Confirmacion con boleta
            // Email_Despacho	        9	  Email Despacho
            // Fin_Flujo	            10	Notificar flujo final
            // SFCC	                  11	Recibir XML con ordenes
            // Creacion_OD	          12	Creacion OD EOM
            // Update_Tmas	          13	Actualiza trx Venta XCatch
            // Regla_Email	          14	Regla de Email
            // Actualizacion_OD	      15	Actualizacion OD

            for (let i = 0; i < this.bugList.length; i++) {
              // console.log('origin ' + result.bugList[i].order.origin);

              // Origen 1, Ingreso OC
              if (this.bugList[i].order.origin === 1) {
                console.log('Origen 1 Ingreso OC');
                this.listLegacyIOC.push(this.bugList[i]);
              }

              // Origen 4, SDV Creacion_TRX_SDV
              if (this.bugList[i].order.origin === 4) {
                console.log('Origen 4  SDV (Creacion_TRX_SDV)');
                this.listLegacySDV.push(this.bugList[i]);
              }

              // Origen 12 EOM Creacion_OD
              if (this.bugList[i].order.origin === 12) {
                console.log('Origen 12 EOM (Creacion_OD)');
                this.listLegacyEOMCreate.push(this.bugList[i]);
              }

              // Origen 15 EOM Actualizacion_OD
              if (this.bugList[i].order.origin === 15) {
                console.log('Origen 15 EOM (Actualizacion_OD)');
                this.listLegacyEOMAct.push(this.bugList[i]);
              }

              // Origen 2,3 Emision_DTE, Consulta_DTE
              if (
                this.bugList[i].order.origin === 2 ||
                this.bugList[i].order.origin === 3
              ) {
                console.log('Origen 2,3 PPL (Emision_DTE, Consulta_DTE)');
                this.listLegacyPPL.push(this.bugList[i]);
              }

              // Origen 5 GC, Update_Giftcard
              if (this.bugList[i].order.origin === 5) {
                console.log('Origen 5 Update_Giftcard');
                this.listLegacyGF.push(this.bugList[i]);
              }

              // Email_DTE, Email_Confirmacion, Email_Confirmacion_DTE, Email_Despacho, Regla_Email
              if (
                this.bugList[i].order.origin === 6 ||
                this.bugList[i].order.origin === 7 ||
                this.bugList[i].order.origin === 8 ||
                this.bugList[i].order.origin === 9 ||
                this.bugList[i].order.origin === 14
              ) {
                console.log('Origin Email');
                this.listLegacyEmail.push(this.bugList[i]);
              }

              // Origen 13 Update_Tmas
              if (this.bugList[i].order.origin === 13) {
                console.log('Origen 13 Update_Tmas');
                this.listLegacyUpdateTmas.push(this.bugList[i]);
              }
            }
            this.loadings = false;
            this.messageService.cargando(this.loadings);
        },
        error => {
          console.log(<any>error);
          this.loadings = false;
          this.messageService.cargando(this.loadings);
        }
      );

    this.inconsistenciasOcService
      .getListLegacyErrorsSFCC(
         (stateAction !== undefined ? stateAction : '0'),
        jsonInitDate != null
          ? this.leadingZero(JSON.stringify(jsonInitDate.getDate())) +
              '/' +
              this.leadingZero(JSON.stringify(jsonInitDate.getMonth() + 1)) +
              '/' +
              this.leadingZero(JSON.stringify(jsonInitDate.getFullYear()))
          : this.conversorPipe.transformDate(this.dateNow),
        jsonEndDate != null
          ? this.leadingZero(JSON.stringify(jsonEndDate.getDate())) +
              '/' +
              this.leadingZero(JSON.stringify(jsonEndDate.getMonth() + 1)) +
              '/' +
              this.leadingZero(JSON.stringify(jsonEndDate.getFullYear()))
          : this.conversorPipe.transformDate(this.dateNow),
        -1,
        1,
         (ordenCompraSearch  !== undefined && ordenCompraSearch  !== null && ordenCompraSearch  !== '' ? ordenCompraSearch : '-1'),
         (typeOrder !== undefined ? typeOrder : '0')
      )
      .subscribe(
        result => {
          this.files = this.utils.validarRespuestaFormatear(result);
          // this.files = result.message.replace(/\n/ig, '');
          // this.files = JSON.parse(this.files.toString());
          this.files = this.files.files;
          this.listOrdes = this.files.orders;
        },
        error => {
          console.log(<any>error);
          this.loadings = false;
          this.messageService.cargando(this.loadings);
        }
      );
    /*Almacenamos con SessionStorage es el que vive sólo en una sesión para guardar los filtros
    del formulario y luego recuperar los valores*/
    if ( stateAction === undefined ) {
        sessionStorage.setItem('formStateAction', '0');
    } else {
        sessionStorage.setItem('formStateAction', stateAction);
    }

    if (ordenCompraSearch  === undefined || ordenCompraSearch  === null || ordenCompraSearch  === '') {
      sessionStorage.setItem('formOrdenCompraSearch', '-1');
    } else {
     sessionStorage.setItem('formOrdenCompraSearch', ordenCompraSearch);
    }
    if ( typeOrder === undefined ) {
      sessionStorage.setItem('formTypeOrder', '0');
    } else {
      sessionStorage.setItem('formTypeOrder', typeOrder);
    }
    if (jsonInitDate === null) {
      sessionStorage.removeItem('formJsonInitDate');
    } else {
      sessionStorage.setItem( 'formJsonInitDate', '' + this.leadingZero(JSON.stringify(jsonInitDate.getDate())) +
        '/' + this.leadingZero(JSON.stringify(jsonInitDate.getMonth() + 1)) + '/' +
          this.leadingZero(JSON.stringify(jsonInitDate.getFullYear())));
    }
    if (jsonEndDate === null) {
      sessionStorage.removeItem('formJsonEndDate');
    } else {
      sessionStorage.setItem('formJsonEndDate', '' + this.leadingZero(JSON.stringify(jsonEndDate.getDate())) + '/' +
      this.leadingZero(JSON.stringify(jsonEndDate.getMonth() + 1)) + '/' + this.leadingZero(JSON.stringify(jsonEndDate.getFullYear())));
    }
  }

  doSearchDetail(oc: string) {
    this.searchInfo.orderNumber = oc;
    // search detail order
    this.searchInfo.searchDetail(oc);
    // open Modal
    this.myModal.open();
  }

  // reinject
  callReinjectOrderService(oc: String, origin: number, errorId: number) {
    let ori: String;
    console.log('Loading.... callReinjectOrderService');
    console.log('oc' + oc);
    console.log('origin' + origin);
    console.log('errorId' + errorId);

    if (origin === 2) {
      // bm
      ori = 'Emision_DTE';
    } else if (origin === 3) {
      ori = 'Consulta_DTE';
    } else if (origin === 4) {
      ori = 'Creacion_TRX_SDV';
    } else if (origin === 5) {
      ori = 'Update_Giftcard';
    } else if (origin === 6) {
      ori = 'Email_DTE';
    } else if (origin === 7) {
      ori = 'Regla_Email';
    } else if (origin === 8) {
      ori = 'Regla_Email';
    } else if (origin === 9) {
      ori = 'Email_Despacho';
    } else if (origin === 12) {
      ori = 'Creacion_OD';
    } else if (origin === 13) {
      ori = 'Update_Tmas';
    } else if (origin === 14) {
      ori = 'Regla_Email';
    } else if (origin === 15) {
      ori = 'Actualizacion_OD';
    }

    // si la respuesta es exitosa deshabilito la orden
    this.loadings = true;
    this.messageService.cargando(this.loadings);
    this.inconsistenciasOcService.updateError(+oc, origin, 1, 1).subscribe(
      (res: any) => (this.ret = res),
      error => () => {
        console.log('error del servicio de update de error');
        this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea realizado con errores'], 'info', this.dialogService);
        this.loadings = false;
        this.messageService.cargando(this.loadings);
      },
      () => {
        console.log('se inhabilita el error');
        // this.utils.validarRespuesta(this.ret);
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        // se inserta el log
        this.inconsistenciasOcService.insertLog(3, +oc, this.usuario.idUser).subscribe(
            (res: any) => (this.ret = res),
            error => () => {
              console.log('insertamos log correctamente');
            },
            () => {
              console.log('error al insertar log');
            }
          );
        this.cleanSearch();
        this.loadings = true;
        this.messageService.cargando(this.loadings);
        this.legacyErrors();
        this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea realizado con éxito'], 'info', this.dialogService);
        setTimeout(() => {
          // informacion de las acciones
          this.inconsistenciasOcService.getActions(origin, errorId).subscribe(
            (res: any) => (this.ret2 = res),
            error => () => {
              console.log('error del servicio de las acciones');
              console.log(error);
            },
            () => {
              this.ret2 = this.utils.validarRespuestaFormatear(this.ret2);
              // this.ret2 = this.ret2.message.replace(/\n/ig, '');
              // this.ret2 = JSON.parse(this.ret2.toString());
                if (this.ret2 !== null) {
                  let reinjectType: String;
                  if (this.ret2.actions.action[0].id === 1 || this.ret2.actions.action[0].id === 2) {
                    if (this.ret2.actions.action[0].id === 1) {
                      reinjectType = 'CONTINUE';
                    } else if (this.ret2.actions.action[0].id === 2) {
                      // bm
                      reinjectType = 'NEXT';
                    }
                    // informacion de la orden
                    this.searchInfo.searchOrderData(oc).subscribe(
                      // bm
                      (res: any) => (this.ret = res),
                      error => () => {
                        console.log('error del servicio que trae informacion de la orden');
                        console.log(error);
                      },
                      () => {
                        console.log('servicio que trae informacion de la orden');

                        console.log(this.ret);
                        if (this.ret != null) {
                          console.log('no es nulo ');
                          if (this.ret.trxHdr.version !== null &&  this.ret.trxIdentify !== null) {
                            const trxHdr: TrxHdr = new TrxHdr();
                            const context: Context = new Context();
                            const trxIdentify: TrxIdentify = new TrxIdentify();
                            const trxInject: TrxInject = new TrxInject();
                            trxHdr.version = this.ret.trxHdr.version;
                            context.idChannel = this.ret.trxHdr.context.idChannel;
                            context.idCompany = this.ret.trxHdr.context.idCompany;
                            context.idCountry = this.ret.trxHdr.context.idCountry;
                            context.idStore = this.ret.trxHdr.context.idStore;
                            trxHdr.context = context;
                            trxHdr.trxClientExecDate = this.ret.trxHdr.trxClientExecDate;
                            trxIdentify.idEvent = this.ret.trxIdentify.idEvent;
                            trxIdentify.idOrder = this.ret.trxIdentify.idOrder;
                            trxIdentify.orderType = this.ret.trxIdentify.orderType;
                            trxInject.type = reinjectType;
                            trxInject.origin = ori;
                            console.log('trxHdr');
                            console.log(trxHdr);
                            console.log('trxIdentify');
                            console.log(trxIdentify);
                            console.log('trxInject ');
                            console.log(trxInject);

                            // servicio de reinyeccion
                            this.inconsistenciasOcService.reinjectOrder2(trxHdr, trxIdentify, trxInject).subscribe(
                                (res: any) => (this.ret = res),
                                error => () => {
                                  console.log('error del servicio de reinyeccion');
                                  console.log(error);
                                },
                                () => {
                                  console.log('respuesta reinject ');
                                  console.log(this.ret.message);
                                }
                              );
                          } else {
                            console.log('no existe la orden en MTD');
                          }
                        }
                      }
                    );
                  }
                }
            }
          );
        }, 5000);
      }
    );
  }

  sortProperty(column) {
    console.log('=' + column);
    this.currentColumn = this.orderProperty.slice(1);
    this.currentDirection = this.orderProperty.slice(0, 1);
    this.dir = '+';

    if (column === this.currentColumn) {
      this.dir = this.currentDirection === '+' ? '-' : '+';
    }
    this.orderProperty = this.dir + column;
  }

  sortPropertySdv(column) {
    console.log('=' + column);
    this.currentColumn = this.orderPropertySdv.slice(1);
    this.currentDirection = this.orderPropertySdv.slice(0, 1);
    this.dir = '+';

    if (column === this.currentColumn) {
      this.dir = this.currentDirection === '+' ? '-' : '+';
    }
    this.orderPropertySdv = this.dir + column;
  }

  sortPropertyDate(column) {
    // Si ya fue ordenado por date queda con el *
    if (this.orderProperty.slice(0, 1) === '*') {
      this.orderProperty = this.orderProperty.slice(1);
    }

    this.currentColumn = this.orderProperty.slice(1);
    this.currentDirection = this.orderProperty.slice(0, 1);
    this.dir = '+';

    if (column === this.currentColumn) {
      this.dir = this.currentDirection === '+' ? '-' : '+';
    }
    this.orderProperty = '*' + this.dir + column;
  }

  cleanSearch() {
    this.loading = false;
    this.bugList = [];
    this.listLegacyPPL = [];
    this.listLegacyEOMCreate = [];
    this.listLegacyEOMAct = [];
    this.listLegacyGF = [];
    this.listLegacySDV = [];
    this.listLegacyIOC = [];
    this.listLegacySFFC = [];
    this.listLegacyEmail = [];
    this.listLegacyUpdateTmas = [];
    this.files = [];
    // this.model.stateAction = null;
    this.results = [];
    this.resultsDetail = [];

    this.listSend = undefined;
    this.loadingCheck = false;
    this.selectedAll = null;

    this.listSendEomCreate = undefined;
    this.loadingCheckEomCreate = false;
    this.selectedAllEomCreate = null;

    this.listSendEomAct = undefined;
    this.loadingCheckEomAct = false;
    this.selectedAllEomAct = null;

    this.listSendUpdateTmas = undefined;
    this.loadingCheckUpdateTmas = false;
    this.selectedAllUpdateTmas = null;

    this.listSendPpl = undefined;
    this.loadingCheckPpl = false;
    this.selectedAllPpl = null;

    this.listSendGc = undefined;
    this.loadingCheckGc = false;
    this.selectedAllGc = null;

    this.listSendEmail = undefined;
    this.loadingCheckEmail = false;
    this.selectedAllEmail = null;
    sessionStorage.removeItem('volverSearch');
    sessionStorage.removeItem('volverEmail');
    // localStorage.removeItem('listSendEomCreateInject');
  }

  // reinject update DTE
  callDteContinueService(oc: String) {
    this.loading = true;
    console.log('Loading.... callDteContinueService');
    let reinjectType: String;
    let ori: String;
    let origin: number;

    // reinjectType = 'CONTINUE';
    reinjectType = 'NEXT';
    ori = 'Emision_DTE';
    origin = 2;

    // informacion de la orden
    this.searchInfo.searchOrderData(oc).subscribe(
      (res: any) => (this.ret = res),
      error => () => {
        console.log('error del servicio que trae informacion de la orden');
        console.log(error);
      },
      () => {
        this.utils.validarRespuestaFormatear(this.ret);
        console.log('servicio que trae informacion de la orden');
        console.log(this.ret);

        if (this.ret.message != null) {
          console.log('no es nulo ');
          if (this.ret.message.trxHdr.version !== null && this.ret.message.trxIdentify !== null) {
            const trxHdr: TrxHdr = new TrxHdr();
            const context: Context = new Context();
            const trxIdentify: TrxIdentify = new TrxIdentify();
            const trxInject: TrxInject = new TrxInject();
            trxHdr.version = this.ret.message.trxHdr.version;
            context.idChannel = this.ret.message.trxHdr.context.idChannel;
            context.idCompany = this.ret.message.trxHdr.context.idCompany;
            context.idCountry = this.ret.message.trxHdr.context.idCountry;
            context.idStore = this.ret.message.trxHdr.context.idStore;
            trxHdr.context = context;
            trxHdr.trxClientExecDate = this.ret.message.trxHdr.trxClientExecDate;
            trxIdentify.idEvent = this.ret.message.trxIdentify.idEvent;
            trxIdentify.idOrder = this.ret.message.trxIdentify.idOrder;
            trxIdentify.orderType = this.ret.message.trxIdentify.orderType;
            trxInject.type = reinjectType;
            trxInject.origin = ori;

            console.log('trxHdr');
            console.log(trxHdr);
            console.log('trxIdentify');
            console.log(trxIdentify);

            console.log('trxInject ');
            console.log(trxInject);

            // servicio de reinyeccion
            this.inconsistenciasOcService.reinjectOrder2(trxHdr, trxIdentify, trxInject).subscribe(
                (res: any) => (this.ret = res),
                error => () => {
                  console.log('error del servicio de reinyeccion');
                  this.cleanSearch();
                  console.log(error);
                  this.messageService.enviarMensaje('Error Acción', ['Error al procesar orden errónea'], 'info', this.dialogService);
                },
                () => {
                  if (this.ret.code === 0 && this.ret.code !== undefined) {
                  console.log('respuesta reinject ');
                  console.log(this.ret);

                  // si la respuesta es exitosa
                  // deshabilito la orden
                  this.inconsistenciasOcService.updateError(+oc, origin, 1, 1).subscribe(
                      (res: any) => (this.ret = res),
                      error => () => {
                      console.log('error del servicio de update de error');
                      this.cleanSearch();
                      this.messageService.enviarMensaje('Error Acción', ['Error al procesar orden errónea'], 'info', this.dialogService);
                      },
                      () => {
                        console.log('se inhabilita el error');
                        // this.utils.validarRespuesta(this.ret);
                        this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea realizado con éxito'],
                        'info', this.dialogService);
                        this.cleanSearch();
                      }
                    );
                  }
                }
              );
          } else {
            console.log('no existe la orden en MTD');
            this.cleanSearch();
            this.messageService.enviarMensaje('Error Acción', ['Error, no existe la orden en MTD'], 'info', this.dialogService);
          }
        }
      }
    );
  }

  updateTransactionNumber(oc: String) {
    this.model.inputDteNumber = '';
    this.searchInfo.orderNumber = oc;
    this.loadings = true;
    this.messageService.cargando(this.loadings);
    this.searchInfo.searchDetail('' + oc).subscribe(
      res => {
        this.resultsDetail = this.utils.validarRespuestaFormatear(res);
        // console.log(res);
        // this.resultsDetail = res.message.replace(/\n/ig, '');
        // this.resultsDetail = JSON.parse(this.resultsDetail);
        console.log(this.resultsDetail);
        this.loadings = false;
        this.messageService.cargando(this.loadings);
      },
      err => {
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        console.log(err);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
      }
    );
    // open Modal
    this.myModalUpdateTransactionNumber.open();
  }

  doEditTransactionNumber() {
    console.log('doEditTransactionNumber');
    console.log('inputDteNumber ' + this.model.inputDteNumber);
    console.log('orderNumber ' + this.searchInfo.orderNumber);
    /*
    this.messageService.cargando(true);
    this.inconsistenciasOcService.updateError(+ this.searchInfo.orderNumber, 3, 1, 1).subscribe(
      (res: any) => (this.ret = res),
      error => () => {
        console.log('error del servicio de update de error');
        console.log(error);
        this.messageService.cargando(false);
        this.cleanSearch();
        this.messageService.enviarMensaje('Error Acción', ['Error al procesar orden errónea'], 'info', this.dialogService);
      },
      () => {
          console.log('se inhabilita el error');
          this.messageService.cargando(false);
          this.utils.validarRespuesta(this.ret);
          this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea realizado con éxito'], 'info', this.dialogService);
          this.cleanSearch();
      }
    );
    */

    this.usuario = this.config[1].val;
    console.log('orden : ' + this.searchInfo.orderNumber + ' oldDte : ' + '' +
    ' newDte : ' + this.model.inputDteNumber + ' this.usuario.idUser : ' + this.usuario.idUser );

    if (this.model.inputDteNumber === undefined || this.model.inputDteNumber === '') {
      this.messageService.enviarMensaje('Error actualizar DTE', ['Error servicio actualizar dte vacío'], 'info', this.dialogService);
      return false;
    }

    this.loadings = true;
    this.messageService.cargando(this.loadings);
    this.searchInfo.editarTransactionNumber('' + this.searchInfo.orderNumber,
    this.model.inputDteNumber, '', this.usuario.idUser + '').subscribe(
        (res: any) => (this.ret = res),
        error => () => {
          console.log(error);
          this.loadings = false;
          this.messageService.cargando(this.loadings);
          this.messageService.enviarMensaje('Actualizar Dte', ['Error al Actualizar Dte'], 'info', this.dialogService);
        },
        () => {
          this.resultUpdate = this.utils.validarRespuestaFormatear(this.ret);
          // this.resultUpdate = this.ret.message.replace(/\n/ig, '');
          // this.resultUpdate = JSON.parse(this.resultUpdate);
          console.log(this.resultUpdate);
          if (this.resultUpdate.length === 0) {
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            this.messageService.enviarMensaje('Error actualizar Dte', ['Error Actualizar Campo Dte'], 'info', this.dialogService);
          } else {
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            this.callDteContinueServiceDte(this.searchInfo.orderNumber);
          }
        }
      );
  }

  // reinject update DTE
  callDteContinueServiceDte(oc: String) {
    console.log('Loading.... callDteContinueServiceDte');
    let ori: String;
    let reinjectType: String;
    let origin: number;

    // reinjectType = 'CONTINUE';
    reinjectType = 'NEXT';
    ori = 'Emision_DTE';
    origin = 2;
    console.log('oc' + oc);
    console.log('origin' + origin);

    // si la respuesta es exitosa deshabilito la orden
    this.loadings = true;
    this.messageService.cargando(this.loadings);
    this.inconsistenciasOcService.updateError(+oc, origin, 1, 1).subscribe(
      (res: any) => (this.ret = res),
      error => () => {
        console.log('error del servicio de update de error');
        this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea realizado con errores'], 'info', this.dialogService);
        this.loadings = false;
        this.messageService.cargando(this.loadings);
      },
      () => {
        console.log('se inhabilita el error');
        // this.utils.validarRespuesta(this.ret);
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        this.myModalUpdateTransactionNumber.close();

        // se inserta el log
        this.inconsistenciasOcService.insertLog(5, +oc, this.usuario.idUser).subscribe(
            (res: any) => (this.ret = res),
            error => () => {
              console.log('error al insertar log');
              console.log(error);
            },
            () => {
              console.log('insertar log correctament');
              // this.utils.validarRespuesta(this.ret);
            }
          );
        this.cleanSearch();
        this.loadings = true;
        this.messageService.cargando(this.loadings);
        this.legacyErrors();
        this.messageService.enviarMensaje('Actualizar Dte', ['Actualizacion del Numero  DTE  realizado con exito'],
         'info', this.dialogService);

        setTimeout(() => {
          // reinjectType = 'CONTINUE';
          reinjectType = 'NEXT';
          ori = 'Emision_DTE';
          origin = 2;

          // informacion de la orden
          this.searchInfo.searchOrderData(oc).subscribe(
            // bm
            (res: any) => (this.ret = res),
            error => () => {
              console.log('error del servicio que trae informacion de la orden');
              console.log(error);
            },
            () => {
                console.log(this.ret);
                if (this.ret != null) {
                  console.log('no es nulo ');
                  if (this.ret.trxHdr.version !== null && this.ret.trxIdentify !== null) {
                    const trxHdr: TrxHdr = new TrxHdr();
                    const context: Context = new Context();
                    const trxIdentify: TrxIdentify = new TrxIdentify();
                    const trxInject: TrxInject = new TrxInject();
                    trxHdr.version = this.ret.trxHdr.version;
                    context.idChannel = this.ret.trxHdr.context.idChannel;
                    context.idCompany = this.ret.trxHdr.context.idCompany;
                    context.idCountry = this.ret.trxHdr.context.idCountry;
                    context.idStore = this.ret.trxHdr.context.idStore;
                    trxHdr.context = context;
                    trxHdr.trxClientExecDate = this.ret.trxHdr.trxClientExecDate;
                    trxIdentify.idEvent = this.ret.trxIdentify.idEvent;
                    trxIdentify.idOrder = this.ret.trxIdentify.idOrder;
                    trxIdentify.orderType = this.ret.trxIdentify.orderType;
                    trxInject.type = reinjectType;
                    trxInject.origin = ori;

                    console.log('trxHdr');
                    console.log(trxHdr);
                    console.log('trxIdentify');
                    console.log(trxIdentify);

                    console.log('trxInject ');
                    console.log(trxInject);

                    // servicio de reinyeccion
                    this.inconsistenciasOcService.reinjectOrder2(trxHdr, trxIdentify, trxInject).subscribe(
                        (res: any) => (this.ret = res),
                        error => () => {
                          console.log('error del servicio de reinyeccion');
                          console.log(error);
                        },
                        () => {
                          console.log('respuesta reinject ');
                          console.log(this.ret);
                        }
                      );
                  } else {
                    console.log('no existe la orden en MTD');
                  }
                } else {
                  console.log('es nulo');
                }
            }
          );
        }, 5000);
      }
    );
  }

  executeData() {
    const volverIc = sessionStorage.getItem('volverIc');
    const formStateAction = sessionStorage.getItem('formStateAction');
    const formJsonInitDate = sessionStorage.getItem('formJsonInitDate');
    const formJsonEndDate = sessionStorage.getItem('formJsonEndDate');
    const formOrdenCompraSearch = sessionStorage.getItem('formOrdenCompraSearch');
    const formTypeOrder = sessionStorage.getItem('formTypeOrder');
    this.legacyErrors();
  }

  onlyNumberKey(event) {
    return event.charCode === 8 || event.charCode === 0 ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  callUpdateItems(orderNumber: String) {
    // this.loading = true;
    this.loadings = true;
    this.messageService.cargando(this.loadings);
    // informacion de las acciones
    this.inconsistenciasOcService.updateStatusItems(+orderNumber).subscribe(
      (res: any) => (this.ret = res),
      error => () => {
        console.log('error en el servicio sku servicio');
        console.log(error);
      },
      () => {
        console.log(this.ret);
        this.ret.message = this.utils.validarRespuestaFormatear(this.ret);
        // this.ret.message = this.ret.message.replace(/\n/ig, '');
        // this.ret.message = JSON.parse(this.ret.message);
        console.log(this.ret);
        console.log(this.ret.message.code);
        this.messageService.cargando(true);
        // console.log(this.ret);
        // this.ret = this.utils.validarRespuesta(this.ret);
        // this.ret.message = this.ret.message.replace(/\n/ig, '');
        // this.ret.message = JSON.parse(this.ret.message);
        // console.log(this.ret);
        // console.log(this.ret.message.code);
        // this.messageService.cargando(true);
        if (this.ret.message !== null) {
          // let reinjectType: String;
          if (this.ret.message.code === 200) {
            // si la respuesta es exitosa deshabilito la orden
            const originCreacioOD = 12;
            this.inconsistenciasOcService.updateError(+orderNumber, originCreacioOD, 1, 1).subscribe(
                (res: any) => (this.ret = res),
                error => () => {
                  console.log('error del servicio de update de error');
                  console.log(error);
                  this.cleanSearch();
                  this.loadings = false;
                  this.messageService.cargando(this.loadings);
                  this.messageService.enviarMensaje('Error Acción', ['Error al procesar orden errónea'], 'info', this.dialogService);
                },
                () => {
                  console.log('se inhabilita el error');
                  // this.ret = this.utils.validarRespuesta(this.ret);

                  this.inconsistenciasOcService.insertLog(7, +orderNumber, this.usuario.idUser).subscribe(
                      (res: any) => (this.ret = res),
                      error => () => {
                        console.log('insertamos log correctamente');
                        console.log(error);
                      },
                      () => {
                        console.log('error al insertar log');
                      }
                    );

                  this.cleanSearch();
                  this.messageService.cargando(true);
                  this.legacyErrors();
                  this.messageService.enviarMensaje('Error Acción', ['SKU servicio exitoso'], 'info', this.dialogService);


                  setTimeout(() => {
                    console.log('Loading.... callReinjectOrderService');
                    // informacion de la orden
                    this.searchInfo.searchOrderData(orderNumber).subscribe(
                      (res: any) => (this.ret = res),
                      error => () => {
                        console.log('error del servicio que trae informacion de la orden');
                        console.log(error);
                      },
                      () => {
                        console.log('servicio que trae informacion de la orden');
                        console.log('respuesta del servicio ');
                        console.log(this.ret);


                        if (this.ret != null) {
                          if (this.ret.trxHdr.version !== null &&  this.ret.trxIdentify !== null) {

                            const trxHdr: TrxHdr = new TrxHdr();
                            const context: Context = new Context();
                            const trxIdentify: TrxIdentify = new TrxIdentify();
                            const trxInject: TrxInject = new TrxInject();
                            trxHdr.version = this.ret.trxHdr.version;
                            context.idChannel = this.ret.trxHdr.context.idChannel;
                            context.idCompany = this.ret.trxHdr.context.idCompany;
                            context.idCountry = this.ret.trxHdr.context.idCountry;
                            context.idStore = this.ret.trxHdr.context.idStore;
                            trxHdr.context = context;
                            trxHdr.trxClientExecDate = this.ret.trxHdr.trxClientExecDate;
                            trxIdentify.idEvent = this.ret.trxIdentify.idEvent;
                            trxIdentify.idOrder = this.ret.trxIdentify.idOrder;
                            trxIdentify.orderType = this.ret.trxIdentify.orderType;
                            trxInject.type = 'NEXT';
                            trxInject.origin = 'Creacion_OD';

                            console.log('trxHdr');
                            console.log(trxHdr);
                            console.log('trxIdentify');
                            console.log(trxIdentify);

                            console.log('trxInject ');
                            console.log(trxInject);




                            // servicio de reinyeccion
                            this.inconsistenciasOcService.reinjectOrder2(trxHdr, trxIdentify, trxInject).subscribe(
                                (res: any) => (this.ret = res),
                                error => () => {
                                  console.log('error del servicio de reinyeccion');
                                  console.log(error);
                                },
                                () => {
                                  console.log('respuesta reinject ');
                                  console.log(this.ret);
                                }
                              );
                          } else {
                            console.log('no existe la orden en MTD');
                          }
                        }
                      }
                    );
                  }, 12000);
                }
              );
          } else {
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            this.messageService.enviarMensaje('Error Acción',
            ['Hay un error con el servicio que actualiza el estado de los itemes.'], 'info', this.dialogService);
          }
        }
      }
    );
  }

  getAllData() {
    this.cleanSearch();

    // usuario
    this.usuario = this.config[1].val;
    // menu
    this.menu = this.config[2].val;

    console.log('Access : ' + this.menu[0].idAccess + ' / ' + this.menu[0].idModule);
    if (this.menu[0].idAccess === 3) {
      this.editable = true;
    } else {
      this.editable = false;
    }
    console.log('Editable : ' + this.editable);

    const volverIc = sessionStorage.getItem('volverIc');
    console.log('volverIc ' + volverIc);

    const formStateAction = sessionStorage.getItem('formStateAction');
    console.log('formStateAction == ' + formStateAction);

    const formJsonInitDate = sessionStorage.getItem('formJsonInitDate');
    console.log('formJsonInitDate == ' + formJsonInitDate);

    const formJsonEndDate = sessionStorage.getItem('formJsonEndDate');
    console.log('formJsonEndDate == ' + formJsonEndDate);
    console.log('Se ejecuta boton volver');
    sessionStorage.removeItem('volverIc');
    this.legacyErrors();
  }

  checkAllSelectedClean(list: Array<any>) {
    console.log('checkAllSelectedClean');
    this.selectedAll = !this.selectedAll;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin =' + list[i].order.origin);
      console.log('i=' + i);
      list[i].selected = null;
      console.log('list[i].selected=' + list[i].selected);
      this.listSend = [];
    }
  }

  selectAllIngreso(list: Array<any>) {
    console.log('selectAllIngreso');
    this.selectedAllIngreso = !this.selectedAllIngreso;
    for (let i = 0; i < list.length; i++) {
      list[i].selectedIngreso = this.selectedAllIngreso;
      this.listSendIngreso = list;
    }
  }

  selectAll(list: Array<any>) {
    console.log('selectAllSdv');
    this.selectedAll = !this.selectedAll;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin = ' + list[i].order.origin);
      list[i].selected = this.selectedAll;
      this.listSend = list;
    }
    // this.listSend = undefined;
    // this.loadingCheck = false;
  }

  selectAllEomCreate(list: Array<any>) {
    console.log('selectAllEomCreate');
    this.selectedAllEomCreate = !this.selectedAllEomCreate;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin = ' + list[i].order.origin);
      list[i].selectedEomCreate = this.selectedAllEomCreate;
      this.listSendEomCreate = list;
    }
    // this.listSendEomCreate = undefined;
    // this.loadingCheckEomCreate = false;
  }

  selectAllEomAct(list: Array<any>) {
    console.log('selectAllEom');
    this.selectedAllEomAct = !this.selectedAllEomAct;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin = ' + list[i].order.origin);
      list[i].selectedEomAct = this.selectedAllEomAct;
      this.listSendEomAct = list;
    }
    // this.listSendEomAct = undefined;
    // this.loadingCheckEomAct = false;
  }

  selectAllUpdateTmas(list: Array<any>) {
    console.log('selectAllUpdateTmas');
    this.selectedAllUpdateTmas = !this.selectedAllUpdateTmas;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin = ' + list[i].order.origin);
      list[i].selectedUpdateTmas = this.selectedAllUpdateTmas;
      this.listSendUpdateTmas = list;
    }
    // this.listSendEomAct = undefined;
    // this.loadingCheckEomAct = false;
  }

  selectAllPpl(list: Array<any>) {
    console.log('selectAllPpl');
    this.selectedAllPpl = !this.selectedAllPpl;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin = ' + list[i].order.origin);
      list[i].selectedPpl = this.selectedAllPpl;
      this.listSendPpl = list;
    }
    // this.listSendEom = undefined;
    // this.loadingCheckEom = false;
  }

  selectAllGc(list: Array<any>) {
    console.log('selectAllGc');
    this.selectedAllGc = !this.selectedAllGc;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin = ' + list[i].order.origin);
      list[i].selectedGc = this.selectedAllGc;
      this.listSendGc = list;
    }
    // this.listSendGc = undefined;
    // this.loadingCheckGc = false;
  }

  selectAllEmail(list: Array<any>) {
    console.log('selectAllEmail');
    this.selectedAllEmail = !this.selectedAllEmail;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin =' + list[i].order.origin);
      list[i].selectedEmail = this.selectedAllEmail;
      this.listSendEmail = list;
    }
    // this.listSendEmail = undefined;
    // this.loadingCheckEmail = false;
  }

  checkIfAllSelectedIngreso(list: Array<any>) {
    console.log('checkIfAllSelectedIngreso');
    let totalSelected = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].selectedIngreso) {
        totalSelected++;
      }
      this.listSendIngreso = list;
    }
    this.selectedAllIngreso = totalSelected === list.length;
    return true;
  }

  checkIfAllSelected(list: Array<any>) {
    console.log('checkIfAllSelected=');
    let totalSelected = 0;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin=' + list[i].order.origin);
      console.log('list[i].selectedSdv=' + list[i].selected);
      if (list[i].selected) {
        totalSelected++;
      }
      this.listSend = list;
    }
    this.selectedAll = totalSelected === list.length;
    return true;
  }

  checkIfAllSelectedEomCreate(list: Array<any>) {
    console.log('checkIfAllSelectedEomCreate');
    let totalSelected = 0;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin=' + list[i].order.origin);
      console.log('list[i].selectedEomCreate=' + list[i].selectedEomCreate);
      if (list[i].selectedEomCreate) {
        totalSelected++;
      }
      this.listSendEomCreate = list;
    }
    this.selectedAllEomCreate = totalSelected === list.length;
    return true;
  }

  checkIfAllSelectedEomAct(list: Array<any>) {
    console.log('checkIfAllSelectedEomAct');
    let totalSelected = 0;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin=' + list[i].order.origin);
      console.log('list[i].selectedEom=' + list[i].selectedEomAct);
      if (list[i].selectedEomAct) {
        totalSelected++;
      }
      this.listSendEomAct = list;
    }
    this.selectedAllEomAct = totalSelected === list.length;
    return true;
  }

  checkIfAllSelectedUpdateTmas(list: Array<any>) {
    console.log('checkIfAllSelectedUpdateTmas');
    let totalSelected = 0;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin=' + list[i].order.origin);
      console.log('list[i].selectedUpdateTmas=' + list[i].selectedUpdateTmas);
      if (list[i].selectedUpdateTmas) {
        totalSelected++;
      }
      this.listSendUpdateTmas = list;
    }
    this.selectedAllUpdateTmas = totalSelected === list.length;
    return true;
  }

  checkIfAllSelectedPpl(list: Array<any>) {
    console.log('checkIfAllSelectedPpl');
    let totalSelected = 0;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin=' + list[i].order.origin);
      console.log('list[i].selectedPpl=' + list[i].selectedPpl);
      if (list[i].selectedPpl) {
        totalSelected++;
      }
      this.listSendPpl = list;
    }
    this.selectedAllPpl = totalSelected === list.length;
    return true;
  }

  checkIfAllSelectedGc(list: Array<any>) {
    console.log('checkIfAllSelectedGc');
    let totalSelected = 0;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin=' + list[i].order.origin);
      console.log('list[i].selectedGc=' + list[i].selectedGc);
      if (list[i].selectedGc) {
        totalSelected++;
      }
      this.listSendGc = list;
    }
    this.selectedAllGc = totalSelected === list.length;
    return true;
  }

  checkIfAllSelectedEmail(list: Array<any>) {
    console.log('checkIfAllSelectedEmail');
    let totalSelected = 0;
    for (let i = 0; i < list.length; i++) {
      console.log('Origin=' + list[i].order.origin);
      console.log('list[i].selectedEmail=' + list[i].selectedEmail);
      if (list[i].selectedEmail) {
        totalSelected++;
      }
      this.listSendEmail = list;
    }
    this.selectedAllEmail = totalSelected === list.length;
    return true;
  }

  pushServiceMassiveOrdersIngreso() {
    let oc: String;
    let origin: number;
    let errorId: number;

    this.loadings = true;
    this.messageService.cargando(this.loadings);

    if (this.listSendIngreso === undefined) {
      this.loadings = false;
      this.messageService.cargando(this.loadings);
      this.messageService.enviarMensaje('Alerta', ['Debes seleccionar al menos un check'], 'info', this.dialogService);
    } else {
      console.log('Continuar');
      console.log('imprimiendo valores ' + JSON.stringify(this.listSendIngreso));

      localStorage.setItem('listSendIngresoInject', JSON.stringify(this.listSendIngreso));
      let totalSelected = 0;
      for (let i = 0; i < this.listSendIngreso.length; i++) {
        if (this.listSendIngreso[i].selectedIngreso) {
          totalSelected++;
        }
      }
      if (totalSelected > 0) {
        for (let i = 0; i < this.listSendIngreso.length; i++) {
          if (this.listSendIngreso[i].selectedIngreso) {
            oc = this.listSendIngreso[i].order.orderNumber;
            origin = this.listSendIngreso[i].order.origin;
            errorId = this.listSendIngreso[i].order.errorId;

            this.inconsistenciasOcService.updateError(+oc, origin, 1, 1).subscribe(
                (res: any) => (this.ret = res),
                error => () => {
                  console.log(error);
                  console.log('error del servicio de update de error');
                },
                () => {
                  console.log(this.ret);
                  console.log('se inhabilita el error');
                  //  this.ret = this.utils.validarRespuesta(this.ret);
                }
              );
          }
        }

        setTimeout(() => {
          const listSendIngresoInject = JSON.parse(localStorage.getItem('listSendIngresoInject'));
          console.log('listSendIngresoInject: ', listSendIngresoInject);
          console.log('length: ', listSendIngresoInject.length);
          for (let i = 0; i < listSendIngresoInject.length; i++) {
            console.log('i: ' + listSendIngresoInject[i]);
            if (listSendIngresoInject[i].selectedIngreso) {
              console.log('OK: ');
              const ocInject = listSendIngresoInject[i].order.orderNumber;
              const originInject = listSendIngresoInject[i].order.origin;
              const errorIdInject = listSendIngresoInject[i].order.errorId;
              console.log('ocInject: ' + ocInject);
              console.log('originInject: ' + originInject);
              console.log('erroridInject: ' + errorIdInject);
              this.callReinjectOrderServiceMasivo('' + ocInject, originInject, errorIdInject);
            }
          }
        }, 20000);

        this.cleanSearch();

        setTimeout(() => {
          this.loadings = false;
          this.messageService.cargando(this.loadings);

          this.inconsistenciasOcService.insertLog(3, +oc, this.usuario.idUser).subscribe(
              (res: any) => (this.ret = res),
              error => () => {
                console.log(error);
                console.log('error al insertar log');
              },
              () => {
                console.log('insertamos log correctamente');
                // this.utils.validarRespuesta(this.ret);
              }
            );

          console.log('recargar : ' + (this.model.stateAction > 0 ? this.model.stateAction : 0) +
          '' + this.fechaCompraDesde + '' + this.fechaCompraHasta);

          this.loadings = true;
          this.messageService.cargando(this.loadings);
          this.legacyErrors();

          this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea masivo realizado con éxito'],
          'info', this.dialogService);
        }, 15000);
      } else {
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        this.messageService.enviarMensaje('Informacion', ['Debes selecionar al menos un check'], 'info',
          this.dialogService
        );
      }
      this.selectedAllIngreso = null;
      this.listSendIngreso = undefined;
    }
  }

  pushServiceMassiveOrders() {
    let oc: String;
    let origin: number;
    let errorId: number;
    this.loadings = true;
    this.messageService.cargando(this.loadings);

    if (this.listSend === undefined) {
      this.loadings = false;
      this.messageService.cargando(this.loadings);
      this.messageService.enviarMensaje('Alerta', ['Debes seleccionar al menos un check'], 'info', this.dialogService);
    } else {
      console.log('Continuar');
      console.log('imprimiendo valores ' + JSON.stringify(this.listSend));
      localStorage.setItem('listSendInject', JSON.stringify(this.listSend));
      const base64textString = btoa(JSON.stringify(this.listSend));
      console.log('base64textString=' + base64textString);

      let totalSelected = 0;
      for (let i = 0; i < this.listSend.length; i++) {
        if (this.listSend[i].selected) {
          totalSelected++;
        }
      }
      if (totalSelected > 0) {
        for (let i = 0; i < this.listSend.length; i++) {
          if (this.listSend[i].selected) {
            oc = this.listSend[i].order.orderNumber;
            origin = this.listSend[i].order.origin;
            errorId = this.listSend[i].order.errorId;

            this.inconsistenciasOcService.updateError(+oc, origin, 1, 1).subscribe(
                (res: any) => (this.ret = res),
                error => () => {
                  console.log('error del servicio de update de error');
                },
                () => {
                  console.log('se inhabilita el error');
                  // this.ret = this.utils.validarRespuesta(this.ret);
                }
              );
          }
        }

        setTimeout(() => {
          const listSendInject = JSON.parse(
            localStorage.getItem('listSendInject')
          );
          console.log('listSendInject: ', listSendInject);
          console.log('length: ', listSendInject.length);
          for (let i = 0; i < listSendInject.length; i++) {
            console.log('i: ' + listSendInject[i]);
            if (listSendInject[i].selected) {
              console.log('OK: ');
              const ocInject = listSendInject[i].order.orderNumber;
              const originInject = listSendInject[i].order.origin;
              const errorIdInject = listSendInject[i].order.errorId;
              console.log('ocInject: ' + ocInject);
              console.log('originInject: ' + originInject);
              console.log('erroridInject: ' + errorIdInject);
              this.callReinjectOrderServiceMasivo('' + ocInject, originInject, errorIdInject);
            }
          }
        }, 20000);

        this.cleanSearch();

        setTimeout(() => {
          this.loadings = false;
          this.messageService.cargando(this.loadings);

          this.inconsistenciasOcService.insertLog(3, +oc, this.usuario.idUser).subscribe(
              (res: any) => (this.ret = res),
              error => () => {
                console.log('error al insertar log');
              },
              () => {
                console.log('insertamos log correctamente');
                // this.utils.validarRespuesta(this.ret);
              }
            );

          console.log('recargar : ' + (this.model.stateAction > 0 ? this.model.stateAction : 0) + '' +
          this.fechaCompraDesde + '' + this.fechaCompraHasta);

          this.loadings = true;
          this.messageService.cargando(this.loadings);
          this.legacyErrors();

          this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea masivo realizado con éxito'],
          'info', this.dialogService);
        }, 15000);
      } else {
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        this.messageService.enviarMensaje('Informacion', ['Debes selecionar al menos un chek'], 'info', this.dialogService);
      }
      this.selectedAll = null;
      this.listSend = undefined;
    }
  }

  pushServiceMassiveOrdersSdv() {
    // tslint:disable-next-line:prefer-const
    let oc: String;
    // tslint:disable-next-line:prefer-const

    if (this.listSend === undefined) {
      this.messageService.enviarMensaje('Alerta', ['Debes seleccionar al menos un check'], 'info', this.dialogService);
    } else {
      console.log('Continuar');
      console.log('imprimiendo valores ' + JSON.stringify(this.listSend));
      localStorage.setItem('listSendInject', JSON.stringify(this.listSend));
      const base64textString = btoa(JSON.stringify(this.listSend));
      console.log('base64textString=' + base64textString);

      let totalSelected = 0;
      for (let i = 0; i < this.listSend.length; i++) {
        if (this.listSend[i].selected) {
          totalSelected++;
        }
      }
      if (totalSelected > 0) {
        this.loadings = true;
        this.messageService.cargando(this.loadings);
          this.inconsistenciasOcService.updateErrorMassive(base64textString, 1, 1, 3).subscribe(
              res => {
                console.log(res);
                this.results = this.utils.validarRespuestaFormatear(res);
                // this.results = res.message;
                // this.results = JSON.parse(this.results.toString());
                if (this.results.response !== 200) {
                  this.loadings = false;
                  this.messageService.cargando(this.loadings);
                  this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea masivo no realizado'],
                  'info', this.dialogService);
                } else {
                  this.loadings = false;
                  this.messageService.cargando(this.loadings);
                  this.cleanSearch();
                  console.log('recargar : ' + (this.model.stateAction > 0 ? this.model.stateAction : 0) +
                    '' + this.fechaCompraDesde + '' + this.fechaCompraHasta);

                  this.loadings = true;
                  this.messageService.cargando(this.loadings);
                  this.legacyErrors();

                  this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea masivo realizado con éxito'],
                  'info', this.dialogService);



                  setTimeout(() => {
                    const listSendInject = JSON.parse(
                      localStorage.getItem('listSendInject')
                    );
                    console.log('listSendInject: ', listSendInject);
                    console.log('length: ', listSendInject.length);
                    for (let i = 0; i < listSendInject.length; i++) {
                      console.log('i: ' + listSendInject[i]);
                      if (listSendInject[i].selected) {
                        console.log('OK: ');
                        const ocInject = listSendInject[i].order.orderNumber;
                        const originInject = listSendInject[i].order.origin;
                        const errorIdInject = listSendInject[i].order.errorId;
                        console.log('ocInject: ' + ocInject);
                        console.log('originInject: ' + originInject);
                        console.log('erroridInject: ' + errorIdInject);
                        this.callReinjectOrderServiceMasivo('' + ocInject, originInject, errorIdInject);
                      }
                    }
                  }, 5000);
                }
              },
              err => {
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.messageService.enviarMensaje('Error Accion', ['Error servicio actualizar errores'], 'info', this.dialogService);
              }
            );
      } else {
        this.messageService.enviarMensaje('Informacion', ['Debes selecionar al menos un chek'], 'info', this.dialogService);
      }
      this.selectedAll = null;
      this.listSend = undefined;
    }
  }

  pushServiceMassiveOrdersEomCreate() {
    // tslint:disable-next-line:prefer-const
    let oc: String;
    // tslint:disable-next-line:prefer-const
    let origin: number;
    // tslint:disable-next-line:prefer-const
    let errorId: number;

    if (this.listSendEomCreate === undefined) {
      this.messageService.enviarMensaje('Alerta', ['Debes seleccionar al menos un check'], 'info', this.dialogService);
    } else {
      console.log('Continuar');
      console.log('imprimiendo valores ' + JSON.stringify(this.listSendEomCreate));
      localStorage.setItem('listSendEomCreateInject', JSON.stringify(this.listSendEomCreate));
      const base64textString = btoa(JSON.stringify(this.listSendEomCreate));
      console.log('base64textString=' + base64textString);

      let totalSelected = 0;
      for (let i = 0; i < this.listSendEomCreate.length; i++) {
        if (this.listSendEomCreate[i].selectedEomCreate) {
          totalSelected++;
        }
      }
      if (totalSelected > 0) {
        this.loadings = true;
        this.messageService.cargando(this.loadings);
          this.inconsistenciasOcService.updateErrorMassive(base64textString, 1, 1, 4).subscribe(
              res => {
                console.log(res);
                this.results = this.utils.validarRespuestaFormatear(res);
                // this.results = res.message;
                // this.results = JSON.parse(this.results.toString());
                if (this.results.response !== 200) {
                  this.loadings = false;
                  this.messageService.cargando(this.loadings);
                  this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea masivo no realizado'],
                  'info', this.dialogService);
                } else {
                  // this.utils.validarRespuesta(res);
                  this.loadings = false;
                  this.messageService.cargando(this.loadings);

                  this.cleanSearch();

                  console.log('recargar : ' + (this.model.stateAction > 0 ? this.model.stateAction : 0) + '' +
                  this.fechaCompraDesde + '' + this.fechaCompraHasta);

                  this.loadings = true;
                  this.messageService.cargando(this.loadings);
                  this.legacyErrors();

                  this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea masivo realizado con éxito'],
                    'info', this.dialogService);


                  setTimeout(() => {
                    const listSendEomCreateInject = JSON.parse(
                      localStorage.getItem('listSendEomCreateInject')
                    );
                    console.log('listSendEomCreateInject: ', listSendEomCreateInject);
                    console.log('length: ', listSendEomCreateInject.length);
                    for (let i = 0; i < listSendEomCreateInject.length; i++) {
                      console.log('i: ' + listSendEomCreateInject[i]);
                      if (listSendEomCreateInject[i].selectedEomCreate) {
                        console.log('OK: ');
                        const ocInject = listSendEomCreateInject[i].order.orderNumber;
                        const originInject = listSendEomCreateInject[i].order.origin;
                        const errorIdInject = listSendEomCreateInject[i].order.errorId;
                        console.log('ocInject: ' + ocInject);
                        console.log('originInject: ' + originInject);
                        console.log('erroridInject: ' + errorIdInject);
                        this.callReinjectOrderServiceMasivo('' + ocInject, originInject, errorIdInject);
                      }
                    }
                  }, 5000);
                }
              },
              err => {
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                console.log(err);
                this.messageService.enviarMensaje('Error Accion', ['Error servicio actualizar errores'], 'info', this.dialogService);
              }
            );
      } else {
        this.messageService.enviarMensaje('Informacion', ['Debes selecionar al menos un chek'], 'info', this.dialogService);
      }
      this.selectedAllEomCreate = null;
      this.listSendEomCreate = undefined;
    }
  }

  pushServiceMassiveOrdersEomAct() {
    // tslint:disable-next-line:prefer-const
    let oc: String;
    // tslint:disable-next-line:prefer-const
    let origin: number;
    // tslint:disable-next-line:prefer-const
    let errorId: number;

    const totalCheckSelected = 0;

    if (this.listSendEomAct === undefined) {
      this.messageService.enviarMensaje('Alerta', ['Debes seleccionar al menos un check'], 'info', this.dialogService);
    } else {
      console.log('Continuar');
      console.log('imprimiendo valores ' + JSON.stringify(this.listSendEomAct));
      localStorage.setItem('listSendEomActInject', JSON.stringify(this.listSendEomAct)
      );
      const base64textString = btoa(JSON.stringify(this.listSendEomAct));
      console.log('base64textString=' + base64textString);

      let totalSelected = 0;
      for (let i = 0; i < this.listSendEomAct.length; i++) {
        if (this.listSendEomAct[i].selectedEomAct) {
          totalSelected++;
        }
      }
      if (totalSelected > 0) {
        this.loadings = true;
        this.messageService.cargando(this.loadings);
          this.inconsistenciasOcService
            .updateErrorMassive(base64textString, 1, 1, 5)
            .subscribe(
              res => {
                console.log(res);
                this.results = this.utils.validarRespuestaFormatear(res);
                // this.results = res.message.replace(/\n/ig, '');
                // this.results = JSON.parse(this.results);
                console.log(this.results);
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.cleanSearch();
                console.log('recargar : ' + (this.model.stateAction > 0 ? this.model.stateAction : 0) +
                  '' + this.fechaCompraDesde + '' + this.fechaCompraHasta);
                this.loadings = true;
                this.messageService.cargando(this.loadings);
                this.legacyErrors();

                this.messageService.enviarMensaje('Error Acción',
                ['Procesar orden errónea masivo realizado con éxito'], 'info', this.dialogService);

                setTimeout(() => {
                  const listSendEomActInject = JSON.parse(
                    localStorage.getItem('listSendEomActInject')
                  );
                  console.log('listSendEomActInject: ', listSendEomActInject);
                  console.log('length: ', listSendEomActInject.length);
                  for (let i = 0; i < listSendEomActInject.length; i++) {
                    console.log('i: ' + listSendEomActInject[i]);
                    if (listSendEomActInject[i].selectedEomAct) {
                      console.log('OK: ');
                      const ocInject = listSendEomActInject[i].order.orderNumber;
                      const originInject = listSendEomActInject[i].order.origin;
                      const errorIdInject = listSendEomActInject[i].order.errorId;
                      console.log('ocInject: ' + ocInject);
                      console.log('originInject: ' + originInject);
                      console.log('erroridInject: ' + errorIdInject);
                      this.callReinjectOrderServiceMasivo('' + ocInject, originInject, errorIdInject);
                    }
                  }
                }, 5000);
              },
              err => {
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.messageService.enviarMensaje('Error Accion', ['Error servicio actualizar errores'], 'info', this.dialogService);
              }
            );
      } else {
        this.messageService.enviarMensaje('Informacion', ['Debes selecionar al menos un chek'], 'info', this.dialogService);
      }
      this.selectedAllEomAct = null;
      this.listSendEomAct = undefined;
    }
  }

  pushServiceMassiveOrdersUpdateTmas() {
    // tslint:disable-next-line:prefer-const
    let oc: String;
    // tslint:disable-next-line:prefer-const
    let origin: number;
    // tslint:disable-next-line:prefer-const
    let errorId: number;

    const totalCheckSelected = 0;

    if (this.listSendUpdateTmas === undefined) {
      this.messageService.enviarMensaje('Alerta', ['Debes seleccionar al menos un check'], 'info', this.dialogService);
    } else {
      console.log('Continuar');
      console.log('imprimiendo valores ' + JSON.stringify(this.listSendUpdateTmas));
      localStorage.setItem('listSendUpdateTmasInject', JSON.stringify(this.listSendUpdateTmas));
      const base64textString = btoa(JSON.stringify(this.listSendUpdateTmas));
      console.log('base64textString=' + base64textString);

      let totalSelected = 0;
      for (let i = 0; i < this.listSendUpdateTmas.length; i++) {
        if (this.listSendUpdateTmas[i].selectedUpdateTmas) {
          totalSelected++;
        }
      }
      if (totalSelected > 0) {
        this.loadings = true;
        this.messageService.cargando(this.loadings);
          this.inconsistenciasOcService.updateErrorMassive(base64textString, 1, 1, 6).subscribe(
              res => {
                console.log(res);
                this.results = this.utils.validarRespuestaFormatear(res);
                // this.results = res.message.replace(/\n/ig, '');
                // this.results = JSON.parse(this.results);
                console.log(this.resultsDetail);
                  this.loadings = false;
                  this.messageService.cargando(this.loadings);

                  this.cleanSearch();

                  console.log('recargar : ' + (this.model.stateAction > 0 ? this.model.stateAction : 0) +
                    '' + this.fechaCompraDesde + '' + this.fechaCompraHasta);
                  this.loadings = true;
                  this.messageService.cargando(this.loadings);
                  this.legacyErrors();

                  this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea masivo realizado con éxito'],
                    'info', this.dialogService);

                  setTimeout(() => {
                    const listSendUpdateTmasInject = JSON.parse(
                      localStorage.getItem('listSendUpdateTmasInject')
                    );
                    console.log('listSendUpdateTmasInject: ', listSendUpdateTmasInject);
                    console.log('length: ', listSendUpdateTmasInject.length);
                    for (let i = 0; i < listSendUpdateTmasInject.length; i++) {
                      console.log('i: ' + listSendUpdateTmasInject[i]);
                      if (listSendUpdateTmasInject[i].selectedUpdateTmas) {
                        console.log('OK: ');
                        const ocInject = listSendUpdateTmasInject[i].order.orderNumber;
                        const originInject = listSendUpdateTmasInject[i].order.origin;
                        const errorIdInject = listSendUpdateTmasInject[i].order.errorId;
                        console.log('ocInject: ' + ocInject);
                        console.log('originInject: ' + originInject);
                        console.log('erroridInject: ' + errorIdInject);
                        this.callReinjectOrderServiceMasivo('' + ocInject, originInject, errorIdInject);
                      }
                    }
                  }, 5000);
              },
              err => {
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.messageService.enviarMensaje( 'Error Accion', ['Error servicio actualizar errores'], 'info', this.dialogService);
              }
            );
      } else {
        this.messageService.enviarMensaje('Informacion', ['Debes selecionar al menos un chek'], 'info', this.dialogService);
      }
      this.selectedAllUpdateTmas = null;
      this.listSendUpdateTmas = undefined;
    }
  }

  pushServiceMassiveOrdersPpl() {
    // tslint:disable-next-line:prefer-const
    let oc: String;
    // tslint:disable-next-line:prefer-const

    if (this.listSendPpl === undefined) {
      this.messageService.enviarMensaje('Alerta', ['Debes seleccionar al menos un check'], 'info', this.dialogService);
    } else {
      console.log('Continuar');
      console.log('imprimiendo valores ' + JSON.stringify(this.listSendPpl));
      localStorage.setItem('listSendPplInject', JSON.stringify(this.listSendPpl));
      const base64textString = btoa(JSON.stringify(this.listSendPpl));
      console.log('base64textString=' + base64textString);

      let totalSelected = 0;
      for (let i = 0; i < this.listSendPpl.length; i++) {
        if (this.listSendPpl[i].selectedPpl) {
          totalSelected++;
        }
      }
      if (totalSelected > 0) {
        this.loadings = true;
        this.messageService.cargando(this.loadings);
          this.inconsistenciasOcService.updateErrorMassive(base64textString, 1, 1, 7).subscribe(
              res => {
                res = this.utils.validarRespuestaFormatear(res);
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.cleanSearch();
                console.log('recargar : ' + (this.model.stateAction > 0 ? this.model.stateAction : 0) +
                '' + this.fechaCompraDesde + '' + this.fechaCompraHasta);

                this.loadings = true;
                this.messageService.cargando(this.loadings);
                this.legacyErrors();

                this.messageService.enviarMensaje(
                  'Error Acción', ['Procesar orden errónea masivo realizado con éxito'], 'info', this.dialogService);

                setTimeout(() => {
                  const listSendPplInject = JSON.parse(localStorage.getItem('listSendPplInject'));
                  console.log('listSendPplInject: ', listSendPplInject);
                  console.log('length: ', listSendPplInject.length);
                  for (let i = 0; i < listSendPplInject.length; i++) {
                    console.log('i: ' + listSendPplInject[i]);
                    if (listSendPplInject[i].selectedPpl) {
                      console.log('OK: ');
                      const ocInject = listSendPplInject[i].order.orderNumber;
                      const originInject = listSendPplInject[i].order.origin;
                      const errorIdInject =
                        listSendPplInject[i].order.errorId;
                      console.log('ocInject: ' + ocInject);
                      console.log('originInject: ' + originInject);
                      console.log('erroridInject: ' + errorIdInject);
                      this.callReinjectOrderServiceMasivo('' + ocInject, originInject, errorIdInject);
                    }
                  }
                }, 5000);
              },
              err => {
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.messageService.enviarMensaje('Error Accion', ['Error servicio actualizar errores'], 'info', this.dialogService);
              }
            );
      } else {
        this.messageService.enviarMensaje('Informacion', ['Debes selecionar al menos un chek'], 'info', this.dialogService);
      }
      this.selectedAllPpl = null;
      this.listSendPpl = undefined;
    }
  }

  pushServiceMassiveOrdersGc() {
    // tslint:disable-next-line:prefer-const
    let oc: String;

    if (this.listSendGc === undefined) {
      this.messageService.enviarMensaje('Alerta', ['Debes seleccionar al menos un check'], 'info', this.dialogService);
    } else {
      console.log('Continuar');
      console.log('imprimiendo valores ' + JSON.stringify(this.listSendGc));
      localStorage.setItem('listSendGcInject', JSON.stringify(this.listSendGc));
      const base64textString = btoa(JSON.stringify(this.listSendGc));
      console.log('base64textString=' + base64textString);

      let totalSelected = 0;
      for (let i = 0; i < this.listSendGc.length; i++) {
        if (this.listSendGc[i].selectedGc) {
          totalSelected++;
        }
      }
      if (totalSelected > 0) {
        this.loadings = true;
        this.messageService.cargando(this.loadings);
          this.inconsistenciasOcService.updateErrorMassive(base64textString, 1, 1, 8).subscribe(
              res => {
                console.log(res);
                this.results = this.utils.validarRespuestaFormatear(res);
                // this.results = res.message.replace(/\n/ig, '');
                // this.results = JSON.parse(this.results);
                console.log(this.results);
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.cleanSearch();
                console.log('recargar : ' + (this.model.stateAction > 0 ? this.model.stateAction : 0) +
                  '' + this.fechaCompraDesde + '' + this.fechaCompraHasta);
                this.loadings = true;
                this.messageService.cargando(this.loadings);
                this.legacyErrors();

                this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea masivo realizado con éxito'],
                'info', this.dialogService);


                setTimeout(() => {
                  const listSendGcInject = JSON.parse(localStorage.getItem('listSendGcInject'));
                  console.log('listSendGcInject: ', listSendGcInject);
                  console.log('length: ', listSendGcInject.length);
                  for (let i = 0; i < listSendGcInject.length; i++) {
                    console.log('i: ' + listSendGcInject[i]);
                    if (listSendGcInject[i].selectedGc) {
                      console.log('OK: ');
                      const ocInject = listSendGcInject[i].order.orderNumber;
                      const originInject = listSendGcInject[i].order.origin;
                      const errorIdInject = listSendGcInject[i].order.errorId;
                      console.log('ocInject: ' + ocInject);
                      console.log('originInject: ' + originInject);
                      console.log('erroridInject: ' + errorIdInject);
                      this.callReinjectOrderServiceMasivo('' + ocInject, originInject, errorIdInject);
                    }
                  }
                }, 5000);
              },
              err => {
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.messageService.enviarMensaje('Error Accion', ['Error servicio actualizar errores'], 'info', this.dialogService);
              }
            );
      } else {
        this.messageService.enviarMensaje('Informacion', ['Debes selecionar al menos un chek'], 'info', this.dialogService);
      }
      this.selectedAllGc = null;
      this.listSendGc = undefined;
    }
  }

  pushServiceMassiveOrdersEmail() {
    // tslint:disable-next-line:prefer-const
    let oc: String;
    if (this.listSendEmail === undefined) {
      this.messageService.enviarMensaje('Alerta', ['Debes seleccionar al menos un check'], 'info', this.dialogService);
    } else {
      console.log('Continuar');
      console.log('imprimiendo valores ' + JSON.stringify(this.listSendEmail));
      localStorage.setItem('listSendEmailInject', JSON.stringify(this.listSendEmail));
      const base64textString = btoa(JSON.stringify(this.listSendEmail));
      console.log('base64textString=' + base64textString);

      let totalSelected = 0;
      for (let i = 0; i < this.listSendEmail.length; i++) {
        if (this.listSendEmail[i].selectedEmail) {
          totalSelected++;
        }
      }
      if (totalSelected > 0) {
        this.loadings = true;
        this.messageService.cargando(this.loadings);
          this.inconsistenciasOcService.updateErrorMassive(base64textString, 1, 1, 9).subscribe(
              res => {
                console.log(res);
                this.results = this.utils.validarRespuestaFormatear(res);
                // this.results = res.message.replace(/\n/ig, '');
                // this.results = JSON.parse(this.results);
                console.log(this.results);
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.cleanSearch();

                console.log('recargar : ' + (this.model.stateAction > 0 ? this.model.stateAction : 0) + '' +
                this.fechaCompraDesde + '' + this.fechaCompraHasta);

                this.loadings = true;
                this.messageService.cargando(this.loadings);
                this.legacyErrors();

                this.messageService.enviarMensaje('Error Acción', ['Procesar orden errónea masivo realizado con éxito'],
                'info', this.dialogService);

                setTimeout(() => {
                  const listSendEmailInject = JSON.parse(localStorage.getItem('listSendEmailInject'));
                  console.log('listSendEmailInject: ', listSendEmailInject);
                  console.log('length: ', listSendEmailInject.length);
                  for (let i = 0; i < listSendEmailInject.length; i++) {
                    console.log('i: ' + listSendEmailInject[i]);
                    if (listSendEmailInject[i].selectedEmail) {
                      console.log('OK: ');
                      const ocInject = listSendEmailInject[i].order.orderNumber;
                      const originInject = listSendEmailInject[i].order.origin;
                      const errorIdInject = listSendEmailInject[i].order.errorId;
                      console.log('ocInject: ' + ocInject);
                      console.log('originInject: ' + originInject);
                      console.log('erroridInject: ' + errorIdInject);
                      this.callReinjectOrderServiceMasivo('' + ocInject, originInject, errorIdInject);
                    }
                  }
                }, 5000);
              },
              err => {
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.messageService.enviarMensaje('Error Accion', ['Error servicio actualizar errores'], 'info', this.dialogService);
              }
            );
      } else {
        this.messageService.enviarMensaje('Informacion', ['Debes selecionar al menos un chek'], 'info', this.dialogService);
      }
      this.selectedAllEmail = null;
      this.listSendEmail = undefined;
    }
  }

  pushMassiveSkuServiceEomCreate() {
    // tslint:disable-next-line:prefer-const
    let oc: String;
    if (this.listSendEomCreate === undefined) {
      this.messageService.enviarMensaje('Alerta', ['Debes seleccionar al menos un check'], 'info', this.dialogService);
    } else {
      console.log('Continuar');
      console.log('imprimiendo valores ' + JSON.stringify(this.listSendEomCreate));
      localStorage.setItem('listSendEomCreateInject', JSON.stringify(this.listSendEomCreate));
      const base64textString = btoa(JSON.stringify(this.listSendEomCreate));
      console.log('base64textString=' + base64textString);

      let totalSelected = 0;
      for (let i = 0; i < this.listSendEomCreate.length; i++) {
        if (this.listSendEomCreate[i].selectedEomCreate) {
          totalSelected++;
        }
      }
      if (totalSelected > 0) {
        this.loadings = true;
        this.messageService.cargando(this.loadings);
          this.inconsistenciasOcService.updateErrorMassive(base64textString, 1, 1, 4).subscribe(
              res => {
                console.log(res);
                this.results = this.utils.validarRespuestaFormatear(res);
                // this.results = res.message.replace(/\n/ig, '');
                // this.results = JSON.parse(this.results);
                console.log(this.results);
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.cleanSearch();
                console.log('recargar : ' + (this.model.stateAction > 0 ? this.model.stateAction : 0) + '' +
                this.fechaCompraDesde + '' + this.fechaCompraHasta);

                this.loadings = true;
                this.messageService.cargando(this.loadings);
                this.legacyErrors();

                  this.messageService.enviarMensaje('Error Acción', ['SKU Servicio masivo realizado con éxito'],
                  'info', this.dialogService);



                  setTimeout(() => {
                    const listSendEomCreateInject = JSON.parse(
                      localStorage.getItem('listSendEomCreateInject')
                    );
                    console.log('listSendEomCreateInject: ', listSendEomCreateInject);
                    console.log('length: ', listSendEomCreateInject.length);
                    for (let i = 0; i < listSendEomCreateInject.length; i++) {
                      console.log('i: ' + listSendEomCreateInject[i]);
                      if (listSendEomCreateInject[i].selectedEomCreate) {
                        console.log('OK: ');
                        const ocInject = listSendEomCreateInject[i].order.orderNumber;
                        const originInject = listSendEomCreateInject[i].order.origin;
                        const errorIdInject = listSendEomCreateInject[i].order.errorId;
                        console.log('ocInject: ' + ocInject);
                        console.log('originInject: ' + originInject);
                        console.log('erroridInject: ' + errorIdInject);
                        this.callUpdateItemsMasivo('' + ocInject);
                      }
                    }
                  }, 5000);
              },
              err => {
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.messageService.enviarMensaje('Error Accion', ['Error servicio actualizar errores'], 'info', this.dialogService);
              }
            );
      } else {
        this.messageService.enviarMensaje('Informacion', ['Debes selecionar al menos un chek'], 'info', this.dialogService);
      }
      this.selectedAllEomCreate = null;
      this.listSendEomCreate = undefined;
    }
  }

  checkAlll() {
    const elements = document.getElementsByTagName('input');
    if (this.checkAll) {
      this.checkAll = false;
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].type === 'checkbox') {
          elements[i].checked = false;
        }
      }
    }
  }

  // reinject
  callReinjectOrderServiceMasivo(oc: String, origin: number, errorId: number) {
    let ori: String;
    if (origin === 2) {
      // bm
      ori = 'Emision_DTE';
    } else if (origin === 3) {
      ori = 'Consulta_DTE';
    } else if (origin === 4) {
      ori = 'Creacion_TRX_SDV';
    } else if (origin === 5) {
      ori = 'Update_Giftcard';
    } else if (origin === 6) {
      ori = 'Email_DTE';
    } else if (origin === 7) {
      ori = 'Regla_Email';
    } else if (origin === 8) {
      ori = 'Regla_Email';
    } else if (origin === 9) {
      ori = 'Email_Despacho';
    } else if (origin === 12) {
      ori = 'Creacion_OD';
    } else if (origin === 13) {
      ori = 'Update_Tmas';
    } else if (origin === 14) {
      ori = 'Regla_Email';
    } else if (origin === 15) {
      ori = 'Actualizacion_OD';
    }

    // informacion de las acciones
    this.inconsistenciasOcService.getActions(origin, errorId).subscribe(
      (res: any) => (this.ret = res),
      error => () => {
        console.log('error del servicio de las acciones');
      },
      () => {

        this.ret = this.utils.validarRespuestaFormatear(this.ret);
        // this.ret = this.ret.message.replace(/\n/ig, '');
        // this.ret = JSON.parse(this.ret.toString());
        if (this.ret !== null) {

          // Insertar log
          this.inconsistenciasOcService.insertLog(3, +oc, this.usuario.idUser).subscribe(
            (res: any) => (this.ret = res),
              error => () => {
                console.log('error al insertar log');
                console.log(error);
              },
              () => {
                console.log('insertamos log correctamente' );
                // this.utils.validarRespuesta(this.ret);
              }
          );



          let reinjectType: String;
          if (this.ret.actions.action[0].id === 1 || this.ret.actions.action[0].id === 2) {
            if (this.ret.actions.action[0].id === 1) {
              reinjectType = 'CONTINUE';
            } else if (this.ret.actions.action[0].id === 2) {
              // bm
              reinjectType = 'NEXT';
            }

            // informacion de la orden
            this.searchInfo.searchOrderData(oc).subscribe(
              // bm
              (res: any) => (this.ret = res),
              error => () => {
                console.log('error del servicio que trae informacion de la orden');
                console.log(error);
              },
              () => {
                if (this.ret != null) {
                  console.log('no es nulo ');
                  if (this.ret.trxHdr.version !== null && this.ret.trxIdentify !== null) {
                    const trxHdr: TrxHdr = new TrxHdr();
                    const context: Context = new Context();
                    const trxIdentify: TrxIdentify = new TrxIdentify();
                    const trxInject: TrxInject = new TrxInject();
                    trxHdr.version = this.ret.trxHdr.version;
                    context.idChannel = this.ret.trxHdr.context.idChannel;
                    context.idCompany = this.ret.trxHdr.context.idCompany;
                    context.idCountry = this.ret.trxHdr.context.idCountry;
                    context.idStore = this.ret.trxHdr.context.idStore;
                    trxHdr.context = context;
                    trxHdr.trxClientExecDate = this.ret.trxHdr.trxClientExecDate;
                    trxIdentify.idEvent = this.ret.trxIdentify.idEvent;
                    trxIdentify.idOrder = this.ret.trxIdentify.idOrder;
                    trxIdentify.orderType = this.ret.trxIdentify.orderType;
                    trxInject.type = reinjectType;
                    trxInject.origin = ori;

                    console.log(trxHdr);
                    console.log(trxHdr);
                    console.log(trxIdentify);
                    console.log(trxIdentify);

                    console.log(trxInject );
                    console.log(trxInject);

                    // servicio de reinyeccion
                    this.inconsistenciasOcService.reinjectOrder2(trxHdr, trxIdentify, trxInject).subscribe(
                        (res: any) => (this.ret = res),
                        error => () => {
                          console.log(error);
                          console.log('error del servicio de reinyeccion');
                        },
                        () => {
                          console.log('respuesta reinject ');
                          console.log(this.ret);
                        }
                      );
                  } else {
                    console.log('no existe la orden en MTD');
                  }
                }
              }
            );
          }
        }
      }
    );
  }

  callUpdateItemsMasivo(orderNumber: String) {
    // this.loading = true;
    console.log('Loading.... callReinjectOrderService');
    // informacion de las acciones
    this.inconsistenciasOcService.updateStatusItems(+orderNumber).subscribe(
      (res: any) => (this.ret = res),
      error => () => {
        console.log('error en el servicio sku servicio');
      },
      () => {
        this.ret = this.utils.validarRespuestaFormatear(this.ret);
        // this.ret = this.ret.message.replace(/\n/ig, '');
        // this.ret = JSON.parse(this.ret.toString());
        console.log(this.ret);
        console.log('respuesta = ' + this.ret);
        console.log('codigo = ' + this.ret.code);
        if (this.ret !== null) {
          // let reinjectType: String;
          if (this.ret.code === 200) {
            this.inconsistenciasOcService.insertLog(7, +orderNumber, this.usuario.idUser).subscribe(
            (res: any) => (this.ret = res),
            error => () => {
              console.log(error);
              console.log('error al insertar log');
            },
            () => {
              console.log('insertamos log correctamente');
              // this.utils.validarRespuesta(this.ret);
            }
          );

            // informacion de la orden
            this.searchInfo.searchOrderData(orderNumber).subscribe(
              (res: any) => (this.ret = res),
              error => () => {
                console.log('error del servicio que trae informacion de la orden');
              },
              () => {
                console.log('servicio que trae informacion de la orden');
                console.log('respuesta del servicio ');
                console.log(this.ret);
                 if (this.ret != null) {
                  if (this.ret.trxHdr.version !== null && this.ret.trxIdentify !== null) {
                    const trxHdr: TrxHdr = new TrxHdr();
                    const context: Context = new Context();
                    const trxIdentify: TrxIdentify = new TrxIdentify();
                    const trxInject: TrxInject = new TrxInject();
                    trxHdr.version = this.ret.trxHdr.version;
                    context.idChannel = this.ret.trxHdr.context.idChannel;
                    context.idCompany = this.ret.trxHdr.context.idCompany;
                    context.idCountry = this.ret.trxHdr.context.idCountry;
                    context.idStore = this.ret.trxHdr.context.idStore;
                    trxHdr.context = context;
                    trxHdr.trxClientExecDate = this.ret.trxHdr.trxClientExecDate;
                    trxIdentify.idEvent = this.ret.trxIdentify.idEvent;
                    trxIdentify.idOrder = this.ret.trxIdentify.idOrder;
                    trxIdentify.orderType = this.ret.trxIdentify.orderType;
                    trxInject.type = 'NEXT';
                    trxInject.origin = 'Creacion_OD';

                    console.log('trxHdr');
                    console.log(trxHdr);
                    console.log('trxIdentify');
                    console.log(trxIdentify);

                    console.log('trxInject ');
                    console.log(trxInject);

                    // servicio de reinyeccion
                    this.inconsistenciasOcService.reinjectOrder2(trxHdr, trxIdentify, trxInject).subscribe(
                        (res: any) => (this.ret = res.message),
                        error => () => {
                          console.log('error del servicio de reinyeccion');
                        },
                        () => {
                          console.log('respuesta reinject ');
                          console.log(this.ret);


                        }
                      );
                  } else {
                    console.log('no existe la orden en MTD');
                  }
                }
              }
            );
          } else {
            console.log('Hay un error con el servicio que actualiza el estado de los itemes');
          }
        }
      }
    );

    this.reinjectLoading = true;
    console.log('reinjectLoading ' + this.reinjectLoading);
    console.log('callReinjectOrderService');
    this.reinjectLoading = false;
    console.log('reinjectLoading ' + this.reinjectLoading);
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

  cleanResults() {
    this.searchInfo.cleanResults();
    this.files = [];
    this.listLegacyIOC = [];
    this.listLegacySDV = [];
    this.listLegacyEOMCreate = [];
    this.bugList = [];
    this.listLegacyEOMAct = [];
    this.listLegacyUpdateTmas = [];
    this.listLegacyPPL = [];
    this.listLegacyGF = [];
    this.listLegacyEmail = [];

    this.loadings = false;
    this.fechaCompraDesde = undefined;
    this.fechaCompraHasta = undefined;
    this.model.typeOrder  = undefined;
    this.model.stateAction  = undefined;
    this.model.ordenCompraSearch   = undefined;
  }

  legacyErrors() {
    console.log('en legacyErrors');
    const formStateAction = sessionStorage.getItem('formStateAction');
    const formJsonInitDate = sessionStorage.getItem('formJsonInitDate');
    const formJsonEndDate = sessionStorage.getItem('formJsonEndDate');
    const formOrdenCompraSearch = sessionStorage.getItem('formOrdenCompraSearch');
    const formTypeOrder = sessionStorage.getItem('formTypeOrder');

    this.inconsistenciasOcService.getListLegacyErrors(
      formStateAction == null || formStateAction === '' ? '0' : formStateAction, formJsonInitDate, formJsonEndDate,
      1, 1, formOrdenCompraSearch, formTypeOrder).subscribe(
      result => {
        this.bugList = this.utils.validarRespuestaFormatear(result);
        //  = result.message.replace(/\n/ig, '');
        // this.bugList = JSON.parse(this.bugList);
        this.bugList = this.bugList.bugList;
        for (let i = 0; i < this.bugList.length; i++) {
          // Origen 1, Ingreso OC
          if (this.bugList[i].order.origin === 1) {
            console.log('Origen 1 Ingreso OC');
            this.listLegacyIOC.push(this.bugList[i]);
          }
          // Origen 4, SDV Creacion_TRX_SDV
          if (this.bugList[i].order.origin === 4) {
            console.log('Origen 4  SDV (Creacion_TRX_SDV)');
            this.listLegacySDV.push(this.bugList[i]);
          }
          // Origen 12 EOM Creacion_OD
          if (this.bugList[i].order.origin === 12) {
            console.log('Origen 12 EOM (Creacion_OD)');
            this.listLegacyEOMCreate.push(this.bugList[i]);
          }
          // Origen 15 EOM Actualizacion_OD
          if (this.bugList[i].order.origin === 15) {
            console.log('Origen 15 EOM (Actualizacion_OD)');
            this.listLegacyEOMAct.push(this.bugList[i]);
          }
          // Origen 2,3 Emision_DTE, Consulta_DTE
          if (this.bugList[i].order.origin === 2 || this.bugList[i].order.origin === 3) {
            console.log('Origen 2,3 PPL (Emision_DTE, Consulta_DTE)');
            this.listLegacyPPL.push(this.bugList[i]);
          }
          // Origen 5 GC, Update_Giftcard
          if (this.bugList[i].order.origin === 5) {
            console.log('Origen 5 Update_Giftcard');
            this.listLegacyGF.push(this.bugList[i]);
          }
          // Email_DTE, Email_Confirmacion, Email_Confirmacion_DTE, Email_Despacho, Regla_Email
          if (this.bugList[i].order.origin === 6 || this.bugList[i].order.origin === 7 || this.bugList[i].order.origin === 8 ||
            this.bugList[i].order.origin === 9 || this.bugList[i].order.origin === 14) {
            console.log('Origin Email');
            this.listLegacyEmail.push(this.bugList[i]);
          }

          // Origen 13 Update_Tmas
          if (this.bugList[i].order.origin === 13) {
            console.log('Origen 13 Update_Tmas');
            this.listLegacyUpdateTmas.push(this.bugList[i]);
          }
        }
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        this.messageService.cargando(false);
      },
      errores => {
      console.log('error');
      console.log(<any>errores);
      this.loadings = false;
      this.messageService.cargando(this.loadings);
      }
    );

    this.inconsistenciasOcService.getListLegacyErrorsSFCC(formStateAction == null || formStateAction === '' ? '0' : formStateAction,
    formJsonInitDate, formJsonEndDate, 1, 1, formOrdenCompraSearch, formTypeOrder).subscribe(
      result => {
        this.files = this.utils.validarRespuestaFormatear(result);
        // console.log('entramos a un status 200 SFCC');
        // console.log(result);
        // this.files = result.message.replace(/\n/ig, '');
        // this.files = JSON.parse(this.files);
        this.files = this.files.files;
        console.log(this.files);
        this.listOrdes = this.files.orders;
        console.log(this.listOrdes);
      },
      errores => {
        console.log('error SFCC volver');
        console.log(<any>errores);
      }
    );
  }

  // searchOrderData(orderNumber: any) {
  //   this.searchInfo.searchOrderData(orderNumber).subscribe(
  //     (res: any) => (this.ret = res),
  //     error => () => {
  //       console.log('error del servicio que trae informacion de la orden');
  //       console.log(error);
  //     },
  //     () => {
  //       if (this.ret != null) {
  //         if (this.ret.trxHdr.version !== null && this.ret.trxIdentify !== null) {
  //           const trxHdr: TrxHdr = new TrxHdr();
  //           const context: Context = new Context();
  //           const trxIdentify: TrxIdentify = new TrxIdentify();
  //           const trxInject: TrxInject = new TrxInject();
  //           trxHdr.version = this.ret.trxHdr.version;
  //           context.idChannel = this.ret.trxHdr.context.idChannel;
  //           context.idCompany = this.ret.trxHdr.context.idCompany;
  //           context.idCountry = this.ret.trxHdr.context.idCountry;
  //           context.idStore = this.ret.trxHdr.context.idStore;
  //           trxHdr.context = context;
  //           trxHdr.trxClientExecDate = this.ret.trxHdr.trxClientExecDate;
  //           trxIdentify.idEvent = this.ret.trxIdentify.idEvent;
  //           trxIdentify.idOrder = this.ret.trxIdentify.idOrder;
  //           trxIdentify.orderType = this.ret.trxIdentify.orderType;
  //           trxInject.type = 'NEXT';
  //           trxInject.origin = 'Creacion_OD';

  //           // servicio de reinyeccion
  //           this.inconsistenciasOcService.reinjectOrder2(trxHdr, trxIdentify, trxInject).subscribe(
  //               (res: any) => (this.ret = res),
  //               error => () => {
  //                 console.log('error del servicio de reinyeccion');
  //                 console.log(error);
  //               },
  //               () => {
  //                 console.log('respuesta reinject ');
  //                 console.log(this.ret);
  //               }
  //             );
  //         } else {
  //           console.log('no existe la orden en MTD');
  //         }
  //       }
  //     }
  //   );
  // }
}
