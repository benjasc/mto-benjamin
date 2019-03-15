import { Utils } from './../../../shared/utils/utils';
import { BitacoraService } from '../../services/bitacora.service';
import { Component, OnInit } from '@angular/core';
import { IMyDateModel } from 'mydatepicker';
import { DateFormat } from './dateFormat';
import { GLOBAL } from './../../../shared/services/global';
import * as XLSX from 'xlsx';
import { MessageService } from './../../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { Globals } from './../../../shared/utils/globals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss']
})
export class BitacoraComponent implements OnInit {

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
  listEvents: any;
  dir: any;
  loadings: boolean;
  results: Object[];
  editable: Boolean;
  utils: Utils;

  constructor(public bitacoraService: BitacoraService, public messageService: MessageService, public dialogService: DialogService,
    public globals: Globals, public router: Router) {
      this.pgCurrent = 1;
      this.pgrows = GLOBAL.paginador_rows;
      this.orderProperty = '+ordernumber';
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
  }

  ngOnInit() {
    this.messageService.cargando(true);
    console.log('Cargando eventos');
    this.bitacoraService.getEvents().subscribe(
      result => {
        console.log(result);
        this.listEvents = this.utils.validarRespuestaFormatear(result);
        // this.listEvents = result.message.replace(/\n/ig, '');
        // this.listEvents = JSON.parse(this.listEvents);
        this.listEvents = this.listEvents.listEvents;
        console.log(this.listEvents);
        this.messageService.cargando(false);
      },
      error => {
        console.log(<any>error);
      }
    );

    this.formatoFechaDesde = new DateFormat();
    this.formatoFechaHasta = new DateFormat();

    // Fecha Desde
    const d: Date = new Date();
    this.formatoFechaDesde.myDatePickerOptions.disableSince = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1};
    this.formatoFechaDesde.myDatePickerOptions.disableUntil = {year: d.getFullYear(), month: d.getMonth() - 12, day: d.getDate() };
    this.myDatePickerOptionsDesde = this.formatoFechaDesde.myDatePickerOptions;
    // Fecha Hasta
    this.formatoFechaHasta.myDatePickerOptions.disableSince = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1};
    this.formatoFechaHasta.myDatePickerOptions.disableUntil = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1};
    this.myDatePickerOptionsHasta = this.formatoFechaHasta.myDatePickerOptions;
  }

  cambiaFechaDesde(event: IMyDateModel) {
    // Fecha Hasta
    this.fechaCompraHasta = undefined;
    if (event.date.year ) {
      const d: Date = new Date();
      const d2: Date = new Date();
      this.myDatePickerOptionsCopy = Object.assign({}, this.formatoFechaHasta.myDatePickerOptions);
      this.formatoFechaHasta.myDatePickerOptions.disableSince = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1};
      this.myDatePickerOptionsCopy.disableUntil = {year: event.date.year, month: event.date.month, day: event.date.day - 1};
      const months = new Date(event.date.year + ',' + event.date.month + ',' + event.date.day).getMonth() - d.getMonth();
      const days =  event.date.day;

      const diasDif = new Date(event.date.year + ',' + event.date.month + ',' + event.date.day).getTime() - d.getTime();
      const dias = Math.round(diasDif / (1000 * 60 * 60 * 24));
      const meses = Math.round(dias / 31);

      if (+meses <= -3) {
        this.myDatePickerOptionsCopy.disableSince = {year: event.date.year, month: event.date.month  + 3, day: event.date.day + 1};
        if (days === 1) {
          this.myDatePickerOptionsCopy.disableUntil = {year: event.date.year, month: event.date.month, day: event.date.day};
        }
      } else {
        if (days === 1) {
          this.myDatePickerOptionsCopy.disableUntil = {year: event.date.year, month: event.date.month, day: event.date.day};
        }
      }
      this.myDatePickerOptionsHasta = this.myDatePickerOptionsCopy;
    }
    this.fechaCompraDesde = (event.date.year > 0) ? new Date(event.date.year + ',' + event.date.month + ',' + event.date.day) : undefined;
  }

  cambiaFechaHasta(event: IMyDateModel) {
    this.fechaCompraHasta = (event.date.year > 0) ? new Date(event.date.year + ',' + event.date.month + ',' + event.date.day) : undefined;
  }

  doSearch(idLog: String, idUser: String, idEvent: String, ordenCompra: String, nameLastName: String) {
    this.loadings = true;
    this.messageService.cargando(this.loadings);
    console.log('==' + this.fechaCompraDesde + '==' + this.fechaCompraHasta);
    // Validar que venga con fecha
    if (!this.fechaCompraDesde === undefined || this.fechaCompraHasta === undefined) {
      this.messageService.enviarMensaje('Error búsqueda', ['Debe ingresar el filtro de fechas'], 'info', this.dialogService);
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        return;
    }
    // Validar que venga almenos un campo
    if (idLog === '-1' && idUser === '-1' && idEvent === '-1' && ordenCompra === '' && nameLastName === ''
      && this.fechaCompraDesde === undefined  && this.fechaCompraHasta === undefined ) {
        this.messageService.enviarMensaje('Error búsqueda', ['Debe ingresar filtro de búsqueda'], 'info', this.dialogService);
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        return;
    } else if ((this.fechaCompraDesde != null && this.fechaCompraHasta == null) ||
      (this.fechaCompraDesde == null && this.fechaCompraHasta != null)) {
        this.messageService.enviarMensaje('Error búsqueda', ['Debe ingresar fecha Desde/Hasta'], 'info', this.dialogService);
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        return;
    }

    // Si se ingresaron fechas formatear
    if (this.fechaCompraDesde != null && this.fechaCompraHasta != null) {
      this.desdeString = this.leadingZero(this.fechaCompraDesde.getDate()) + '/' + this.leadingZero((this.fechaCompraDesde.getMonth() + 1))
      + '/' +  this.fechaCompraDesde.getFullYear();
      this.hastaString = this.leadingZero(this.fechaCompraHasta.getDate()) + '/' + this.leadingZero((this.fechaCompraHasta.getMonth() + 1))
      + '/' +  this.fechaCompraHasta.getFullYear();
    } else {
      this.desdeString = null;
      this.hastaString = null;
    }
      console.log('Cargando respuesta');
    this.bitacoraService.searchInfoBitacora('-1', idUser, idEvent, '-1', '-1',
    (this.desdeString != null ? this.desdeString : '-1'), ( this.hastaString != null ?  this.hastaString : '-1'),
    (ordenCompra !== '' ? ordenCompra : '-1'),  (nameLastName !== '' ? nameLastName : '-1')).subscribe(
      res => {
        console.log(res);
        this.results = this.utils.validarRespuestaFormatear(res);
        // this.results = res.message.replace(/\n/ig, '');
        // this.results = JSON.parse(this.results.toString());
        console.log(this.results);
        this.loadings = false;
        this.messageService.cargando(this.loadings);
      },
      err => {
         this.utils.errorRespuesta();
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        console.log(err);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda'], 'info', this.dialogService);
      }
    );
  }

  leadingZero(value) {
    if (value < 10) {
      return '0' + value.toString();
    }
    return value.toString();
  }

  doExport() {
    this.ws = XLSX.utils.aoa_to_sheet([['Bitacora']]);
    XLSX.utils.sheet_add_json(this.ws, this.results, {origin: 1});
    // workbook
    this.wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(this.wb, this.ws, 'Bitacora');
    // XLSX file
    XLSX.writeFile(this.wb, 'ExportarBitacora.xlsx');
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
    this.loadings = false;
    this.fechaCompraDesde = undefined;
    this.fechaCompraHasta = undefined;
  }
}
