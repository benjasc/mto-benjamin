import { Component, OnInit, ViewChild } from '@angular/core';
import { DateFormat } from './dateFormat';
import { GLOBAL } from './../../../shared/services/global';
import * as XLSX from 'xlsx';
import { MessageService } from './../../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { Globals } from './../../../shared/utils/globals';
import { MenuProfile } from './../../../shared/vo/menu';
import { Usuario } from './../../../shared/vo/usuario';
import { LogService } from './../../../shared/services/log.service';
import { BasepointService } from '../../services/basepoint.service';
import { LoyaltypayService } from '../../services/loyaltypay.service';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils/utils';

@Component({
  selector: 'app-mantenedor-point',
  templateUrl: './mantenedor-point.component.html',
  styleUrls: ['./mantenedor-point.component.scss']
})
export class MantenedorPointComponent implements OnInit {

   private menu: MenuProfile[];
  // DatePicker
  fechaCompraDesde: Date;
  fechaCompraHasta: Date;
  desdeString: String;
  hastaString: String;
  myDatePickerOptionsDesde: any;
  myDatePickerOptionsHasta: any;
  myDatePickerOptionsCopy: any;
  formatoFechaDesde: DateFormat;
  formatoFechaHasta: DateFormat;

  // Exportar
  ws: XLSX.WorkSheet;
  wb: XLSX.WorkBook;


  pgCurrent: Number;
  pgrows: Number;

  orderProperty: String;
  currentColumn: any;
  currentDirection: any;
  listUsers: any;
  listProfiles: any;
  dir: any;
  modelAccordion: Array<any> = [{ isAccordionOpen: false }];

  private usuario: Usuario;
  private config: any;
  ret: any;
  loadingDelete: boolean;
  loadingInsert: boolean;
  loadingUpdate: boolean;
  loadingUpdateBasePoint: boolean;
  loadingUpdateLoyaltyPay: boolean;
  loadings: boolean;
  loadingBasePoints: boolean;
  loadingLoyaltyPays: boolean;

  results: Object[];
  resultBasePoints: Object[];
  resultLoyaltyPays: Object[];
  resultsDetail: any;
  resultDetailBasePoints: any;
  resultDetailLoyaltyPays: any;

  editable: Boolean;
  url: String;
  utils: Utils;

  @ViewChild('myModalInsertBasePoint') myModalInsertBasePoint;
  @ViewChild('myModalUpdateBasePoint') myModalUpdateBasePoint;
  @ViewChild('myModalDeleteBasePoint') myModalDeleteBasePoint;

  @ViewChild('myModalInsertLoyaltyPay') myModalInsertLoyaltyPay;
  @ViewChild('myModalUpdateLoyaltyPay') myModalUpdateLoyaltyPay;
  @ViewChild('myModalDeleteLoyaltyPay') myModalDeleteLoyaltyPay;

   constructor(
    public basepointService: BasepointService,  public loyaltypayService: LoyaltypayService, public messageService: MessageService,
    public dialogService: DialogService, public globals: Globals, public logService: LogService, public router: Router) {
      this.pgCurrent = 1;
      this.pgrows = GLOBAL.paginador_rows;
      this.orderProperty = '+ordernumber';
      this.config = this.globals.getValue();
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
    }

  ngOnInit() {
    this.messageService.cargando(true);
    // usuario
    this.usuario = this.config[1].val;
    // menu
    this.menu = this.config[2].val;

    // url
    this.url = this.router.url;

    // Modulos de acceso a ordenes
    console.log('Access : '  + JSON.stringify(this.menu) + ' / ' + this.usuario.idUser +  ' / '  + this.router.url);

    for (let i = 0; i < this.menu.length; i++) {
      for (let j = 0; j < this.menu[i].subItems.length; j++) {
        console.log('Access Menu: ' + this.menu[i].idAccess + ' / ' + this.menu[i].idModule
        + ' / ' + this.menu[i].name + ' / ' +  this.menu[i].url);

        console.log('Access SubMenu: ' + this.menu[i].subItems[j].idAccess + ' / ' + this.menu[i].subItems[j].idModule
        + ' / ' + this.menu[i].subItems[j].name + ' / '  + ' / ' + this.menu[i].subItems[j].url);

        if (this.router.url === this.menu[i].subItems[j].url) {
          if (this.menu[i].subItems[j].idAccess > 1) {
            console.log('true');
            this.editable = true;
          } else {
            console.log('false');
            this.editable = false;
          }
        }
      }
    }
    console.log('Editable : ' + this.editable );

    // Limpiar pantalla al ingresar
    this.cleanResults();
    /*
    this.loadings = true;
    // this.messageService.cargando(this.loadings);

    setTimeout(() => {
      this.loadings = false;
      this.messageService.cargando(this.loadings);
     }, 4000);
*/

     this.searchInfoLoyaltyPay('-1', '-1', '-1');
     this.searchInfoBasePoint('-1', '-1', '-1');

    this.formatoFechaDesde = new DateFormat();
    this.formatoFechaHasta = new DateFormat();

    // Fecha Desde
    const d: Date = new Date();
    this.formatoFechaDesde.myDatePickerOptions.disableSince = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 };
    this.formatoFechaDesde.myDatePickerOptions.disableUntil = { year: d.getFullYear(), month: d.getMonth() - 0, day: d.getDate() };
    this.myDatePickerOptionsDesde = this.formatoFechaDesde.myDatePickerOptions;
    // Fecha Hasta
    this.formatoFechaHasta.myDatePickerOptions.disableSince = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 };
    this.formatoFechaHasta.myDatePickerOptions.disableUntil = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 };
    this.myDatePickerOptionsHasta = this.formatoFechaHasta.myDatePickerOptions;
  }

  searchInfoBasePoint(idLoyaltyBasePoint: String, documentType: String, idStore: String) {
    console.log('Comienzo servicio de busqueda de Base Point');
    // Valido Campos y Fechas que no vengan Vacios
    /*
    if (idLoyaltyBasepoint === '' && documentType === '' && status === '' && idStore === '' ) {
      this.messageService.enviarMensaje('Error búsqueda', ['Debe ingresar filtro de búsqueda'], 'info', this.dialogService);
      this.loadings = false;
      return;
    }
    */
      this.basepointService.searchInfoBasePoint(+idLoyaltyBasePoint, +documentType, +idStore).subscribe(
        res => {
          console.log(res);
          this.resultBasePoints = this.utils.validarRespuestaFormatear(res);
          // this.resultBasePoints = res.message.replace(/\n/ig, '');
          // this.resultBasePoints = JSON.parse(this.resultBasePoints.toString());
          console.log(this.resultBasePoints);
          if (this.resultBasePoints.length === 0) {
            this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
          }
        },
        err => {
          console.log(err);
          this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda'], 'info', this.dialogService);
        }
      );
  }

  searchInfoBasePointUpdate(idLoyaltyBasePoint: string) {
    this.messageService.cargando(true);
    console.log('searchInfoBasePointUpdate ' + idLoyaltyBasePoint);

    if (this.resultDetailBasePoints !== []) {
      this.resultDetailBasePoints = [];
    }

    // search detail BasePoint
    this.basepointService.searchInfoBasePointUpdate(+idLoyaltyBasePoint).subscribe(
      res => {
        console.log(res);
        this.resultDetailBasePoints = this.utils.validarRespuestaFormatear(res);
        // this.resultDetailBasePoints = res.message.replace(/\n/ig, '');
        // this.resultDetailBasePoints = JSON.parse(this.resultDetailBasePoints);
        this.messageService.cargando(false);
        console.log(this.resultDetailBasePoints);
      },
      err => {
        console.log(err);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
      }
    );
    // open Modal
    this.myModalUpdateBasePoint.open();
  }

  updateBasePoint(idLoyaltyBasePoint: String, factor: String, factorSdv: String) {
    this.usuario = this.config[1].val;

    if (idLoyaltyBasePoint === '' || factor === '' || factorSdv === '') {
        this.messageService.enviarMensaje('Error Editar', ['Verifique que todos los campos esten completos'], 'info', this.dialogService);
    }  else if (!this.validationFactor(factor)) {
      this.messageService.enviarMensaje('Error Editar', ['Factor no válido, debe ser en formato 0.0000000000'], 'info', this.dialogService);
      return;
    }  else if (!this.validationFactor(factorSdv)) {
      this.messageService.enviarMensaje('Error Editar',
      ['Factor SDV no válido, debe ser en formato 0.0000000000'], 'info', this.dialogService);
      return;
    } else {
        this.loadings = true;
        this.messageService.cargando(this.loadings);
        this.basepointService.editBasePoint(+idLoyaltyBasePoint, factor, factorSdv).subscribe(
        res => {
          console.log(res);
          this.resultBasePoints = this.utils.validarRespuestaFormatear(res);
            // this.resultBasePoints = res.message.replace(/\n/ig, '');
            // this.resultBasePoints = JSON.parse(this.resultBasePoints.toString());
            console.log(this.resultBasePoints);
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            this.myModalUpdateBasePoint.close();
            this.loadings = false;
            this.messageService.cargando(this.loadings);

            // se inserta el log
            this.logService.insertLog(12, 0 , this.usuario.idUser  + '').subscribe(
                (response: any) => (this.ret = response),
                  error => () => {
                    console.log('error al insertar log');
                    console.log(error);
                  },
                  () => {
                    if (this.ret.code === 0) {
                      console.log('insertamos log correctamente');
                      console.log(this.ret.message);
                    } else {
                      console.log('error al insertar log');
                    }
                  }
              );
              this.cleanResultBasePoints();
              this.loadings = true;
              this.messageService.cargando(this.loadings);
              this.basepointService.searchInfoBasePoint(-1, -1, -1).subscribe(
                response => {
                  console.log('aqui');
                  console.log(response);
                  this.resultBasePoints = this.utils.validarRespuestaFormatear(response);
                  // this.resultBasePoints = response.message.replace(/\n/ig, '');
                  // this.resultBasePoints = JSON.parse(this.resultBasePoints.toString());
                  console.log(this.resultBasePoints);
                  console.log('aqui 2');
                  this.loadings = false;
                  this.messageService.cargando(this.loadings);
                  if (this.resultBasePoints.length === 0) {
                    this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
                  }
                },
                err => {
                  this.loadings = false;
                  this.messageService.cargando(this.loadings);
                  console.log(err);
                  this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda'], 'info', this.dialogService);
                }
              );
              this.messageService.enviarMensaje('Actualizar Puntos Base', ['Puntos Base actualizado correctamente'],
                'info', this.dialogService);
        },
          err => {
            console.log(err);
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            this.messageService.enviarMensaje('Error actualizar puntos base', ['Error servicio actualizar puntos base'],
              'info', this.dialogService);
          }
        );
    }
  }

  searchInfoLoyaltyPay(idLoyaltyPaypoint: String, internatId: String, idStore: String) {
    console.log('Comienzo servicio de busqueda de Base Point');
    // Valido Campos y Fechas que no vengan Vacios
    this.loyaltypayService.searchInfoLoyaltyPay(+idLoyaltyPaypoint, +internatId, +idStore).subscribe(
      res => {
        console.log(res);
        this.messageService.cargando(false);
        this.resultLoyaltyPays = this.utils.validarRespuestaFormatear(res);
        console.log(this.resultLoyaltyPays);
        // this.resultLoyaltyPays = res.message.replace(/\n/ig, '');
        // this.resultLoyaltyPays = JSON.parse(this.resultLoyaltyPays.toString());
        if (this.resultLoyaltyPays.length === 0) {
          this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService );
        }
      },
      err => {
        console.log(err);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda'], 'info', this.dialogService);
        this.messageService.cargando(false);
      }
    );
  }

  searchInfoLoyaltyPayUpdate(idLoyaltyPayPoint: string) {
    console.log('Update');

    if (this.resultDetailLoyaltyPays !== []) {
      this.resultDetailLoyaltyPays = [];
    }

    this.messageService.cargando(true);
    // search detail LoyaltyPay
    this.loyaltypayService.searchInfoLoyaltyPayUpdate(+idLoyaltyPayPoint).subscribe(
      res => {
        console.log(res);
        this.resultDetailLoyaltyPays = this.utils.validarRespuestaFormatear(res);
        // this.resultDetailLoyaltyPays = res.message.replace(/\n/ig, '');
        // this.resultDetailLoyaltyPays = JSON.parse(this.resultDetailLoyaltyPays);
        console.log(this.resultDetailLoyaltyPays);
        this.messageService.cargando(false);
      },
      err => {
        console.log(err);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
        this.messageService.cargando(false);
      }
    );
    // open Modal
    this.myModalUpdateLoyaltyPay.open();
  }

  updateLoyaltyPay(idLoyaltyPayPoint: String, factor: String, factorSdv: String) {
    this.usuario = this.config[1].val;

    if (idLoyaltyPayPoint === '' || factor === '' || factorSdv === '') {
        this.messageService.enviarMensaje('Error Editar', ['Verifique que todos los campos esten completos'], 'info', this.dialogService);
    }  else if (!this.validationFactor(factor)) {
      this.messageService.enviarMensaje('Error Editar', ['Factor no válido, debe ser en formato 0.0000000000'], 'info', this.dialogService);
      return;
    } else if (!this.validationFactor(factorSdv)) {
      this.messageService.enviarMensaje('Error Editar',
      ['Factor SDV no válido, debe ser en formato 0.0000000000'], 'info', this.dialogService);
      return;
    } else {
        this.loadings = true;
        this.messageService.cargando(this.loadings);
        this.loyaltypayService.editLoyaltyPay(+idLoyaltyPayPoint, factor, factorSdv).subscribe(
          res => {
            console.log(res);
            this.resultLoyaltyPays = this.utils.validarRespuestaFormatear(res);
            // this.resultLoyaltyPays = res.message.replace(/\n/ig, '');
            // this.resultLoyaltyPays = JSON.parse(this.resultLoyaltyPays.toString());
            console.log(this.resultLoyaltyPays);
              this.loadings = false;
              this.myModalUpdateLoyaltyPay.close();
              this.loadings = false;
              this.messageService.cargando(this.loadings);
              // se inserta el log
              this.logService.insertLog(13, 0 , this.usuario.idUser  + '')
                .subscribe(
                  (response: any) => (this.ret = response),
                    error => () => {
                      console.log('error al insertar log');
                    },
                    () => {
                      console.log('insertamos log correctamente');
                      // this.utils.validarRespuesta(this.ret);
                    }
                );

              this.cleanResultLoyaltyPays();
              this.loadings = true;
              this.messageService.cargando(this.loadings);
              this.loyaltypayService.searchInfoLoyaltyPay(-1, -1, -1).subscribe(
              response => {
                console.log(response);
                this.resultLoyaltyPays = this.utils.validarRespuestaFormatear(response);
                // this.resultLoyaltyPays = response.message.replace(/\n/ig, '');
                // this.resultLoyaltyPays = JSON.parse(this.resultLoyaltyPays.toString());
                console.log(this.resultLoyaltyPays);
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                if (this.resultLoyaltyPays.length === 0) {
                  this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
                }
              },
              err => {
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                console.log(err);
                this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda'], 'info', this.dialogService);
              }
            );
            this.messageService.enviarMensaje('Actualizar Puntos por medio de pago', ['Puntos por medio de pago actualizado correctamente'],
              'info', this.dialogService);
        },
        err => {
          console.log(err);
          this.loadings = false;
          this.messageService.cargando(this.loadings);
          this.messageService.enviarMensaje('Error actualizar puntos por medio de pagos',
            ['Error servicio actualizar puntos por medio de pagos'], 'info', this.dialogService);
        }
      );
    }
  }

  validationEmail(email: any) {
    const EMAIL_REGEXP = /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/;
    console.log('validacion email : ' + email.toLowerCase());
    if (EMAIL_REGEXP.test(email.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  validationFactor(factor: any) {
    const FACTOR_REGEXP = /^[0]{1,1}([.][0-9]{1,10})?$/;
    console.log('validacion Factor : ' + factor.toString().replace(',', '.'));
    if (FACTOR_REGEXP.test(factor)) {
      return true;
    } else {
      return false;
    }
  }

  sortProperty(column) {
    this.currentColumn = this.orderProperty.slice(1);
    this.currentDirection = this.orderProperty.slice(0, 1);
    this.dir = '+';

    if (column === this.currentColumn) {
      this.dir = this.currentDirection === '+' ? '-' : '+';
    }
    this.orderProperty = this.dir + column;
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

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  cleanResults() {
    this.results = [];
    this.resultBasePoints = [];
    this.resultLoyaltyPays = [];
  }

  cleanResultBasePoints() {
    this.resultBasePoints = [];
  }

  cleanResultLoyaltyPays() {
    this.resultLoyaltyPays = [];
  }
}
