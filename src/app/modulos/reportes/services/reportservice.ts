import { CommonService } from './../../shared/services/common.service';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { environment } from './../../../../environments/environment';

@Injectable()
export class ReportService {
  methodSearchOc: String = '/report/searchBreakStockInfo/';
  methodSearchDetail: String = '/report/searchOrderInfoDetail/';
  methodErrorUpdateEOM: String = '/report/searchErrorUpdateEomInfo/';

  public url_api: string;
  public url_oc_history: string;

  constructor(private http: Http, private commonService: CommonService) {
      this.url_api = environment.url_api;
      this.url_oc_history = environment.url_oc_history;
  }

  getChannel(id_store: number) {
    console.log('getChannel');
    return this.http.get(this.url_api + '/report/getChannel/' + id_store,
    { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  getOrderType() {
    console.log('getOrderType');
    return this.http.get(this.url_api + '/report/getOrderType',
    { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  getDocumentType() {
    console.log('getDocumentType');
    return this.http.get(this.url_api + '/report/getDocumentType',
    { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  search(documentType: number, channel: number, typeOrder: number, fechadesde: String, fechahasta: String) {
    console.log(documentType + '>>>' + channel + '>>>' + typeOrder +  '>>>' + fechadesde + '>>>' + fechahasta);
    const apiURL = this.url_api + this.methodSearchOc;
    console.log(apiURL + '/' + documentType + '/' + channel + '/' + typeOrder + '/' + fechadesde + '/' + fechahasta);
    return this.http.post(apiURL, {
      documentType: documentType,
      channel: channel,
      typeOrder: typeOrder,
      fechaCompraDesde: fechadesde,
      fechaCompraHasta: fechadesde
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchUpdateEom(documentType: number, channel: number, typeOrder: number, fechadesde: String, fechahasta: String) {
    console.log(documentType + '>>>' + channel + '>>>' + typeOrder +  '>>>' + fechadesde + '>>>' + fechahasta);
    const apiURL = this.url_api + this.methodErrorUpdateEOM;
    console.log(apiURL + ' / ' + documentType + ' / ' + channel + ' / ' + typeOrder + ' / ' + fechadesde + ' / ' + fechahasta);
    return this.http.post(apiURL, {}, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }
}

