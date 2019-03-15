import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { environment } from './../../../../environments/environment';
import { CommonService } from './../../shared/services/common.service';

@Injectable()
export class LoyaltypayService {

  methodSearchLoyaltyPayInfo: String = '/getLoyaltyPay/';
  methodSearchLoyaltyPayInfoUpdate: String  = '/getLoyaltyPayUpdate/';
  methodLoyaltyPayUpdate: String = '/loyaltyPayUpdate/';

  public url_api: string;

  constructor( private http: Http,
    private commonService: CommonService) {
    this.url_api = environment.url_api;
  }

  searchInfoLoyaltyPay(idLoyaltyPaypoint: Number, internatId: Number, idStore: Number) {
    console.log( ' idLoyaltyPaypoint : ' + idLoyaltyPaypoint + ' internatid: ' + internatId + ' idStore: ' +  idStore);
    const apiURL = `${this.url_api + this.methodSearchLoyaltyPayInfo}`;
    return this.http.post(apiURL
      , { idLoyaltyPaypoint: idLoyaltyPaypoint, internatId: internatId, idStore: idStore},
       { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchInfoLoyaltyPayUpdate(idLoyaltyPayPoint: Number) {
    console.log( ' >>  ' + idLoyaltyPayPoint);
    const apiURL = `${this.url_api + this.methodSearchLoyaltyPayInfoUpdate}`;

    return this.http.post(apiURL, {idLoyaltyPayPoint: idLoyaltyPayPoint},
      { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  editLoyaltyPay(idLoyaltyPayPoint: Number, factor: String, factorSdv) {
    console.log('modificar Loyalty Pay Point ' + idLoyaltyPayPoint + ' >>' + factor + '>' + factorSdv );
    const apiURL = `${this.url_api + this.methodLoyaltyPayUpdate}`;
    return this.http.post(apiURL, {idLoyaltyPayPoint: idLoyaltyPayPoint, factor: factor, factorSdv: factorSdv},
       { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

}
