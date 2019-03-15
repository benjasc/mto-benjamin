import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/reportservice';
import { GLOBAL } from './../../../shared/services/global';
import * as XLSX from 'xlsx';

import { MessageService } from './../../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { Globals } from './../../../shared/utils/globals';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils/utils';

@Component({
  selector: 'app-report-error-upate-eom',
  templateUrl: './report-error-upate-eom.component.html',
  styleUrls: ['./report-error-upate-eom.component.scss']
})
export class ReportErrorUpateEomComponent implements OnInit {

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
  results: any;
  utils: Utils;

  constructor(public reportInfo: ReportService, public messageService: MessageService,
    public dialogService: DialogService,  public globals: Globals, private router: Router) {
      this.pgCurrent = 1;
      this.pgrows = GLOBAL.paginador_rows;
      this.orderProperty = '+ordernumber';
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
      this.results = [];
  }

  ngOnInit() {
    this.messageService.cargando(true);
    // this.cleanResults();
    this.reportInfo.searchUpdateEom(null, null, null, null, null).subscribe(
      res => {
        console.log(res);
        this.results = this.utils.validarRespuestaFormatear(res);
        // this.results = res.message.replace(/\n/ig, '');
        // this.results = JSON.parse(this.results);
        // this.results = this.results;
        console.log(this.results);
      },
      err => {
        console.log(<any>err);
        this.utils.errorRespuesta();
      }
    );
  }

  doExport() {
    this.ws = XLSX.utils.aoa_to_sheet([['Report Error Actualizacion EOM']]);

       XLSX.utils.sheet_add_json(this.ws, this.results, {origin: 1});

    // workbook
    this.wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(this.wb, this.ws, 'Report Quiebre de Stock');

    // XLSX file
    XLSX.writeFile(this.wb, 'Exportar_Error_Act_EOM.xlsx');
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
}
