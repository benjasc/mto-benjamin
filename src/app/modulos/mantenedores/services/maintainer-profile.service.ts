import { CommonService } from './../../shared/services/common.service';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { environment } from './../../../../environments/environment';

@Injectable()
export class MaintainerProfileService {

  methodSearchProfileInfo: String = '/profileInfo/';
  methodProfileUpdate: String = '/profileUpdate/';
  methodProfileInsert: String = '/profileInsert/';
  methodModuleProfileUpdate: String = '/moduleProfileUpdate/';
  methodModuleProfileInsert: String = '/moduleProfileInsert/';

  methodSearchProfileInfoUpdate: String  = '/profileInfoUpdate/';
  methodSearchProfileInfoInsert: String  = '/profileInfoInsert/';
  methodSearchModuleProfileInfoInsert: String = '/moduleProfileInfoInsert/';

  public url_api: string;

  constructor(private http: Http, private commonService: CommonService) {
      this.url_api = environment.url_api;
  }

  getProfile() {
    console.log('getProfile');
    return this.http.get(this.url_api + '/getProfile', { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  getAccess() {
    console.log('getAccess');
    return this.http.get(this.url_api + '/getAccess', { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchInfoProfile(idProfile: String, area: String, perfil: string) {
    console.log( 'searchInfoProfile: ' + ' idProfile : ' + idProfile + ' area: ' + perfil );
    const apiURL = this.url_api + this.methodSearchProfileInfo;
    return this.http.post(apiURL, {
      idProfile: +idProfile,
      area: area, perfil: perfil
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchInfoProfileUpdate(idProfile: string) {
    console.log( 'searchInfoProfileUpdate:  ' + idProfile );
    const apiURL = this.url_api + this.methodSearchProfileInfoUpdate;
    return this.http.post(apiURL, {
      idProfile: +idProfile, status: -1, access: -1
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchInfoProfileInsert(status: string) {
    console.log( 'searchInfoProfileInsert: ' + status );
    const apiURL = this.url_api + this.methodSearchProfileInfoInsert;
    return this.http.post(apiURL, {
      status: +status
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  searchInfoModuleProfileInsert(status: string) {
    console.log( 'ModuleProfileInsert: ' + status );
    const apiURL = this.url_api + this.methodSearchModuleProfileInfoInsert;
    return this.http.post(apiURL, {
      status: +status
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  editProfile(idProfile: String, area: String, perfil: String) {
    console.log('editProfile ' + idProfile + ' / ' + '' + area + ' / ' + perfil );
    const apiURL = this.url_api + this.methodProfileUpdate;
    return this.http.post(apiURL, {
      idProfile: +idProfile,
      area: area,
      perfil: perfil
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  editModuleProfile(idProfile: number, idModule: number, idAccess: number) {
    console.log('editModuleProfile  ' + idProfile + ' / '  + idModule + ' / ' + idAccess );
    const apiURL = this.url_api + this.methodModuleProfileUpdate;
    return this.http.post(apiURL, {
      idProfile: idProfile,
      idModule: idModule,
      idAccess: idAccess
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  insertProfile(area: String, perfil: String) {
    console.log('insertar perfiles ' + '' + area + ' >> ' + perfil );
    const apiURL = this.url_api + this.methodProfileInsert;
    return this.http.post(apiURL, {
      area: area,
      perfil: perfil
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }

  insertModuleProfile(idProfile: number, idModule: number, idAccess: number) {
    console.log('insertModuleProfile ' + idProfile + ' / ' + '' + idModule + ' / ' + idAccess );
    const apiURL = this.url_api + this.methodModuleProfileInsert;
    return this.http.post(apiURL, {
      idProfile: idProfile,
      idModule: idModule,
      idAccess: idAccess
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }
}
