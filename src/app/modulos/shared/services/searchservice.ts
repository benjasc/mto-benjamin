import { CommonService } from './common.service';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from './../../../../environments/environment';
import { MessageService } from './../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { Utils } from './../../shared/utils/utils';

@Injectable()
export class SearchService {
  methodSearchOc: String = '/searchOrderInfo/';
  methodSearchDetail: String = '/searchOrderInfoDetail/';
  methodSearchDetailOrdenCompra: String = '/searchOrderInfoDetailOrdenCompra/';
  methodSearchDetailProducto: String = '/searchOrderInfoDetailProducto/';
  methodSearchDetailMedioPago: String = '/searchOrderInfoDetailMedioPago/';
  methodSearchDetailDespacho: String = '/searchOrderInfoDetailOrdenDespacho/';
  methodSearchDetailNovios: String = '/searchOrderInfoDetailNovios/';
  methodSearchDetailTransaction: String = '/searchOrderInfoDetailTransaction/';
  methodSearchDetailNotaCredito: String = '/searchOrderInfoDetailNotaCredito/';
  methodSearchDetailShipping: String = '/searchOrderInfoDetailShipping/';
  methodUpdateEmail: String = '/emailCustomerUpdate/';
  methodUpdateDTE: String = '/dteCustomerUpdate/';
  methodSearchNcDetail: String = '/searchOrderNcInfoDetail/';
  methodSearchEmailTemplateDetail: String = '/emailTemplateInfo/';
  methodSearchUserInfoUpdate: String = '/userInfoUpdate/';
  results: any;
  resultsDetail: any;
  resultsNcDetail: any;
  resultsShippingDetail: any;
  errorMessage: String = '';
  public url_api: string;
  public url_oc_history: string;
  orderNumber: String;
  header: Headers;
  options: RequestOptions;
  loadings: boolean;

  // traza
  resultsBox: any;
  resultsTraza: any;
  resultsTrazaAll: any;
  requestModal: String;
  responseModal: String;

  // Update mail
  resultUpdate: any;
  formarRut: string;
  tipoDoc: string;
  utils: Utils;
  constructor(private http: Http, private messageService: MessageService,
    private dialogService: DialogService, private commonService: CommonService) {
      this.results = [];
      this.resultsDetail = [];
      this.resultsNcDetail = [];
      this.resultsBox = [];
      this.resultsTraza = [];
      this.resultsTrazaAll = [];
      this.resultUpdate = [];
      this.loadings = false;
      this.url_api = environment.url_api;
      this.url_oc_history = environment.url_oc_history;
      this.tipoDoc = 'rut';
      this.formarRut = '';
      this.resultsShippingDetail = [];
      this.utils = new Utils(this.messageService, null, this.dialogService);
  }

  search(rut: string, dni: string, oc: string, sku: string, dire: string, dest: string, comprador: string, codppe: string,
    fechadesde: String, fechahasta: String, nombreretira: String, fechaEntregaDesde: String, fechaEntregaHasta: String, typeOrder: String) {
    // console.log(rut + '>>>' + oc + '>>>' + sku + '>>>' + dire + '>>>' + dest + '>>>' + comprador + '>>>' + codppe + '>>>' + fechadesde +
    //     '>>>' + fechahasta + '>>>' + nombreretira + '>>>' + fechaEntregaDesde + '>>>' + fechaEntregaHasta + '>>>' + typeOrder);
    const apiURL = this.url_api + this.methodSearchOc;
    return this.http.post(apiURL, {
        rutCliente: rut,
        dniCliente: dni,
        ordenCompra: oc,
        sku: sku,
        direccionDespacho: dire,
        destinatario: dest,
        comprador: comprador,
        codigoPPEE: codppe,
        fechaCompraDesde: fechadesde,
        fechaCompraHasta: fechahasta,
        nombreRetira: nombreretira,
        entregaDesdeString: fechaEntregaDesde,
        entregaHastaString: fechaEntregaHasta,
        typeOrder: typeOrder
      }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchDetail(oc: string) {
    const apiURL = this.url_api + this.methodSearchDetail + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }
  /*
  searchDetail(oc: string) {
    const apiURL = `${this.url_api + this.methodSearchDetail + '/' + oc}`;
    this.loadings = true;
    this.messageService.cargando(this.loadings);

    this.http.get(apiURL).subscribe(
      res => {
        console.log(res.json());
        this.loadings = false;
        this.messageService.cargando(this.loadings);

        this.resultsDetail = res.json();
      },
      err => {
        this.loadings = false;
        this.messageService.cargando(this.loadings);

        this.messageService.enviarMensaje(
          'Error búsqueda',
          ['Error en servicio de búsqueda detalle'],
          'info',
          this.dialogService
        );
      }
    );
  }
  */

  searchCorreoDetail(oc: string) {
    const apiURL = this.url_api + this.methodSearchDetail + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchEmailTemplateDetail(idEmail: string, name: string, description: string, subject: string) {
    const apiURL = this.url_api + this.methodSearchEmailTemplateDetail;
    return this.http.post(apiURL, {
        idEmail: idEmail,
        idStore: -1,
        name: name,
        description: description,
        subject: subject,
        to: '-1',
        from: '-1'
      }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  // searchEmailTemplateDetail(idEmail: string, name: string, description: string, subject: string) {
  //   const apiURL = `${this.url_api + this.methodSearchEmailTemplateDetail}`;

  //   this.http
  //     .post(apiURL, {
  //       idEmail: idEmail,
  //       idStore: -1,
  //       name: name,
  //       description: description,
  //       subject: subject,
  //       to: '-1',
  //       from: '-1'
  //     },
  //     { headers: this.commonService.createHeaderContent() })
  //     .subscribe(
  //       res => {
  //         console.log(res.json());
  //         this.resultsDetail = res.json();
  //       },
  //       err => {
  //         this.messageService.enviarMensaje(
  //           'Error búsqueda',
  //           ['Error en servicio de búsqueda detalle'],
  //           'info',
  //           this.dialogService
  //         );
  //       }
  //     );
  // }

  searchDetailInfo(oc: string) {
    console.log('searchDetailInfo' + oc);
    const apiURL = this.url_api + this.methodSearchDetail + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchDetailInfoOrdenCompra(oc: string) {
    console.log('searchDetailInfo' + oc);
    const apiURL = this.url_api + this.methodSearchDetailOrdenCompra + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchDetailInfoProducto(oc: string) {
    console.log('searchDetailInfo' + oc);
    const apiURL = this.url_api + this.methodSearchDetailProducto + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchDetailInfoMedioPago(oc: string) {
    console.log('searchDetailInfo' + oc);
    const apiURL = this.url_api + this.methodSearchDetailMedioPago + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchDetailInfoOrdenDespacho(oc: string) {
    console.log('searchDetailInfo' + oc);
    const apiURL = this.url_api + this.methodSearchDetailDespacho + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchDetailInfoNovios(oc: string) {
    console.log('searchDetailInfo' + oc);
    const apiURL = this.url_api + this.methodSearchDetailNovios + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchDetailInfoTransaction(oc: string) {
    console.log('searchDetailInfo' + oc);
    const apiURL = this.url_api + this.methodSearchDetailTransaction + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchDetailInfoNotaCredito(oc: string) {
    console.log('searchDetailInfo' + oc);
    const apiURL = this.url_api + this.methodSearchDetailNotaCredito + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchDetailInfoShipping(oc: string) {
    console.log('searchDetailInfo' + oc);
    const apiURL = this.url_api + this.methodSearchDetailShipping + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }
  /*

  searchDetailInfo(oc: string) {
    console.log('searchDetailInfo' + oc);
    const apiURL = `${this.url_api + this.methodSearchDetail + '/' + oc}`;

    this.http.get(apiURL).subscribe(
      res => {
        console.log(res.json());
        this.resultsDetail = res.json();
      },
      err => {
        console.log(<any>err);
        this.messageService.enviarMensaje(
          'Error búsqueda',
          ['Error en servicio de búsqueda detalle'],
          'info',
          this.dialogService
        );
      }
    );
  }
  */

  searchNcDetailInfo(oc: string) {
    console.log('searchNcDetailInfo ' + oc);
    const apiURL = this.url_api + this.methodSearchNcDetail + '/' + oc;
    this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).subscribe(
      res => {
        console.log(res.json());
        this.utils.validarRespuesta(res);
        this.resultsNcDetail = res.json();

      },
      err => {
        console.log(<any>err);
        this.messageService.enviarMensaje(
          'Error búsqueda',
          ['Error en servicio de búsqueda detalle NC'],
          'info',
          this.dialogService
        );
      }
    );
  }

  getTrazaNc(oc: String) {
    const apiURL = this.url_api + this.methodSearchNcDetail + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchDetailInfo2(oc: string) {
    console.log('searchDetailInfo2' + oc);
    const apiURL = this.url_api + this.methodSearchDetail + '/' + oc;
    return this.http.get(apiURL, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchBoxDetail(oc: String) {
    // this.searchBox(this.orderNumber);
    // this.searchTrazaDetail(this.orderNumber);
    this.searchBox(oc);
    // this.searchTrazaDetail(oc);
    // this.searchTrazaDetailAll(oc);
  }

  searchBoxNcDetail(oc: String) {
    // this.searchBox(this.orderNumber);
    // this.searchTrazaDetail(this.orderNumber);
    this.searchBox(oc);
    this.searchTrazaDetail(oc);
  }

  searchBox(oc: String) {
    const apiURL = this.url_oc_history + '/' + oc + '/events';
    this.http.get(apiURL).subscribe(
      res => {
        console.log('respuesta del searchBox ' + res.json());
        console.log(res.json());
        this.resultsBox = res.json();
      },
      err => {
        this.messageService.enviarMensaje('Error búsqueda', ['Error en búsqueda servicio de traza'], 'info', this.dialogService);
      }
    );
  }

  searchOrderData(oc: String) {
    const apiURL = this.url_oc_history + '/' + oc + '/events';
    const jsonResponse = this.http.get(apiURL).map(res => res.json());
    return jsonResponse;
  }

  searchTrazaDetail(oc: String) {
    const apiURL = this.url_oc_history + '/' + oc + '/history';
    this.http.get(apiURL).subscribe(
      res => {
        console.log(res.json());
        // this.utils.validarRespuesta(res);
        this.resultsTraza = res.json();
      },
      err => {
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda de traza'], 'info', this.dialogService);
      }
    );
  }

  searchTrazaDetailAll(oc: String) {
    const apiURL = this.url_oc_history + '/' + oc + '/history/all';
    this.http.get(apiURL).subscribe(
      res => {
        console.log('resultsTrazaAll = ' + res.json());
        this.utils.validarRespuesta(res);
        this.resultsTrazaAll = res.json();
      },
      err => {
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda de traza All'], 'info', this.dialogService);
      }
    );
  }

  searchTrazaDetailAll2(oc: String) {
    const apiURL = this.url_oc_history + '/' + oc + '/history/all';
   return this.http.get(apiURL).map(res => res.json());
  }

  setHitoryModal(req: string, resp: String) {
    this.requestModal = req;
    this.responseModal = resp;
  }

  editMail(orden: string, newMail: String, oldMail: String, idUser: String) {
    // console.log('modificar email ' + oldMail + ' por ' + newMail + ' de la orden ' + orden + ' usuario ' + idUser);
    if (newMail === undefined || newMail === '') {
      this.messageService.enviarMensaje('Error actualizar mail', ['Error servicio actualizar mail vacío'], 'info', this.dialogService);
      this.searchDetail(orden);
      return false;
    }

    const req = new Promise((resolve, reject) => {
      const apiURL = this.url_api + this.methodUpdateEmail;
      this.http.post(apiURL, {
          orderCompra: orden,
          email: newMail,
          user: idUser,
          oldValue: oldMail
        }, { headers: this.commonService.createHeaderContent() }).subscribe(
          res => {
            console.log(res.json());
            this.utils.validarRespuesta(res);
            this.resultUpdate = res.json();
            if (this.resultUpdate.length === 0) {
              this.messageService.enviarMensaje('Error actualizar mail', ['Error Actualizar Campo Email'], 'info', this.dialogService);
            } else {
              this.messageService.enviarMensaje('Actualizar Mail', ['Campo email actualizado correctamente'], 'info', this.dialogService);
            }
            resolve();
          },
          err => {
            console.log('Error occured');
            this.messageService.enviarMensaje('Error actualizar mail', ['Error servicio actualizar mail'], 'info', this.dialogService);
            reject(err);
          }
        );
      return req;
    }).catch(function(error) {
      this.messageService.enviarMensaje(
        'Error actualizar mail',
        ['Error servicio actualizar mail'],
        'info',
        this.dialogService
      );
    });
  }

  editDte(orden: string, newDte: String, oldDte: String, idUser: String) {
    // console.log('modificar dte ' + oldDte + ' por ' + newDte + ' de la orden ' + orden + ' usuario ' + idUser);
    if (newDte === undefined || newDte === '') {
      this.messageService.enviarMensaje('Error actualizar DTE', ['Error servicio actualizar dte vacío'], 'info', this.dialogService);
      this.searchDetail(orden);
      return false;
    }

    const req = new Promise((resolve, reject) => {
      const apiURL = this.url_api + this.methodUpdateDTE;
      this.http.post(apiURL, {
          orderCompra: orden,
          dte: newDte,
          user: idUser,
          oldValue: oldDte
        }, { headers: this.commonService.createHeaderContent() }).subscribe(
          res => {
            console.log(res.json());
            this.utils.validarRespuesta(res);
            this.resultUpdate = res.json();
            if (this.resultUpdate.length === 0) {
              this.messageService.enviarMensaje('Error actualizar Dte', ['Error Actualizar Campo Dte'], 'info', this.dialogService);
            } else {
              this.messageService.enviarMensaje('Actualizar Dte', ['Campo dte actualizado correctamente'], 'info', this.dialogService);
            }
            resolve();
          },
          err => {
            console.log('Error occured');
            this.messageService.enviarMensaje('Error actualizar Dte', ['Error servicio actualizar Dte'], 'info', this.dialogService);
            reject(err);
          }
        );
      return req;
    }).catch(function(error) {
      this.messageService.enviarMensaje('Error actualizar Dte', ['Error servicio actualizar Dte'], 'info', this.dialogService);
    });
  }

  editarTransactionNumber(
    orden: string,
    newDte: String,
    oldDte: String,
    idUser: String
  ) {
    const apiURL = this.url_api + this.methodUpdateDTE;
    return this.http.post(apiURL, {
        orderCompra: orden,
        dte: newDte,
        user: idUser,
        oldValue: oldDte
      }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchShippingOrderToInfoDetail(oc: string, idShipping: number) {
    console.log('searchShippingOrderToInfoDetail');
    return this.http.get(this.url_api + '/searchShippingOrderToInfoDetail/' + oc + '/' + idShipping,
      { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  // Botón limpiar, todo a valor inicial
  cleanResults() {
    this.results = [];
    this.resultsDetail = [];
    this.resultsBox = [];
    this.resultsTraza = [];
    this.resultsTrazaAll = [];
    this.resultUpdate = [];
    this.loadings = false;
    this.url_api = environment.url_api;
    this.url_oc_history = environment.url_oc_history;
    this.tipoDoc = 'rut';
    this.formarRut = '';
    this.resultsShippingDetail = [];
  }
}
