import { Utils } from './../../../shared/utils/utils';
import { DateFormat } from './dateFormat';
import { EmailService } from './../../../shared/services/email.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyDateModel } from 'mydatepicker';
import { GLOBAL } from './../../../shared/services/global';
import { SearchService } from './../../../shared/services/searchservice';
import { MessageService } from './../../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { Globals } from './../../../../modulos/shared/utils/globals';
import { Usuario } from './../../../../modulos/shared/vo/usuario';
import { MenuProfile } from './../../../../modulos/shared/vo/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  menu: MenuProfile[];
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

  pgCurrent: Number;
  pgrows: Number;

  orderProperty: String;
  currentColumn: any;
  currentDirection: any;
  dir: any;
  formatRut: string;
  modelAccordion: Array<any> = [{ isAccordionOpen: false }];

  usuario: Usuario;
  config: any;
  ret: any;
  loadingForwardEmail: boolean;
  loadings: boolean;
  resultsEmailByOC: Object[];
  resultsDetail: any;
  results: Object[];
  editable: Boolean;
  url: String;
  utils: Utils;
  @ViewChild('myModalEmailInfo') myModalEmailInfo;

  constructor(public emailInfo: EmailService, public messageService: MessageService,
    public dialogService: DialogService, public searchInfoforEmail: SearchService,
    public globals: Globals, private router: Router) {
      this.pgCurrent = 1;
      this.pgrows = GLOBAL.paginador_rows;
      this.orderProperty = '+ordernumber';
      this.config = this.globals.getValue();
      this.resultsDetail = [];
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
  }

  // Rut
  cuerpoRut: string;
  dvRut: string;

  ngOnInit() {
    // Limpiar pantalla al ingresar
    this.cleanResults();

    // usuario
    this.usuario = this.config[1].val;

    // menu
    this.menu = this.config[2].val;

    // url
    this.url = this.router.url;

    // Modulos de acceso a ordenes
    console.log('Access : ' + JSON.stringify(this.menu) + ' / ' + this.usuario.idUser + ' / ' + this.router.url);
    for (let i = 0; i < this.menu.length; i++) {
      for (let j = 0; j < this.menu[i].subItems.length; j++) {
        console.log('Access Menu: ' + this.menu[i].idAccess + ' / ' + this.menu[i].idModule +
         ' / ' + this.menu[i].name + ' / ' + this.menu[i].url);

        console.log( 'Access SubMenu: ' + this.menu[i].subItems[j].idAccess + ' / ' + this.menu[i].subItems[j].idModule +
         ' / ' + this.menu[i].subItems[j].name + ' / ' + ' / ' + this.menu[i].subItems[j].url);

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
    console.log('Editable : ' + this.editable);
    const volverEmail = sessionStorage.getItem('volverEmail');
    const formEmailRut = sessionStorage.getItem('formEmailRut');
    const formEmailError = sessionStorage.getItem('formEmailError');
    const formEmailDni = sessionStorage.getItem('formEmailDni');
    const formEmailOrdenCompra = sessionStorage.getItem('formEmailOrdenCompra');
    const formEmailFechaDesde = sessionStorage.getItem('formEmailFechaDesde');
    const formEmailFechaHasta = sessionStorage.getItem('formEmailFechaHasta');
    console.log('volverEmail= ' + volverEmail);

    if (volverEmail === 'SI') {
      console.log('Se ejecuta boton volver Email');
      sessionStorage.removeItem('volverEmail');
      this.emailInfo.searchEmailBounced(formEmailRut, formEmailRut, formEmailOrdenCompra,
         formEmailFechaDesde, formEmailError, formEmailFechaHasta);
    } else {
      console.log('No se ha ejecutado el boton volver email');
    }

    this.formatoFechaDesde = new DateFormat();
    this.formatoFechaHasta = new DateFormat();

    // Fecha Desde
    const d: Date = new Date();
    this.formatoFechaDesde.myDatePickerOptions.disableSince = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate() + 1
    };
    this.formatoFechaDesde.myDatePickerOptions.disableUntil = {
      year: d.getFullYear(),
      month: d.getMonth() - 12,
      day: d.getDate()
    };
    this.myDatePickerOptionsDesde = this.formatoFechaDesde.myDatePickerOptions;
    // Fecha Hasta
    this.formatoFechaHasta.myDatePickerOptions.disableSince = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate() + 1
    };
    this.formatoFechaHasta.myDatePickerOptions.disableUntil = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate() + 1
    };
    this.myDatePickerOptionsHasta = this.formatoFechaHasta.myDatePickerOptions;
  }

  leadingZero(value) {
    if (value < 10) {
      return '0' + value.toString();
    }
    return value.toString();
  }

  doSearchEmail(rut: string, dni: string, ordenCompra: string, email: string) {
    this.emailInfo.loadings = true;
    console.log('Comienzo servicio de busqueda de email');
    // Valido Campos y Fechas que no vengan Vacios
    if (rut === '' && ordenCompra === '' && email === '' && this.fechaCompraDesde === undefined && this.fechaCompraHasta === undefined) {
      this.messageService.enviarMensaje('Error búsqueda', ['Debe ingresar filtro de búsqueda'], 'info', this.dialogService);
      return;
    } else if ((this.fechaCompraDesde != null && this.fechaCompraHasta == null) ||
      (this.fechaCompraDesde == null && this.fechaCompraHasta != null)) {
      this.messageService.enviarMensaje('Error búsqueda', ['Debe ingresar fecha Desde/Hasta'], 'info', this.dialogService);
      return;
    }
    console.log('Valido Fechas');
    // Formatear Fechas
    if (this.fechaCompraDesde != null && this.fechaCompraHasta != null) {
      this.desdeString = this.leadingZero(this.fechaCompraDesde.getDate()) + '/' + this.leadingZero(this.fechaCompraDesde.getMonth() + 1) +
        '/' + this.fechaCompraDesde.getFullYear();

      this.hastaString = this.leadingZero(this.fechaCompraHasta.getDate()) + '/' + this.leadingZero(this.fechaCompraHasta.getMonth() + 1) +
        '/' + this.fechaCompraHasta.getFullYear();
    } else {
      this.desdeString = null;
      this.hastaString = null;
    }

    // Quitar puntos, guion, dv del y validar RUT
    if (rut != null && rut !== '' && this.emailInfo.tipoDoc === 'rut') {
      rut = rut.split('.').join('');
      rut = rut.replace('-', '');

      this.cuerpoRut = rut.slice(0, -1);
      this.dvRut = rut.slice(-1).toUpperCase();

      if (!this.validarRut(this.cuerpoRut, this.dvRut)) {
        this.messageService.enviarMensaje('Error búsqueda', ['Rut no válido'], 'info', this.dialogService);
        return;
      }
      console.log('buscando por rut : ' + rut);
      rut = this.cuerpoRut;
    } else {
      rut = '';
    }

    if (email != null && email !== '') {
      if (!this.validationEmail(email)) {
        this.messageService.enviarMensaje('Error búsqueda', ['Email no válido'], 'info', this.dialogService);
        return;
      }
    }

    if (dni != null && dni !== '' && this.emailInfo.tipoDoc === 'dni') {
      console.log('buscando por dni : ' + dni);
    } else {
      dni = null;
    }

    if (rut != null) {
      sessionStorage.setItem('formEmailRut', rut);
    } else {
      sessionStorage.removeItem('formEmailRut');
    }
    if (dni != null) {
      sessionStorage.setItem('formEmailDni', dni);
    } else {
      sessionStorage.removeItem('formEmailDni');
    }
    if (ordenCompra != null) {
      sessionStorage.setItem('formEmailOrdenCompra', ordenCompra);
    } else {
      sessionStorage.removeItem('formEmailOrdenCompra');
    }
    if (email != null) {
      sessionStorage.setItem('formEmailError', email);
    } else {
      sessionStorage.removeItem('formEmailError');
    }

    if (this.desdeString === null) {
      sessionStorage.removeItem('formEmailFechaDesde');
    } else {
      sessionStorage.setItem('formEmailFechaDesde', '' + this.desdeString);
    }
    if (this.hastaString === null) {
      sessionStorage.removeItem('formEmailFechaHasta');
    } else {
      sessionStorage.setItem('formEmailFechaHasta', '' + this.hastaString);
    }
    this.emailInfo.searchEmailBounced(rut, dni, ordenCompra, this.desdeString, email, this.hastaString)
    .subscribe(
      res => {
        console.log(res);
        this.emailInfo.results = this.utils.validarRespuestaFormatear(res);
        // this.emailInfo.results = res.message.replace(/\n/ig, '');
        // this.emailInfo.results = JSON.parse(this.emailInfo.results.toString());
        console.log(this.emailInfo.results);
        // console.log(res);
        // res = this.utils.validarRespuesta(res);
        // this.emailInfo.results = res.message.replace(/\n/ig, '');
        // this.emailInfo.results = JSON.parse(this.emailInfo.results.toString());
        // console.log(this.emailInfo.results);
      },
      err => {
        this.utils.errorRespuesta();
        console.log('error: ' + err);
      }
    );
  }

  doEmailDetail(oc: string) {
    this.resultsDetail = [];
    this.resultsEmailByOC = [];
    this.loadings = true;
    this.messageService.cargando(this.loadings);

    this.searchInfoforEmail.searchDetail(oc).subscribe(
      res => {
          console.log(res);
          this.resultsDetail = this.utils.validarRespuestaFormatear(res);
          // this.resultsDetail = res.message.replace(/\n/ig, '');
          // this.resultsDetail = JSON.parse(this.resultsDetail);
          console.log(this.resultsDetail);
          this.loadings = false;
          this.messageService.cargando(this.loadings);
      },
      err => {
        this.utils.errorRespuesta();
        console.log(err);
      }
    );

    // search detail order
    // this.searchInfoforEmail.searchDetail(oc);
      this.emailInfo.detailEmailByOC(oc).subscribe(
        res => {
          console.log(res);
          this.resultsEmailByOC = this.utils.validarRespuestaFormatear(res);
          // this.resultsEmailByOC = res.message.replace(/\n/ig, '');
          // this.resultsEmailByOC = JSON.parse(this.resultsEmailByOC.toString());
          if (this.resultsEmailByOC.length === 0) {
            this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
          }
        },
        err => {
          this.utils.errorRespuesta();
          console.log(err);
        }
      );
    // this.emailInfo.detailEmailByOC(oc);

    // open Modal
    this.myModalEmailInfo.open();
  }

  reenviarEmail(endpoints: string, oc: string, emailType: string, orderType: string, idFailedEmail: Number) {
    // argumento '0' buscar agrupado, '1' todos
    this.emailInfo.forwardEmail(oc, endpoints, emailType, orderType, idFailedEmail, this.usuario.idUser + '');
  }

  reenviarEmailFailed(endpoints: string, oc: string, emailType: string, orderType: string, agrupar: string, idFailedEmail: Number) {
    console.log('reenviarEmailFailed');
    this.loadings = true;
    this.messageService.cargando(this.loadings);
    this.emailInfo.forwardEmailFailed(oc, endpoints, agrupar, emailType, orderType, idFailedEmail).subscribe(
      res => {
        console.log(res);
        this.utils.validarRespuestaFormatear(res);
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        this.myModalEmailInfo.close();

        // this.cleanResults();
        this.resultsEmailByOC = [];

        // search detail order
        console.log('recargar dropdown oc : ' + oc);
        // this.searchInfo.searchDetail(oc);
      if (agrupar === '1') {
        this.loadings = true;
        this.messageService.cargando(this.loadings);
        this.emailInfo.detailAllEmailByOCFailed(oc).subscribe(
          resDetailAllEmailByOC => {
            console.log(resDetailAllEmailByOC);
            this.resultsEmailByOC = this.utils.validarRespuestaFormatear(resDetailAllEmailByOC);
            console.log(this.resultsEmailByOC);
            // this.resultsEmailByOC = resDetailAllEmailByOC;
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            if (this.resultsEmailByOC.length === 0) {
              this.loadings = false;
              this.messageService.cargando(this.loadings);
              this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
            }
          },
          err => {
            this.utils.errorRespuesta();
            console.log(err);
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda'], 'info', this.dialogService);
          }
        );
        } else {
          this.loadings = true;
          this.messageService.cargando(this.loadings);
          this.emailInfo.detailEmailByOCFailed(oc).subscribe(
            resDetailEmailByOC => {
              console.log('Imprimiendo');
              console.log(resDetailEmailByOC);
              this.resultsEmailByOC = this.utils.validarRespuestaFormatear(resDetailEmailByOC);
              // this.resultsEmailByOC = resDetailEmailByOC.message.replace(/\n/ig, '');
              // this.resultsEmailByOC = JSON.parse(this.resultsEmailByOC.toString());
              console.log(this.resultsEmailByOC);
              this.loadings = false;
              this.messageService.cargando(this.loadings);
              if (this.resultsEmailByOC.length === 0) {
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
              }
            },
            err => {
              this.utils.errorRespuesta();
              console.log(err);
              this.loadings = false;
              this.messageService.cargando(this.loadings);
              this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda'], 'info', this.dialogService);
            }
          );
        }
        this.messageService.enviarMensaje('Email Envío', ['Se ha reenviado el correo exitosamente'], 'info', this.dialogService);
      },
      err => {
        console.log(err);
        this.utils.errorRespuesta();
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        this.messageService.enviarMensaje('Error Envio', ['Error en reenvio de correo'], 'info', this.dialogService);
      }
    );
  }

  updateEmailCustomer(oldMail: String, oc: string, email: string) {
    this.usuario = this.config[1].val;

    if (!this.validationEmail(email)) {
      this.messageService.enviarMensaje('Error búsqueda', ['Email no válido'], 'info', this.dialogService);
      return;
    } else {
      this.loadings = true;
      this.messageService.cargando(this.loadings);
      this.emailInfo.editMailInfo(oc, email, oldMail, this.usuario.idUser + '').subscribe(
        res => {
          console.log(res);
          this.results = this.utils.validarRespuestaFormatear(res);
          console.log(this.results);
          // this.results = res;
          this.loadings = false;
          this.messageService.cargando(this.loadings);
          if (this.results === null) {
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            this.messageService.enviarMensaje('Error actualizar mail', ['Error Actualizar Campo Email'], 'info', this.dialogService);
          } else {
            this.loadings = false;
            this.messageService.cargando(this.loadings);

            // Recargo modal
            this.resultsDetail = [];
            this.loadings = true;
            this.messageService.cargando(this.loadings);
            this.searchInfoforEmail.searchDetail(oc).subscribe(
              resSearchDetail => {
                console.log(resSearchDetail);
                this.resultsDetail = this.utils.validarRespuestaFormatear(resSearchDetail);
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                // this.resultsDetail = resSearchDetail.message.replace(/\n/ig, '');
                // this.resultsDetail = JSON.parse(this.resultsDetail);
                console.log(this.resultsDetail);
                // this.resultsDetail = resSearchDetail;
              },
              err => {
                console.log(err);
                this.utils.errorRespuesta();
                this.loadings = false;
                this.messageService.cargando(this.loadings);
                this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
              }
            );

            this.messageService.enviarMensaje('Actualizar Mail', ['Campo email actualizado correctamente'], 'info', this.dialogService);
          }
        },
        err => {
          console.log(err);
          this.utils.errorRespuesta();
          this.loadings = false;
          this.messageService.cargando(this.loadings);
          this.messageService.enviarMensaje('Error actualizar mail', ['Error servicio actualizar mail'], 'info', this.dialogService);
        }
      );
    }
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

  validationEmail(email: any) {
    const EMAIL_REGEXP = /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/;
    console.log('validacion email : ' + email.toLowerCase());
    if (EMAIL_REGEXP.test(email.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  validarRut(cuerpoIn: any, dvIn: string) {
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
    return event.charCode === 8 || event.charCode === 0 ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  selectTipoDoc(tipoDocSelected: string) {
    this.emailInfo.tipoDoc = tipoDocSelected;
  }

  cleanResults() {
    this.emailInfo.cleanResults();
    this.results = [];
    this.resultsDetail = [];
    this.loadings = false;
    this.fechaCompraDesde = undefined;
    this.fechaCompraHasta = undefined;
    sessionStorage.removeItem('volverIc');
    sessionStorage.removeItem('volverSearch');
  }
}
