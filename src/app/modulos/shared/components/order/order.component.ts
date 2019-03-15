import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchService } from '../../services/searchservice';
import { Globals } from '../../utils/globals';
import { Usuario } from './../../../shared/vo/usuario';
import { Location } from '@angular/common';
import { MenuProfile } from './../../../shared/vo/menu';
import { MessageService } from './../../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, ResponseContentType } from '@angular/http';
import { Utils } from './../../../shared/utils/utils';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  searchservice: SearchService;
  resultsDetail: any;
  resultsShippingDetail: any;
  private config: any;

  // Perfilamiento
  private usuario: Usuario;
  private menu: MenuProfile[];
  editable: Boolean;

  ordernumber: String;
  public files: Array<any>;

  typeOfOffice: any;
  orderOfDispatch: any;
  orderOfDispatchStatus: any;
  recipientName: any;
  region: any;
  city: any;
  commune: any;
  DispatchAddress: any;
  nameOfThePersonWhoWithdrew: any;
  rutRetiring: any;
  retirementStore: any;
  retirementPointAddress: any;
  displayUrlDte: any;
  folNumberDte: any;
  resultado: any;

  // nuevas variables para separar doSearchDetailInfo
  saleDetail: any;
  productDetailList: any;
  shippingOrderDetailTotalList: any;
  mpagoDetailList: any;
  trxDetailList: any;
  shippingOrderDetailList: any;
  ppeDetailList: any;
  noteCreditDetailList: any;

  dte: boolean;
  // recarga de datos
  recargarOrdenCompra: boolean;
  recargarProducto: boolean;
  recargarMedioPago: boolean;
  recargarDespacho: boolean;
  recargarNovios: boolean;
  recargarTransaccion: boolean;
  recargarNotaCredito: boolean;
  recargarShipping: boolean;
  isEmptyNotaCredito: boolean;

  @ViewChild('modalHistory')
  modalHistory;
  utils: Utils;

  constructor(private http: Http, public searchInfo: SearchService, public globals: Globals, private location: Location,
    public messageService: MessageService, public dialogService: DialogService, public route: ActivatedRoute, public router: Router) {
      this.resultsDetail = [];
      this.resultsShippingDetail = [];
      this.config = this.globals.getValue();
      this.editable = false;
      this.files = [];
      this.utils = new Utils(this.messageService, this.router, this.dialogService);

      this.saleDetail = [];
      this.productDetailList = [];
      this.mpagoDetailList = [];
      this.trxDetailList = [];
      this.shippingOrderDetailList = [];
      this.ppeDetailList = [];
      this.noteCreditDetailList = [];
      this.dte = false;
      this.recargarOrdenCompra = false;
      this.recargarProducto = false;
      this.recargarMedioPago = false;
      this.recargarDespacho = false;
      this.recargarNovios = false;
      this.recargarTransaccion = false;
      this.recargarNotaCredito = false;
      this.recargarShipping = false;
      this.isEmptyNotaCredito = false;
  }

  ngOnInit() {
    this.messageService.cargando(true);
    this.ordernumber = this.route.snapshot.params.ordernumber;
    console.log('ordernumber ' + this.ordernumber);

    // cajas a pintar
    this.doSearchBoxDetail(this.ordernumber);

    // servicios que llenan los acordeones de datos.
    this.doSearchDetailInfoOrdenCompra(this.ordernumber);
    this.doSearchDetailInfoProducto(this.ordernumber);
    this.doSearchDetailInfoMedioPago(this.ordernumber);
    this.doSearchDetailInfoOrdenDespacho(this.ordernumber);
    this.doSearchDetailInfoNovios(this.ordernumber);
    this.doSearchDetailInfoTransaction(this.ordernumber);
    this.doSearchDetailInfoNotaCredito(this.ordernumber);
    this.doSearchDetailInfoShipping(this.ordernumber);

    this.searchShippingOrderInfoDetail(this.ordernumber + '', 0);

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

  }

  doSearchBoxDetail(oc: String) {
    // buscar cajas estado
    this.searchInfo.searchBox(oc);
    this.searchInfo.searchTrazaDetailAll2('' + oc).subscribe(
      res => {
          console.log(res);
          this.resultado = res;
          if (this.resultado.histories.length === 0) {
            this.messageService.enviarMensaje('Error', ['No se han encontrado historias'], 'info', this.dialogService);
          } else {
            this.resultado = this.resultado.histories[(this.resultado.histories.length - 1)].txHistory;
            console.log(this.resultado);
          }
      },
      err => {
        console.log(<any>err);
        this.messageService.cargando(false);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
      }
    );
  }

  // doSearchDetailInfo(oc: String) {
  //   console.log('doSearchDetail');
  //    this.loadings = true;
  //   //  this.messageService.cargando(this.loadings);

  //   this.searchInfo.searchDetailInfo('' + oc).subscribe(
  //     res => {
  //       if (res.code === 0 && res.code !== undefined) {
  //         console.log('en searchDetailInfo');
  //         console.log(res);
  //         res = this.utils.validarRespuesta(res);
  //         this.resultsDetail = res.message.replace(/\n/ig, '');
  //         this.resultsDetail = JSON.parse(this.resultsDetail);
  //         this.resultsDetail = this.resultsDetail;
  //         console.log(this.resultsDetail);
  //         this.loadings = false;
  //         // this.messageService.cargando(this.loadings);
  //         // this.messageService.cargando(false);
  //       }
  //     },
  //     err => {
  //       console.log(<any>err);
  //       this.loadings = false;
  //       // this.messageService.cargando(this.loadings);
  //       this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
  //     }
  //   );
  // }

  doSearchDetailInfoOrdenCompra(oc: String) {
    console.log('doSearchDetailInfoOrdenCompra');
    this.searchInfo.searchDetailInfoOrdenCompra('' + oc).subscribe(
      res => {
        if (res.code === 0 && res.code !== undefined) {
          console.log('en searchDetailInfoOrdenCompra');
          console.log(res);
          this.saleDetail = this.utils.validarRespuestaFormatear(res);
          // this.saleDetail = res.message.replace(/\n/ig, '');
          // this.saleDetail = JSON.parse(this.saleDetail.toString());
          this.saleDetail = this.saleDetail.saleDetail;
          console.log(this.saleDetail);
          // this.saleDetail = null;
          if (this.saleDetail === null || this.saleDetail === undefined) {
            this.recargarOrdenCompra = true;
          }
        }
      },
      err => {
        this.recargarOrdenCompra = true;
        console.log(<any>err);
        this.messageService.cargando(false);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
      }
    );
  }

  doSearchDetailInfoProducto(oc: String) {
    console.log('doSearchDetailInfoProducto');
    this.searchInfo.searchDetailInfoProducto('' + oc).subscribe(
      res => {
        if (res.code === 0 && res.code !== undefined) {
          console.log('en searchDetailInfoProducto');
          console.log(res);
          this.productDetailList = this.utils.validarRespuestaFormatear(res);
          // this.productDetailList = res.message.replace(/\n/ig, '');
          // this.productDetailList = JSON.parse(this.productDetailList.toString());
          console.log(this.productDetailList);
          // this.productDetailList.productDetailList = null;
          if (this.productDetailList.productDetailList === null || this.productDetailList.productDetailList === undefined) {
            this.recargarProducto = true;
          }
        }
      },
      err => {
        this.recargarProducto = true;
        console.log(<any>err);
        this.messageService.cargando(false);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
      }
    );
  }

  doSearchDetailInfoMedioPago(oc: String) {
    console.log('doSearchDetailInfoMedioPago');
    this.searchInfo.searchDetailInfoMedioPago('' + oc).subscribe(
      res => {
        if (res.code === 0 && res.code !== undefined) {
          console.log('en searchDetailInfoMedioPago');
          console.log(res);
          this.mpagoDetailList = this.utils.validarRespuestaFormatear(res);
          // this.mpagoDetailList = res.message.replace(/\n/ig, '');
          // this.mpagoDetailList = JSON.parse(this.mpagoDetailList);
          console.log(this.mpagoDetailList);
          // this.mpagoDetailList.mpagoDetailList = null;
          if (this.mpagoDetailList.mpagoDetailList === null || this.mpagoDetailList.mpagoDetailList === undefined) {
            this.recargarMedioPago = true;
          }
        }
      },
      err => {
        this.recargarMedioPago = true;
        console.log(<any>err);
        this.messageService.cargando(false);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
      }
    );
  }

  doSearchDetailInfoOrdenDespacho(oc: String) {
    console.log('doSearchDetailInfoOrdenDespacho');
    this.searchInfo.searchDetailInfoOrdenDespacho('' + oc).subscribe(
      res => {
        if (res.code === 0 && res.code !== undefined) {
          console.log('en searchDetailInfoOrdenDespacho');
          console.log(res);
          this.shippingOrderDetailList = this.utils.validarRespuestaFormatear(res);
          // this.shippingOrderDetailList = res.message.replace(/\n/ig, '');
          // this.shippingOrderDetailList = JSON.parse(this.shippingOrderDetailList);
          // this.shippingOrderDetailList.shippingOrderDetailList = null;
          // tslint:disable-next-line:max-line-length
          if (this.shippingOrderDetailList === null || this.shippingOrderDetailList === undefined) {
            this.recargarDespacho = true;
          }
        }
      },
      err => {
        this.recargarDespacho = true;
        console.log(<any>err);
        this.messageService.cargando(false);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
      }
    );
  }

  doSearchDetailInfoNovios(oc: String) {
    console.log('doSearchDetailInfoNovios');
    this.searchInfo.searchDetailInfoNovios('' + oc).subscribe(
      res => {
        if (res.code === 0 && res.code !== undefined) {
          console.log('en searchDetailInfoNovios');
          console.log(res);
          this.ppeDetailList = this.utils.validarRespuestaFormatear(res);
          // this.ppeDetailList = res.message.replace(/\n/ig, '');
          // this.ppeDetailList = JSON.parse(this.ppeDetailList);
          this.ppeDetailList = this.ppeDetailList.ppeDetailList;
          console.log(this.ppeDetailList);
          if (this.ppeDetailList === null || this.ppeDetailList === undefined) {
            this.recargarNovios = true;
          }
        }
      },
      err => {
        this.recargarNovios = true;
        console.log(<any>err);
        this.messageService.cargando(false);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
      }
    );
  }

  doSearchDetailInfoTransaction(oc: String) {
    console.log('doSearchDetailInfoTransaction');
    this.searchInfo.searchDetailInfoTransaction('' + oc).subscribe(
      res => {
        if (res.code === 0 && res.code !== undefined) {
          console.log('en searchDetailInfoTransaction');
          console.log(res);
          this.trxDetailList = this.utils.validarRespuestaFormatear(res);
          // this.trxDetailList = res.message.replace(/\n/ig, '');
          // this.trxDetailList = JSON.parse(this.trxDetailList);
          this.trxDetailList = this.trxDetailList.trxDetailList;
          console.log(this.trxDetailList);
          if (this.trxDetailList === null || this.trxDetailList === undefined) {
            this.recargarTransaccion = true;
          }
          this.trxDetailList.forEach(element => {
            if (element.urlDte !== null) {
              this.dte = true;
            }
          });
        }
      },
      err => {
        this.recargarTransaccion = true;
        console.log(<any>err);
        this.messageService.cargando(false);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
      }
    );
  }

  doSearchDetailInfoNotaCredito(oc: String) {
    console.log('doSearchDetailInfoNotaCredito');
    this.searchInfo.searchDetailInfoNotaCredito('' + oc).subscribe(
      res => {
        if (res.code === 0 && res.code !== undefined) {
          console.log('en searchDetailInfoNotaCredito');
          console.log(res);
          this.noteCreditDetailList = this.utils.validarRespuestaFormatear(res);
          // this.noteCreditDetailList = res.message.replace(/\n/ig, '');
          // this.noteCreditDetailList = JSON.parse(this.noteCreditDetailList);
          // this.noteCreditDetailList = this.noteCreditDetailList;
          console.log(this.noteCreditDetailList);
          if (this.noteCreditDetailList.noteCreditDetailList.length === 0) {
              console.log('noteCreditDetailList vacío');
              this.isEmptyNotaCredito = true;
          }
          if (this.noteCreditDetailList === null || this.noteCreditDetailList === undefined) {
            this.recargarNotaCredito = true;
            console.log('nota de credito, entro en el tercer if');
          }
          console.log('nota de credito: ' + this.noteCreditDetailList);
        }
      },
      err => {
        this.recargarNotaCredito = true;
        console.log(<any>err);
        this.messageService.cargando(false);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
      }
    );
  }

  doSearchDetailInfoShipping(oc: String) {
    console.log('doSearchDetailInfoShipping');
    this.searchInfo.searchDetailInfoShipping('' + oc).subscribe(
      res => {
        if (res.code === 0 && res.code !== undefined) {
          console.log('en searchDetailInfoShipping');
          console.log(res);
          this.shippingOrderDetailList = this.utils.validarRespuestaFormatear(res);
          // this.shippingOrderDetailList = res.message.replace(/\n/ig, '');
          // this.shippingOrderDetailList = JSON.parse(this.shippingOrderDetailList);
          console.log(this.shippingOrderDetailList);
          // this.shippingOrderDetailList.shippingOrderDetailList = null;
          if (this.shippingOrderDetailList === null || this.shippingOrderDetailList === undefined) {
            this.recargarDespacho = true;
          }
          this.messageService.cargando(false);
         }
      },
      err => {
        this.recargarDespacho = true;
        console.log(<any>err);
        this.messageService.cargando(false);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda detalle'], 'info', this.dialogService);
      }
    );
  }


  doSearchDetailInfo2(oc: String) {
    console.log('doSearchDetailInfo2');
    this.searchInfo.searchDetailInfo2('' + oc).subscribe(
      result => {
        if (result.code === 0 && result.code !== undefined) {
          console.log('entramos a un status 200 en searchDetailInfo2');
          console.log(result);
          this.resultsDetail = this.utils.validarRespuestaFormatear(result);
          // this.resultsDetail = result.message.replace(/\n/ig, '');
          // this.resultsDetail = JSON.parse(this.resultsDetail);
          console.log(this.resultsDetail);
          this.resultsDetail.mpagoDetailList = this.resultsDetail.mpagoDetailList;
          console.log(this.resultsDetail.mpagoDetailList);
          this.resultsDetail.ppeDetailList = this.resultsDetail.ppeDetailList;
          console.log(this.resultsDetail.ppeDetailList);
          this.resultsDetail.productDetailList = this.resultsDetail.productDetailList;
          console.log(this.resultsDetail.productDetailList);
          this.resultsDetail.saleDetail = this.resultsDetail.saleDetail;
          console.log(this.resultsDetail.saleDetail);
          this.resultsDetail.serviceDetailList = this.resultsDetail.serviceDetailList;
          console.log(this.resultsDetail.serviceDetailList);
          this.resultsDetail.shippingDetailList = this.resultsDetail.shippingDetailList;
          console.log(this.resultsDetail.shippingDetailList);
          this.resultsDetail.trxDetailList = this.resultsDetail.trxDetailList;
          console.log(this.resultsDetail.trxDetailList);
          this.resultsDetail.noteCreditDetailList = this.resultsDetail.noteCreditDetailList;
          console.log(this.resultsDetail.noteCreditDetailList);
          // this.messageService.cargando(false); aqui

          // this.searchInfo.resultsDetail.mpagoDetailList = result.mpagoDetailList;
          // this.searchInfo.resultsDetail.ppeDetailList = result.ppeDetailList;
          // this.searchInfo.resultsDetail.productDetailList =
          //   result.productDetailList;
          // this.searchInfo.resultsDetail.saleDetail = result.saleDetail;
          // this.searchInfo.resultsDetail.serviceDetailList =
          //   result.serviceDetailList;
          // this.searchInfo.resultsDetail.shippingDetailList =
          //   result.shippingDetailList;
          // this.searchInfo.resultsDetail.trxDetailList = result.trxDetailList;
          // this.searchInfo.resultsDetail.noteCreditDetailList =
          //   result.noteCreditDetailList;
        }
      },
      error => {
        console.log('error');
        console.log(<any>error);
        this.messageService.enviarMensaje('Error búsqueda', ['Info no válido'], 'info', this.dialogService);
        // this.loading = false;
      }
    );
  }

  doModalLegacy(req: string, resp: String) {
    // menu
    this.menu = this.config[2].val;
    console.log('Access : ' + this.menu[0].idAccess + ' / ' + this.menu[0].idModule);
    if (this.menu[0].idAccess === 3) {
      this.searchInfo.setHitoryModal(req, resp);
      // open Modal
      this.modalHistory.open();
    } else {
      console.log(' Usuario sin privilegios');
    }
  }

  doEditMail(orden: string, oldMail: String, newMail: String) {
    this.usuario = this.config[1].val;

    if (!this.validationEmail(newMail)) {
      this.messageService.enviarMensaje('Error búsqueda', ['Email no válido'], 'info', this.dialogService);
      this.searchInfo.searchDetail(orden);
      return;
    } else {
      this.searchInfo.editMail(orden, newMail, oldMail, this.usuario.idUser + '');
    }
  }

  doEditDte(orden: string, oldDte: String, newDte: String) {
    this.usuario = this.config[1].val;
    console.log('orden : ' + orden + ' oldDte : ' + oldDte + ' newDte : ' + newDte + ' this.usuario.idUser : ' + this.usuario.idUser);
    // editar dte
    this.searchInfo.editDte(orden, newDte, oldDte, this.usuario.idUser + '');
  }

  validationEmail(email: any) {
    const EMAIL_REGEXP = /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/;
    if (EMAIL_REGEXP.test(email.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  onlyNumberKey(event) {
    return event.charCode === 8 || event.charCode === 0 ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  displayConditionUrlDte(urlDte: any, folNumber: any) {
    this.displayUrlDte = urlDte;
    this.folNumberDte = folNumber;
  }

  volver() {
    // history.go(-1);
    // history.back();
    sessionStorage.setItem('volverSearch', 'SI');
    sessionStorage.setItem('volverIc', 'SI');
    sessionStorage.setItem('volverEmail', 'SI');
    this.location.back();
  }

  sendDispatchOrderInformation(shippingtype) {
    this.typeOfOffice = shippingtype;
  }

  searchShippingOrderInfoDetail(oc, idShipping) {
    console.log('searchShippingOrderInfoDetail: ' + 'oc: ' + oc + 'idShipping: ' + idShipping);

    this.searchInfo.searchShippingOrderToInfoDetail(oc, idShipping).subscribe(
      result => {
        if (result.code === 0 && result.code !== undefined) {
          console.log('entramos a un status 200 ');
          console.log(result);
          this.resultsShippingDetail.shippingOrderToInfoDetail = this.utils.validarRespuestaFormatear(result);
          // this.resultsShippingDetail.shippingOrderToInfoDetail = result.message.replace(/\n/ig, '');
          // this.resultsShippingDetail.shippingOrderToInfoDetail = JSON.parse(this.resultsShippingDetail.shippingOrderToInfoDetail);
          // tslint:disable-next-line:max-line-length
          this.resultsShippingDetail.shippingOrderToInfoDetail = this.resultsShippingDetail.shippingOrderToInfoDetail.shippingOrderToInfoDetail;
          console.log(this.resultsShippingDetail.shippingOrderToInfoDetail);
        }
      },
      error => {
        console.log('error');
        console.log(<any>error);
        // this.messageService.enviarMensaje( 'Error búsqueda', ['Info no válido'], 'info', this.dialogService);
        // this.loading = false;
      }
    );
  }

  downloadUrlDte(url) {
    const https = '' + url;
    window.open(https);
  }

  downloadFile() {
    // let headers=new HttpHeaders();
    // headers.set('Accept','application/pdf');
    const headers = new Headers();
    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Methods', 'GET');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get('https://cencosudqa.paperless.cl/Facturacion/PDFServlet?docId=yOVnSc92wKCTv77UhyWLdO8JnEbaYKxd',
    {responseType: ResponseContentType.Blob, search: '' }).map(res => {
        return {
          filename: 'download.pdf',
          data: res.blob()
        };
    }).subscribe(
      res => {
        console.log('start download:', res);
        // tslint:disable-next-line:prefer-const
        let url = window.URL.createObjectURL(res.data);
        // tslint:disable-next-line:prefer-const
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      },
      error => {
        console.log('download error:', JSON.stringify(error));
      },
      () => {
        console.log('Completed file download.');
      }
    );
  }

  reloadOc() {
    this.doSearchDetailInfoOrdenCompra(this.ordernumber);
  }
  reloadProduct() {
    this.doSearchDetailInfoProducto(this.ordernumber);
  }
  reloadPayment() {
    this.doSearchDetailInfoMedioPago(this.ordernumber);
  }
  reloadTransaction() {
    this.doSearchDetailInfoTransaction(this.ordernumber);
  }
  reloadShipping() {
    this.doSearchDetailInfoShipping(this.ordernumber);
  }
}
