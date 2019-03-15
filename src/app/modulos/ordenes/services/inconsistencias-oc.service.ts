import { CommonService } from './../../shared/services/common.service';
import { TrxInject } from './../../../modulos/ordenes/vo/TrxInject';
import { TrxIdentify } from './../../../modulos/ordenes/vo/TrxIdentify';
import { TrxHdr } from './../../../modulos/ordenes/vo/TrxHdr';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { environment } from './../../../../environments/environment';
import { MessageService } from './../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';

@Injectable()
export class InconsistenciasOcService {
  data: any;
  public url: string;
  public url_api: string;
  resultsDetail: Object[];
  url_reinject_oc: String;
  result: Object[];
  errorMessage: String;

  constructor(public http: Http,
    private messageService: MessageService,
    private dialogService: DialogService,
    private commonService: CommonService) {
    this.url = environment.url;
    this.url_api = environment.url_api;
    this.url_reinject_oc = environment.url_reinject_order;
  }

  getStateActions() {
    console.log('getStateActions');
    return this.http.get(this.url_api + '/errors/', { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  getListLegacyErrors(stateAction: String, start: string, end: string, idChannel: number, idStore: number, oc: String, typeOrder: String) {
     console.log('getListLegacyErrors ' + 'stateAction >>' + stateAction + ' start >>' + start +  ' end >>' + end
      + ' idChannel >>' + idChannel + ' idStore >>' + idStore + ' oc >>' + oc + ' typeOrder >>' + typeOrder);
    return this.http.post(this.url_api + '/errors/orders', {status: stateAction, startDate: start,  endDate: end, channel: 1
      , store: 1, ordenCompra: oc, typeOrder: typeOrder }
    , { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  getListLegacyErrorsSFCC(stateAction: String, startDate: string, endDate: string, idChannel: number
                  , idStore: number, oc: String, typeOrder: String) {
     console.log('getListLegacyErrorsSFCC ' + ' stateAction >>' + stateAction + ' startDate >>' + startDate
     +  ' endDate >>' + endDate + ' idChannel >>' + idChannel + ' idStore >>' + idStore + ' oc >>' + oc + ' typeOrder >>' + typeOrder);
    return this.http.post(this.url_api + '/errors/files', {status: stateAction, startDate: startDate, endDate: endDate
                    , ordenCompra: oc, typeOrder: typeOrder},
    { headers: this.commonService.createHeaderContent() })
                  .map(res => res.json());
  }

  searchDetail(oc: string) {
    return this.http.get(this.url_api + '/searchOrderInfoDetail/' + oc,
     { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }



  public toInt(num: string) {
    return +num;
  }

  public sortByWordLength = (a: any) => {
    return a.city.length;
  }

  public remove(item) {
    const index = this.data.indexOf(item);
    if (index > -1) {
      this.data.splice(index, 1);
    }
  }

  /* reinjectOrder(oc: String) {
    const method = '/order/reinject';
    const url_api = 'https://01x6uja1p6.execute-api.us-west-2.amazonaws.com/dev';
    const jsonResponse = this.http.post(this.url_api + method, '').map(res => res.json());
  } */

  reinjectOrder(oc: String, _trxHdr: TrxHdr, _trxIdentify: TrxIdentify, _trxInject: TrxInject) {
    const method = '/order/reinject';
    const req = new Promise((resolve, reject) => {
    const apiURL = this.url_reinject_oc + method;
    this.http.post(apiURL, { trxHdr: _trxHdr, trxIdentify: _trxIdentify, trxInject: _trxInject})
    .subscribe(
          res => {
              console.log(res.json());
              this.result = res.json();
              this.errorMessage = this.result.length + '';
              resolve();
          },
          err => {
            console.log('Error occured');
            reject(err);
            this.errorMessage = 'Error en la consulta : ' + err;
          }
        );
       return req;
    }).catch(function(error) {
      this.errorMessage = 'ERROR : ' + error;
    });
  }

  reinjectOrder2(_trxHdr: TrxHdr, _trxIdentify: TrxIdentify, _trxInject: TrxInject) {
    const method = '/order/reinject';
    const apiURL = this.url_reinject_oc + method;
    /* const _headers = new Headers({'Content-Type': 'application/json', 'Cache-Control': 'no-cache',
    'Postman-Token': 'c426a6cc-9a59-b02b-d795-9836599f89d3'}); */

    console.log('llamada a servicio reinjectOrder2');

    return this.http.post(apiURL, { trxHdr: _trxHdr, trxIdentify: _trxIdentify, trxInject: _trxInject })
    .catch(error => {
      console.log('error del servicio de reinyeccion');
      this.messageService.enviarMensaje('Error Acción', ['Error al procesar orden errónea'], 'info', this.dialogService);
      throw new Error('Error al procesar orden errónea');
    });
  }

  reinjectOrder3(_trxHdr: TrxHdr, _trxIdentify: TrxIdentify, _trxInject: TrxInject) {
    const method = '/order/reinject';
    const apiURL = this.url_reinject_oc + method;
    /* const _headers = new Headers({'Content-Type': 'application/json', 'Cache-Control': 'no-cache',
    'Postman-Token': 'c426a6cc-9a59-b02b-d795-9836599f89d3'}); */

    console.log('llamada a servicio reinjectOrder3');

    return this.http.post(apiURL, { trxHdr: _trxHdr, trxIdentify: _trxIdentify, trxInject: _trxInject }).map(res => res.json());
  }

  getActions(origin: number, error: number) {
    const method = '/error/actions';
    const apiURL = this.url_reinject_oc + method;
    return this.http.get(this.url_api + method + '/' + origin + '/' + error,
     { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  updateError(orderNumber: number, origin: number, store: number, channel: number) {
     console.log('llamada a servicio updateError: ' + orderNumber + ' / ' + origin + ' / ' + store + ' / ' + channel);

    const method = '/error/delete';
    const apiURL = this.url_reinject_oc + method;
    return this.http.get(this.url_api + method  + '/' + orderNumber + '/' + origin  + '/' + store  + '/' + channel,
    { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  updateErrorMassive(requestJson: String, idStore: Number, idChannel: Number, legacy: Number) {
    console.log('modificar user ' + requestJson + ' >> ' + '' + idStore + ' >> ' + idChannel
      + '>>' + legacy );
    const method = '/updateErrorMassive';
    const apiURL = `${this.url_api + method}`;
    return this.http.post(apiURL, {requestJson: requestJson, idStore: idStore, idChannel: idChannel, legacy: legacy
                  }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }


  updateError2(orderNumber: String, origin: String, store: String, channel: String) {
    const method = '/error/delete';
    const apiURL = this.url_reinject_oc + method;
    return this.http.get(this.url_api + method  + '/' + orderNumber + '/' + origin  + '/' + store  + '/' + channel).map(res => res.json());
  }

  insertLog(idEvent: number, orderNumber: number, idUser: number) {
    const method = '/insertlog/' + idEvent + '/' + orderNumber + '/' + idUser;
    return this.http.get(this.url_api + method, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  updateStatusItems(orderNumber: number) {
    const method = '/order/update/items';

    const apiURL = this.url_reinject_oc + method;

    return this.http.get(this.url_api + method + '/' + orderNumber,
    { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }
}
