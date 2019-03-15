import { CommonService } from './common.service';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { environment } from './../../../../environments/environment';

@Injectable()
export class LogService {
  metodo: string;
  public url_api: string;


  constructor(private http: Http,
    private commonService: CommonService) {
     this.url_api = environment.url_api;
  }

   insertLog(idEvent: number, orderNumber: number, idUser: String) {
    console.log('idUSer = ' + idUser);
    const method = '/insertlog/' + idEvent + '/' + orderNumber + '/' + idUser;
    return this.http.get(this.url_api + method, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  insertarLogBitacora(idEvento: number, idOrder: number, idUser: number,
    valorAntiguo: string, valorNuevo: string) {
    this.metodo = '/insertarLogBitacora';
    return this.http.post(this.url_api + this.metodo, {
      'idEvento': idEvento,
      'idOrder': idOrder,
      'idUser' : idUser,
      'valorAntiguo': valorAntiguo,
      'valorNuevo': valorNuevo,
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

}
