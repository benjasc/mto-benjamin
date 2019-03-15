import 'rxjs/add/operator/toPromise';
import { Injectable, ViewChild } from '@angular/core';

import { Http } from '@angular/http';
import { environment } from './../../../../environments/environment';
import { SearchService } from './../../shared/services/searchservice';
import { CommonService } from './../../shared/services/common.service';




@Injectable()
export class EmailTemplateService {
  methodSearchEmail: String = '/email/';
  methodUpdateEmail: String = '/emailCustomerUpdate/';
  methodDetailEmail: String = '/emailByOC/';
  methodForwardEmail: String = '/forwardEmail/';
  methodDetailAllEmail: String = '/allEmailByOC/';
  methodSearchEmailTemplate: String = '/emailTemplateInfo/';
  methodUpdateEmailTemplate: String = '/emailTemplateUpdate/';
  methodGetEmailTemplate: String =  '/getEmailTemplate/';
  public url_api: string;
  // revisar si son necesario estos objetos
  // results: Object[];
  // resultsEmailByOC: Object[];
  // loadings: boolean;
  // loadingModificarEmail: boolean;
  // loadingForwardEmail: boolean;
  // formarRut: string;
  // resultUpdate = [];

  // tipoDoc: string;
  @ViewChild('myModalEmailInfo')
  myModalEmailInfo;
  constructor(private http: Http, public searchInfo: SearchService,
    private commonService: CommonService) {
    // this.loadings = false;
    // this.loadingModificarEmail = false;
    // this.loadingForwardEmail = false;
    // this.results = [];
    this.url_api = environment.url_api;
    // this.tipoDoc = 'rut';
  }

  getEmailTemplate(idStore: number) {
    console.log('getEmailTemplate');
    return this.http.get(this.url_api + this.methodGetEmailTemplate + idStore,
    { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchEmailTemplate(idEmail: Number, idStore: number, name: string, description: String,
    subject: String, to: String, from: String) {
    console.log( idEmail + '>>>' + idStore + '>>>' +  name + '>>>' + description + '>>>' + subject + '>>>' +  to + '>>>' + from);
    const apiURL = this.url_api + this.methodSearchEmailTemplate;
    return this.http.post(apiURL, {
          idEmail: idEmail,
          idStore: idStore,
          name: name,
          description: description,
          subject: subject,
          to: to,
          from: from
        }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  editEMailTemplateInfo(idEmail: String, emailDescription: String, emailSubject: String, emailFrom: String
    , emailName: String, emailBody: String, filename: string) {
    console.log('modificar email template ' + idEmail + ' >> ' + emailDescription + '>>' + emailSubject
     + ' >> ' + emailFrom + ' >> ' + emailName + '>>' + emailBody);
    const apiURL = this.url_api + this.methodUpdateEmailTemplate;
    return this.http.post(apiURL, {
          idEmail: idEmail,
          name: emailName,
          description: emailDescription,
          subject: emailSubject,
          from: emailFrom,
          body: emailBody,
          filename: filename
        }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }
}
