import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';

@Injectable()
export class OrderTypeService {
  public url_api: string;

  constructor(private http: Http, private commonService: CommonService) {
    this.url_api = environment.url_api;
  }

  getOrderType() {
    console.log('getOrderType');
    return this.http.get(this.url_api + '/getOrderType',
    { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }
}
