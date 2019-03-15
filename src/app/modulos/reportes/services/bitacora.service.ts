import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { environment } from './../../../../environments/environment';
import { CommonService } from './../../shared/services/common.service';

@Injectable()
export class BitacoraService {
  methodSearchBitacoraInfo: String = '/searchBitacoraInfo/';
  public url_api: string;

  constructor(private http: Http, private commonService: CommonService) {
    this.url_api = environment.url_api;
  }

  getUsers(idUser: Number, idStore: Number, idStatus: Number) {
    console.log('getUsers');
    return this.http.get(this.url_api + '/getUser/' + idUser + '/' + idStore + '/' + idStatus,
    { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  getEvents() {
    console.log('getEvents');
    return this.http.get(this.url_api + '/getEvents',
    { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchInfoBitacora(idLog: String, idUser: String, idEvent: String, oldValue: string, newValue: string,
    fechadesde: String, fechahasta: String, ordenCompra: String, nameLastName: String) {
    console.log('idLog: ' + idLog + ' idUser: ' + idUser + ' idEvent: ' + idEvent + ' oldValue: ' + oldValue
    + ' newValue: ' + newValue + ' fechadesde: '  + fechadesde + ' fechahasta: ' + fechahasta
    + ' ordenCompra: ' + ordenCompra +  ' nameLastName: ' + nameLastName);
    const apiURL = this.url_api + this.methodSearchBitacoraInfo;
    return this.http.post(apiURL, {
      idLog: +idLog,
      idUser: +idUser,
      idEvent: +idEvent,
      oldValue: +oldValue,
      newValue: +newValue,
      fechaCompraDesde: fechadesde,
      fechaCompraHasta: fechahasta,
      ordenCompra: +ordenCompra,
      nameLastName: nameLastName
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }
}
