import { Component, OnInit} from '@angular/core';
import { GLOBAL } from './../../../shared/services/global';
import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-report-info-order',
  templateUrl: './report-info-order.component.html',
  styleUrls: ['./report-info-order.component.scss']
})
export class ReportInfoOrderComponent implements OnInit {

  // Paginador
  pgCurrent: Number;
  pgrows: Number;

  // ordenar
  orderProperty: String;
  currentColumn: any;
  currentDirection: any;
  dir: any;

  public dateList = [];

  public dowload_productos_url: string;
  public dowload_reporteMediosPago_url: string;
  public dowload_reporteNovios_url: string;
  public dowload_reporteFonoCompra_url: string;

  constructor() {
      this.pgCurrent = 1;
      this.pgrows = GLOBAL.paginador_rows;
      this.orderProperty = '+fecha';
      this.dowload_productos_url = environment.dowload_productos_url;
      this.dowload_reporteMediosPago_url = environment.dowload_reporteMediosPago_url;
      this.dowload_reporteNovios_url = environment.dowload_reporteNovios_url;
      this.dowload_reporteFonoCompra_url = environment.dowload_reporteFonoCompra_url;
  }

  ngOnInit() {
    this.dateLista();
  }

  dateLista() {
    const fechaInicio: Date = new Date();
    const fechaFin: Date = new Date(new Date().setMonth(fechaInicio.getMonth() - 1));
    do {
      const fechaFinAll = new Date(fechaFin.setDate(fechaFin.getDate() + 1));
      const fechaFinPush = new Date(fechaFinAll.setDate(fechaFinAll.getDate()  - 2 ));
      this.dateList.push(fechaFinPush.toLocaleDateString('en-GB'));
      console.log(fechaFinAll.toLocaleDateString());
    } while (fechaFin.getTime() <= fechaInicio.getTime());
    this.dateList.reverse();
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

  downloadServiceReport(fecha, url) {
    console.log('fecha ' + fecha + ' url ' + url);
    console.log(fecha.substring(0, 2) + '-' + fecha.substring(3, 5) + '-' + fecha.substring(7, 10));
    const dateReport = fecha.substring(6, 10) + '-' + fecha.substring(3, 5) + '-' + fecha.substring(0, 2);
    const urlService = url + '' + dateReport + '.csv';
    console.log('dateReport ' + dateReport);
    console.log('urlService ' + urlService);
    const https = '' + urlService;
    window.open(https);
  }
}
