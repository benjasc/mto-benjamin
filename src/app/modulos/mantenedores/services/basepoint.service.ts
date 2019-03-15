import { CommonService } from './../../shared/services/common.service';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { environment } from './../../../../environments/environment';

@Injectable()
export class BasepointService {

  methodSearchBasePointInfo: String = '/getBasePoint/';
  methodSearchBasePointInfoUpdate: String  = '/getBasePointUpdate/';
  methodBasePointUpdate: String = '/basePointUpdate/';

  public url_api: string;

  constructor( private http: Http, private commonService: CommonService) {
     this.url_api = environment.url_api;
  }


  searchInfoBasePoint(idLoyaltyBasePoint: Number, documentType: Number, idStore: Number) {
    console.log(' idLoyaltyBasepoint : ' + idLoyaltyBasePoint + ' documentType: ' + documentType + ' idStore: ' +  idStore);
    const apiURL = `${this.url_api + this.methodSearchBasePointInfo}`;
    return this.http.post(apiURL
      , { idLoyaltyBasePoint: idLoyaltyBasePoint, documentType: documentType, idStore: idStore}
      , { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchInfoBasePointUpdate(idLoyaltyBasePoint: Number) {
    console.log( ' >>  ' + idLoyaltyBasePoint);
    const apiURL = `${this.url_api + this.methodSearchBasePointInfoUpdate}`;

    return this.http.post(apiURL, {idLoyaltyBasePoint: idLoyaltyBasePoint},
      { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  editBasePoint(idLoyaltyBasePoint: Number, factor: String, factorSdv: String) {
    console.log('modificar Base Point ' + idLoyaltyBasePoint + ' >> ' + factor + '>' +  factorSdv);
    const apiURL = `${this.url_api + this.methodBasePointUpdate}`;
    return this.http.post(apiURL, {idLoyaltyBasePoint: idLoyaltyBasePoint, factor: factor, factorSdv: factorSdv},
      { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

}
