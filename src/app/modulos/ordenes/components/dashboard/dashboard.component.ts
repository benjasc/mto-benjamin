import { Utils } from './../../../shared/utils/utils';
import { DialogService } from 'ng2-bootstrap-modal';
import { MessageService } from './../../../shared/services/message.service';
import { FrequencyData } from './../../../../modulos/ordenes/vo/FrequencyData';
import { DashboardService } from './../../services/dashboard.service';
import { Autentication } from './../../../shared/vo/autentication';
import { Globals } from './../../../shared/utils/globals';
import { Component, OnInit, ViewEncapsulation, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { merge } from 'lodash';
import { MenuProfile } from './../../../shared/vo/menu';
import { Usuario } from './../../../shared/vo/usuario';
import { Router } from '@angular/router';
import { ResumenVentas } from '../../vo/ResumenVentas';
import { finalize } from 'rxjs/operators';
import { DespachoDias, Despacho, OrdenCompra } from '../../vo/DashboardVo';
import { ConversorPipe } from '../../../../pipe/conversor.pipe';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {
  private menu: MenuProfile[];
  ret;
  recibidas;
  recibidasDone = false;
  recibidasFallidas;
  recibidasFallidasDone;
  odCreadas;
  odCreadasDone = false;
  odCreadasFallidas;
  odCreadasFallidasDone;
  dteCreadas;
  dteCreadasDone = false;
  dteCreadasFallidas;
  dteCreadasFallidasDone;
  sdv;
  sdvDone = false;
  sdvFallidas;
  sdvFallidasDone;
  cerradas;
  cerradasDone = false;
  cerradasFallidas;
  cerradasFallidasDone;
  promedio;
  promedioFallidas;
  montoWeb;
  totalOrdersWeb;
  montoWebDone = false;
  payments;
  frequencyDistribution;
  dataFrequency = false;
  frequencyData: FrequencyData;
  config: any[];
  logoApp: any;
  tiempoProcesamiento: { label: string; percentage: string; number: number; increment: number; }[];
  inconsistencias: any;
  labels: any;
  private menuOpen: boolean;

  autentication: Autentication;

  // colores empresas
  private easy = 'easy';
  private paris = 'paris';
  private johnson = 'johnson';

  // colores grafico
  private chartColorOne: string;
  private chartColorTwo: string;

  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartOptions: any;
  public lineChartColors: Array<any>;
  public lineChartData: Array<any>;
  public lineChartLabels: Array<any>;

  // grafico bar options
  public barChartLabels: string[];
  public barChartType: string;
  public barChartLegend: boolean;
  public barChartOptions: any;
  public barChartData: any[];
  public barChartColors: any[];

  public baseColor: string;

  public estandarCnt: number;
  public progCnt: number;
  public noviosCnt: number;
  public pickupCnt: number;
  public preventaCnt: number;
  public prevPickCnt: number;
  public progPickCnt: number;
  public recaCnt: number;

  public ltErroneousCounts: any;
  public ltErroneousCounts2: any;
  public today: Date;
  private loadingCount: number;
  loadingMap: Map<string, boolean>;

  listingBySalesChannels: any;

  usuario: Usuario;
  logo: any;
  isModalActive = false;
  editable: Boolean;
  url: String;
  utils: Utils;

  resumenVentas: ResumenVentas;
  // tslint:disable-next-line:no-inferrable-types
  paymentsLoading: boolean = true;
  despachoDias: DespachoDias[] = [];
  ordenesCompra: OrdenCompra[] = [];
  // tslint:disable-next-line:no-inferrable-types
  despachoFlag: boolean = true;
  despachoFecha1: Date = new Date();
  despachoFecha2: Date = new Date();
  despachoFecha3: Date = new Date();
  totalSFC: number;
  erroneousOEM: any;
  cargando: number; // esta variable es para verificar si todos los metodos cargaron(onInit)

  constructor(public renderer: Renderer2, public globals: Globals, public dashBoardService: DashboardService,
    public router: Router, private messageService: MessageService, public dialogService: DialogService, public conversorPipe: ConversorPipe,
    @Inject(DOCUMENT) public document: any) {
      this.config = this.globals.getValue();
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
      this.today = new Date();
      this.cargando = 1;
      if (this.config.length > 0) {
        this.logo  = this.config[0].theme;
        this.usuario = this.config[1].val;
      } else {
        this.router.navigate(['/']);
      }
  }

  ngOnInit() {
    this.messageService.cargando(true);
    this.loadingMap = new Map();
    // usuario
    this.usuario = this.config[1].val;
    // menu
    this.menu = this.config[2].val;
    this.url = this.router.url;
    const cadena = sessionStorage.getItem('cadena');
    /*console.log('Access : '  + JSON.stringify(this.menu) + ' / ' + this.usuario.idUser +  ' / '
      + this.router.url + ' / cadena :  ' + cadena);*/

    for (let i = 0; i < this.menu.length; i++) {
      for (let j = 0; j < this.menu[i].subItems.length; j++) {
      /*  console.log('Access Menu: ' + this.menu[i].idAccess + ' / ' + this.menu[i].idModule
        + ' / ' + this.menu[i].name + ' / ' +  this.menu[i].url);

        console.log('Access SubMenu: ' + this.menu[i].subItems[j].idAccess + ' / ' + this.menu[i].subItems[j].idModule
        + ' / ' + this.menu[i].subItems[j].name + ' / '  + ' / ' + this.menu[i].subItems[j].url);*/

        if (this.router.url === this.menu[i].subItems[j].url) {
          if (this.menu[i].subItems[j].idAccess > 2) {
            console.log('true');
            this.editable = true;
          } else {
            console.log('false');
            this.editable = false;
          }
        }
      }
    }
    // console.log('Editable : ' + this.editable);

    if (this.router.url === '/back-office/dashboard') {
          console.log('url: ' + this.router.url);
    }

    sessionStorage.removeItem('volverEmail');
    sessionStorage.removeItem('volverIc');
    // 1 -- ingreso oc
    // 12 -- creacion od
    // 2 -- dte
    // 4 -- sdv
    // 10 -- fin de flujo
    this.recibidas = 0;
    this.odCreadas = 0;
    this.dteCreadas = 0;
    this.sdv = 0;
    this.cerradas = 0;

    this.estandarCnt = 0;
    this.progCnt = 0;
    this.noviosCnt = 0;
    this.pickupCnt = 0;
    this.preventaCnt = 0;
    this.prevPickCnt = 0;
    this.progPickCnt = 0;
    this.recaCnt = 0;

     // MODIFICAR
    this.totalSFC = 2456;
    // tslint:disable-next-line:prefer-const
    let ordenSFC = {
      concepto: 'Exportadas de SFC',
      cantidad: this.totalSFC,
      porcentaje: 100,
      idx: 0
    };
    this.ordenesCompra.push(ordenSFC);
    // CIERRE MODIFICAR

    // BEGIN DASHBOARD VIEJO

    this.callTotalStatusService(100, 1, +cadena);
    this.callTotalStatusService(0, 1, +cadena);
    this.callTotalStatusService(1, 1, +cadena);
    this.callTotalStatusService(2, 1, +cadena);
    this.callTotalStatusService(4, 1, +cadena);

    // Erroneos
    this.callGetTotalFailedService(1, 1, +cadena);
    this.callGetTotalFailedService(12, 1, +cadena);
    this.callGetTotalFailedService(2, 1, +cadena);
    this.callGetTotalFailedService(4, 1, +cadena);
    this.callGetTotalFailedService(10, 1, +cadena);

    // END DASHBOARD VIEJO

    this.callGetFrequencyDistributionService(100, 1, +cadena);

    this.callGetTotalAmountByChannelService(1, 100);
    this.callGetTotalAmountByPaymentMethodService(100, 1, +cadena);


    // BEGIN DASHBOARD NUEVO

    // this.callGetShippingOrdersDays(3, +cadena);
    // this.callGetOrdersWithErrorsCount();

    // END DASHBOARD NUEVO


    this.menuOpen = false;
    this.config = this.globals.getValue();
    this.logoApp = this.config[0].theme;
    this.autentication = this.config[0].autentication;

    // lista de colores Grafico
    const color = this.config[0].chartColorOne;
    const color2 = this.config[0].chartColorTwo;

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false
      },
      lineChartLegendchartjs: {
        display: false
      },
      legend: {
        display: false
      },
      tooltips: {
        titleFontColor: color,
        backgroundColor: '#fff',
        bodyFontColor: '#546E7A',
        titleFontSize: 15,
        borderColor: this.hexToRgbA(color, '0.2'),
        borderWidth: 1,
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            fontColor: color,
            fontSize: 16,
            labelString: 'Horas'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            fontColor: color,
            fontSize: 16,
            labelString: 'Cantidad'
          },
          ticks: {
            min: 0,
          }
        }]
      }
    };

    this.lineChartColors = [
      {
        backgroundColor: this.hexToRgbA(color2, '0.2'),
        borderColor: this.hexToRgbA(color2, '1'),
        pointBackgroundColor: this.hexToRgbA(color2, '1'),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: this.hexToRgbA(color2, '0.8')
      }
    ];

    this.inconsistencias = [
      {
        label: 'SFCC ',
        percentage: '35',
        number: 359,
        increment: -20,
      },
      {
        label: 'EOM',
        percentage: '68',
        number: 68,
        increment: 33,
      },
      {
        label: 'SDV',
        percentage: '35',
        number: 359,
        increment: -20,
      },
      {
        label: 'PPL',
        percentage: '68',
        number: 68,
        increment: 33,
      },
      {
        label: 'e-MAILS',
        percentage: '10',
        number: 18,
        increment: 33,
      },
      {
        label: 'GC',
        percentage: '0',
        number: 8,
        increment: -33,
      }
    ];

    this.tiempoProcesamiento = [{label: 'SFCC ', percentage: '35', number: 359.6, increment: -20, },
      {label: 'EOM', percentage: '68', number: 68, increment: 33, },
      {label: 'SDV', percentage: '35', number: 359, increment: -20, },
      {label: 'PPL', percentage: '68', number: 68, increment: 33, },
      {label: 'e-MAILS', percentage: '10', number: 18, increment: 33, },
      {label: 'GC', percentage: '0', number: 8, increment: -33, }
    ];

    // BAR
    this.barChartOptions = {scaleShowVerticalLines: false, responsive: true, maintainAspectRatio: false};

    this.barChartLabels = ['Estándar', 'Programado', 'Novios', 'Pickup', 'Preventa', 'Preventa Pickup', 'Recaudación', 'Programado Pickup'];
    this.barChartType = 'bar';
    this.barChartLegend = true;

    this.barChartColors = [
      {
        backgroundColor: this.hexToRgbA(color, '1'),
        borderColor: this.hexToRgbA(color, '1'),
        pointBackgroundColor: this.hexToRgbA(color, '1'),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: this.hexToRgbA(color, '0.8')
      },
      {
        backgroundColor: this.hexToRgbA(color2, '1'),
        borderColor: this.hexToRgbA(color2, '1'),
        pointBackgroundColor: this.hexToRgbA(color2, '1'),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: this.hexToRgbA(color2, '0.8')
      }
    ];
  }

    callTotalStatusService(state, store, channel) {
    // console.log('state ' + state + 'store ' + store + 'channel' + channel);
    this.recibidas = 0;
    this.recibidasDone = true;
    this.odCreadas = 0;
    this.odCreadasDone = true;
    this.dteCreadas = 0;
    this.dteCreadasDone = true;
    this.sdv = 0;
    this.sdvDone = true;
    this.cerradas = 0;
    this.cerradasDone = true;
    let orden: OrdenCompra;

    this.dashBoardService.getTotalStatus(state, store, channel).subscribe(
      (res: any) => this.ret = res,
      error => () => {
        this.cargando = this.utils.validarCarga(this.cargando, 12);
        console.log('error del servicio');
      },
      () => {
          // tslint:disable-next-line:prefer-const
          let recibidaFallida = this.utils.validarRespuestaFormatear(this.ret);
            if (recibidaFallida !== '[]') {
              recibidaFallida.forEach(reg => {
                  // console.log('orderType : ' + reg.orderType + 'cantidad : ' + reg.countStatus);
                  if (state === 0) {
                    this.recibidas = reg.countStatus + this.recibidas;
                    this.recibidasDone = true;
                  } else if (state === 1) {
                    this.odCreadas = reg.countStatus + this.odCreadas;
                    this.odCreadasDone = true;
                  } else if (state === 2) {
                    this.dteCreadas = reg.countStatus + this.dteCreadas;
                    this.dteCreadasDone = true;
                  } else if (state === 4) {
                    this.sdv = reg.countStatus + this.sdv;
                    this.sdvDone = true;
                  } else if (state === 100) {

                    if (reg.orderType === 1) { // estandar
                      this.estandarCnt = this.estandarCnt + reg.countStatus;
                    } else if (reg.orderType === 2) { // programado
                      this.progCnt = this.progCnt + reg.countStatus;
                    } else if (reg.orderType === 3) { // novios
                      this.noviosCnt = this.noviosCnt + reg.countStatus;
                    } else if (reg.orderType === 4) { // pickup
                      this.pickupCnt = this.pickupCnt + reg.countStatus;
                    } else if (reg.orderType === 5) { // preventa
                      this.preventaCnt = this.preventaCnt + reg.countStatus;
                    } else if (reg.orderType === 6) { // preventa pickup
                      this.prevPickCnt = this.prevPickCnt + reg.countStatus;
                    } else if (reg.orderType === 7) { // recaudacion
                      this.recaCnt = this.recaCnt + reg.countStatus;
                    } else if (reg.orderType === 9) { // Programado Pickup
                      this.progPickCnt = this.progPickCnt + reg.countStatus;
                    }

                    this.cerradas = reg.countStatus + this.cerradas;
                    this.cerradasDone = true;
                  }
                });
                  if (state === 100) {
                    // tslint:disable-next-line:prefer-const
                    let percent = (this.cerradas * 100) / this.totalSFC;
                    orden = {
                      concepto: 'Procesadas',
                      cantidad: this.cerradas,
                      porcentaje: percent,
                      idx: 1
                    };
                    this.ordenesCompra.push(orden);
                  }
                  if (state === 0) {
                    // tslint:disable-next-line:prefer-const
                    let enProceso = this.recibidas - this.cerradas;
                    // tslint:disable-next-line:prefer-const
                    let percent = (enProceso * 100) / this.totalSFC;
                    orden = {
                      concepto: 'En Proceso',
                      cantidad: enProceso,
                      porcentaje: percent,
                      idx: 2
                    };
                    this.ordenesCompra.push(orden);
                  }
                  this.barChartData = [{ data: [this.estandarCnt, this.progCnt, this.noviosCnt, this.pickupCnt,
                      this.preventaCnt, this.prevPickCnt, this.recaCnt, this.progPickCnt], label: 'Ventas' },
                    { data: [0, 0, 0, 0, 0, 0, 0, 0], label: 'Devoluciones' }];

                  this.promedio = ((this.estandarCnt + this.progCnt + this.noviosCnt + this.pickupCnt +
                    this.preventaCnt + this.prevPickCnt + this.recaCnt + this.progPickCnt) / 24).toFixed(1);
              }
              this.cargando = this.utils.validarCarga(this.cargando, 13);
      });
  }

  callGetTotalAmountByChannelService(store, state) {
    this.dashBoardService.getTotalAmountByChannel(store, state).subscribe(
      (result: any) => {
        this.listingBySalesChannels = this.utils.validarRespuestaFormatear(result);
          // this.listingBySalesChannels = result.message.replace(/\n/ig, '');
          // this.listingBySalesChannels = JSON.parse(this.listingBySalesChannels.toString());
          this.listingBySalesChannels = this.listingBySalesChannels.listingBySalesChannels;
          this.cargando = this.utils.validarCarga(this.cargando, 13);
      },
      error => {
        this.cargando = this.utils.validarCarga(this.cargando, 13);
        console.log(<any>error);
      }
    );
  }

  callGetTotalAmountByPaymentMethodService(state, store, channel) {
    this.dashBoardService.getTotalAmountByPaymentMethod(state, store, channel)
    .pipe( finalize(() => {
      this.paymentsLoading = false;
      this.incrementCounter('getTotalAmountByPaymentMethod');
    }) )
    .subscribe(
      (res: any) => this.ret = res,
      error => () => {
        this.cargando = this.utils.validarCarga(this.cargando, 13);
        console.log(error); },
      () => {
          this.payments = this.utils.validarRespuestaFormatear(this.ret);
          // this.payments = this.ret.message.replace(/\n/ig, '');
          // this.payments = JSON.parse(this.payments);
          this.payments = this.payments.payments;
          this.cargando = this.utils.validarCarga(this.cargando, 13);
          this.composeSalesResume(this.payments);
      });
  }

  callGetTotalFailedService(state, store, channel) {
    this.dashBoardService.getTotalFailed(state, store, channel).subscribe(
      (res: any) => this.ret = res,
      error => () => {
        this.cargando = this.utils.validarCarga(this.cargando, 13);
        console.log(error);
        console.log('error del servicio');
      },
      () => {
          let recibidaFallida = this.utils.validarRespuestaFormatear(this.ret);
          //  = this.ret.message.replace(/\n/ig, '');
          // recibidaFallida = JSON.parse(recibidaFallida);
          recibidaFallida = recibidaFallida.countStatus;
          console.log('fallidas ' + recibidaFallida);
          if (state === 1) {
            this.recibidasFallidas = recibidaFallida;
            this.recibidasFallidasDone = true;
          } else if (state === 12) {
            this.odCreadasFallidas = recibidaFallida;
            this.odCreadasFallidasDone = true;
          } else if (state === 2) {
            this.dteCreadasFallidas = recibidaFallida;
            this.dteCreadasFallidasDone = true;
          } else if (state === 4) {
            this.sdvFallidas = recibidaFallida;
            this.sdvFallidasDone = true;
          } else if (state === 10) {
            this.cerradasFallidas = recibidaFallida;
            this.promedioFallidas = (this.cerradasFallidas / 24).toFixed(1);
            this.cerradasDone = true;
          }
          this.cargando = this.utils.validarCarga(this.cargando, 13);
      });
  }

  callGetFrequencyDistributionService(state, store, channel) {
    this.dashBoardService.getFrequencyDistribution(state, store, channel)
    .pipe(finalize(() => this.incrementCounter('getFrequencyDistribution')))
    .subscribe(
      (res: any) => this.ret = res,
      error => () => {
        this.cargando = this.utils.validarCarga(this.cargando, 13);
        console.log(error);
        console.log('error del servicio'); },
      () => {
        // if (this.ret.code === 0 && this.ret.code !== undefined) {
          this.frequencyDistribution = this.utils.validarRespuestaFormatear(this.ret);
          // this.frequencyDistribution = this.ret.message.replace(/\n/ig, '');
          // this.frequencyDistribution = JSON.parse(this.frequencyDistribution);
          this.frequencyDistribution = this.frequencyDistribution.frequencies;
          this.frequencyDistribution.reverse();
          this.lineChartData = new Array<any>();
          this.lineChartLabels = new Array<any>();

          const data: Array<number> = new Array<number>();
          this.frequencyDistribution.forEach(element => {
            data.push(element.f);
          });

          this.frequencyData = new FrequencyData();
          this.frequencyData.data = data;
          this.frequencyData.label = 'Hoy';

          this.lineChartData.push(this.frequencyData);
          this.frequencyDistribution.forEach(element => {
            this.lineChartLabels.push(element.h);
          });

          this.labels = merge(this.lineChartData, this.lineChartColors);
          this.dataFrequency = true;
          this.cargando = this.utils.validarCarga(this.cargando, 13);
        // } else if (this.ret.code === 12) {
        //   this.messageService.enviarMensaje('Alerta', [this.ret.message], 'warn', this.dialogService);
        //   this.messageService.cargando(false);
        //   this.router.navigate(['/login']);
        // } else {
        //     this.messageService.enviarMensaje('Error', ['Ha ocurrido un error al obtener parametros'], 'warn', this.dialogService);
        // }
      });
  }

  public hexToRgbA(hex, opaity) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      // tslint:disable-next-line:no-bitwise
      return 'rgba(' + [( c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opaity + ')';
    }
    throw new Error('Bad Hex');
  }

  reload() {
    setTimeout(() => {
      this.ngOnInit();
     }, 300000);
  }


  composeSalesResume(payments): any {
    this.resumenVentas = this.dashBoardService.getResumenVentas(payments);
  }

  callGetOrdersWithErrorsCount() {
    // tslint:disable-next-line:prefer-const
    let fecha: string = this.conversorPipe.transformDate(this.today);
    this.dashBoardService.getOrdersWithErrorsCount(fecha, fecha)
      .pipe(finalize(() => this.incrementCounter('getOrdersWithErrorsCount')))
      .subscribe(
        result => {
          this.ltErroneousCounts = this.utils.failOCMapper(result);
          console.log(this.ltErroneousCounts);
            this.ltErroneousCounts.forEach(item => {
              if (item.origin === 'OEM') {
                this.erroneousOEM = {
                  contador : item.count,
                  titulo: 'Sin Asignación'
                };
              }
            });
        },
        error => {
          console.log(<any>error);
          // tslint:disable-next-line:max-line-length
          this.messageService.enviarMensaje('Error', ['Ha ocurrido un error al recuperar conteo de ordenes con problemas'], 'err', this.dialogService);
        }
      );
  }


  callGetShippingOrdersDays(days: number, channel: any) {
    let count1 = 0;
    let count2 = 0;
    let fechaDespacho = '';
    // tslint:disable-next-line:prefer-const
    let despachoEst: Despacho[] = [];
    // tslint:disable-next-line:prefer-const
    let despachoPrg: Despacho[] = [];
    let desp1: Despacho;
    let desp2: Despacho;

    this.dashBoardService.getShippingOrdersDays(days, channel)
    .pipe( finalize(() => {
      if (despachoEst.length === 0) {
        this.despachoFecha2.setDate(this.despachoFecha2.getDate() + 1);
        this.despachoFecha3.setDate(this.despachoFecha3.getDate() + 2);
        this.despachoFlag = false;
      }
      this.incrementCounter('getShippingOrdersDays');
    }) )
    .subscribe(
      (res: any) => this.ret = res,
      error => () => {console.log(error); },
      () => {
          // tslint:disable-next-line:prefer-const
          let recibidaFallida = this.utils.validarRespuestaFormatear(this.ret);
          // let recibidaFallida = this.ret.message.replace(/\n/ig, '');
          // recibidaFallida = JSON.parse(recibidaFallida);
          if (recibidaFallida !== '[]') {
            recibidaFallida.forEach((reg, index) => {
              if (index === (recibidaFallida.length - 1)) {
                if (reg.sdate !== fechaDespacho) {
                  desp1 = {
                    fecha: fechaDespacho,
                    contador: count1
                  };
                  desp2 = {
                    fecha: fechaDespacho,
                    contador: count2
                  };
                  despachoEst.push(desp1);
                  despachoPrg.push(desp2);
                  count1 = 0;
                  count2 = 0;
                }
                count1 += (reg.orderType === 1 && reg.cantidad > 0) ? reg.cantidad : 0;
                count2 += (reg.orderType === 2 && reg.cantidad > 0) ? reg.cantidad : 0;
                fechaDespacho = reg.sdate;
                desp1 = {
                  fecha: fechaDespacho,
                  contador: count1
                };
                desp2 = {
                  fecha: fechaDespacho,
                  contador: count2
                };
                despachoEst.push(desp1);
                despachoPrg.push(desp2);
              }

              if (reg.sdate === fechaDespacho && index !== (recibidaFallida.length - 1)) {
                if (reg.orderType === 1) {
                  count1 +=  reg.cantidad;
                } else if (reg.orderType === 2) {
                  count2 += reg.cantidad;
                }
              }

              if (reg.sdate !== fechaDespacho && index !== (recibidaFallida.length - 1)) {
                if (fechaDespacho.length !== 0) {
                  desp1 = {
                    fecha: fechaDespacho,
                    contador: count1
                  };
                  desp2 = {
                    fecha: fechaDespacho,
                    contador: count2
                  };
                  despachoEst.push(desp1);
                  despachoPrg.push(desp2);
                  count1 = 0;
                  count2 = 0;
                }
                fechaDespacho = reg.sdate;
                count1 += (reg.orderType === 1 && reg.cantidad > 0) ? reg.cantidad : 0;
                count2 += (reg.orderType === 2 && reg.cantidad > 0) ? reg.cantidad : 0;
              }
            });
            this.despachoDias.push({
              titulo: 'Estándar',
              despacho: despachoEst
            });
            this.despachoDias.push({
              titulo: 'Programado',
              despacho: despachoPrg
            });
          }
      });
  }

  incrementCounter(key: string) {
    console.log(key);
    console.log(this.loadingMap);
    // tslint:disable-next-line:no-inferrable-types
    let bound: boolean = true;
    this.loadingMap.set(key, true);

    bound = bound && (this.loadingMap.get('getShippingOrdersDays') ? this.loadingMap.get('getShippingOrdersDays') : false);
    bound = bound && (this.loadingMap.get('getOrdersWithErrorsCount') ? this.loadingMap.get('getOrdersWithErrorsCount') : false);
    bound = bound && (this.loadingMap.get('getFrequencyDistribution') ? this.loadingMap.get('getFrequencyDistribution') : false);
    bound = bound && (this.loadingMap.get('getTotalAmountByPaymentMethod') ? this.loadingMap.get('getTotalAmountByPaymentMethod') : false);

    if (bound) {
      console.log('desactivando el cargado');
      this.messageService.cargando(false);
    }
  }
}
