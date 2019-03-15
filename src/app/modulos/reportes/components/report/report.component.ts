import { Utils } from './../../../shared/utils/utils';
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/reportservice';
import { IMyDateModel } from 'mydatepicker';
import { DateFormat } from './dateFormat';
import { GLOBAL } from './../../../shared/services/global';
import * as XLSX from 'xlsx';

import { MessageService } from './../../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  fechaCompraDesde: Date;
  fechaCompraHasta: Date;
  desdeString: String;
  hastaString: String;

  // Paginador
  pgCurrent: Number;
  pgrows: Number;

  // Exportar
  ws: XLSX.WorkSheet;
  wb: XLSX.WorkBook;

  // ordenar
  orderProperty: String;
  currentColumn: any;
  currentDirection: any;
  dir: any;

  // datePicker
  myDatePickerOptionsDesde: any;
  myDatePickerOptionsHasta: any;
  myDatePickerOptionsCopy: any;
  formatoFechaDesde: DateFormat;
  formatoFechaHasta: DateFormat;

  public listChannels: any;
  public listTypeOrders: any;
  public listDocumentTypes: any;
  utils: Utils;
  results: any;

  constructor(public reportInfo: ReportService, public messageService: MessageService,
    public dialogService: DialogService, private router: Router) {
      this.pgCurrent = 1;
      this.pgrows = GLOBAL.paginador_rows;
      this.orderProperty = '+ordernumber';
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
      this.results = [];
    }

  ngOnInit() {
    this.messageService.cargando(true);
    this.cleanResults();

    this.formatoFechaDesde = new DateFormat();
    this.formatoFechaHasta = new DateFormat();

    // Fecha Desde
    const d: Date = new Date();
    this.formatoFechaDesde.myDatePickerOptions.disableSince = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1};
    this.formatoFechaDesde.myDatePickerOptions.disableUntil = {year: d.getFullYear(), month: d.getMonth() - 12, day: d.getDate()};
    this.myDatePickerOptionsDesde = this.formatoFechaDesde.myDatePickerOptions;

    // Se inicializa los combos
    console.log('Cargando Canales');
    this.reportInfo.getChannel(1).subscribe(
      result => {
        console.log(result);
        this.listChannels = this.utils.validarRespuestaFormatear(result);
        // console.log('entramos a un status 200 getChannel');
        // this.listChannels = result.message.replace(/\n/ig, '');
        // this.listChannels = JSON.parse(this.listChannels);
        this.listChannels = this.listChannels.listChannels;
        console.log(this.listChannels);
      },
      error => {
        console.log(<any>error);
      }
    );

    console.log('Cargando Tipo de flujo');
    this.reportInfo.getOrderType().subscribe(
      result => {
        console.log(result);
        this.listTypeOrders = this.utils.validarRespuestaFormatear(result);
        // console.log('entramos a un status 200 getOrderType');
        // this.listTypeOrders = result.message.replace(/\n/ig, '');
        // this.listTypeOrders = JSON.parse(this.listTypeOrders);
        this.listTypeOrders = this.listTypeOrders.listTypeOrders;
        console.log(this.listTypeOrders);
      },
      error => {
        console.log(<any>error);
      }
    );

    console.log('Cargando Tipo de documento');
    this.reportInfo.getDocumentType().subscribe(
      result => {
        console.log(result);
        this.listDocumentTypes = this.utils.validarRespuestaFormatear(result);
        console.log('entramos a un status 200 getDocumentType');
        // this.listDocumentTypes = result.message.replace(/\n/ig, '');
        // this.listDocumentTypes = JSON.parse(this.listDocumentTypes);
        this.listDocumentTypes = this.listDocumentTypes.listDocumentTypes;
        this.messageService.cargando(false);
        console.log(this.listDocumentTypes);
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  cambiaFechaDesde(event: IMyDateModel) {
      // Fecha Hasta
      this.fechaCompraHasta = undefined;

      if (event.date.year > 0) {
        const d: Date = new Date();
        this.myDatePickerOptionsCopy = Object.assign({}, this.formatoFechaHasta.myDatePickerOptions);
        this.formatoFechaHasta.myDatePickerOptions.disableSince = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1};
        this.myDatePickerOptionsCopy.disableUntil = {year: event.date.year, month: event.date.month, day: event.date.day - 1};
        this.myDatePickerOptionsHasta = this.myDatePickerOptionsCopy;
      }
      this.fechaCompraDesde = (event.date.year > 0) ?
      new Date(event.date.year + ',' + event.date.month + ',' + event.date.day) : undefined;
  }

  doSearch(documentType: number , channel: number , typeOrder: number) {
    this.messageService.cargando(true);
      console.log('documentType>>' + documentType + 'channel>>' + channel + 'typeOrder>>' + typeOrder);

      // Validar que venga almenos un campo
      if ( this.fechaCompraDesde === undefined ) {
          this.messageService.enviarMensaje('Error búsqueda', ['Debe ingresar fecha'], 'info', this.dialogService);
          this.messageService.cargando(false);
          return;
      }
      // Validar sku largo minimo 6

      // Si se ingresaron fechas formatear
      if (this.fechaCompraDesde != null ) {
       this.desdeString = this.leadingZero(this.fechaCompraDesde.getDate()) + '/' + this.leadingZero((this.fechaCompraDesde.getMonth() + 1))
        + '/' +  this.fechaCompraDesde.getFullYear();
      } else {
        this.desdeString = null;
        this.hastaString = null;
      }

      console.log('Cargando respuesta');

      this.reportInfo.search(documentType, channel, typeOrder, this.desdeString, this.desdeString).subscribe(
        res => {
          console.log(res);
          this.results = this.utils.validarRespuestaFormatear(res);
          // this.results = res.message.replace(/\n/ig, '');
          // this.results = JSON.parse(this.results);
          console.log(this.results);
          this.messageService.cargando(false);
        },
        err => {
          console.log(<any>err);
          this.messageService.cargando(false);
          this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
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
    this.ws = XLSX.utils.aoa_to_sheet([['Report Quiebre de Stock']]);
    XLSX.utils.sheet_add_json(this.ws, this.results, {origin: 1});
    // workbook
    this.wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(this.wb, this.ws, 'Report Quiebre de Stock');
    // XLSX file
    XLSX.writeFile(this.wb, 'Exportar_Quiebre_Stock.xlsx');
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

  cleanResults() {
    this.fechaCompraDesde = undefined;
    this.fechaCompraHasta = undefined;
    sessionStorage.removeItem('volverIc');
    sessionStorage.removeItem('volverEmail');
  }
}
