import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class CommonService {

  headers: Headers;

  constructor() { }

  createHeaderContent() {
    this.headers = new Headers();
    this.headers.append('X-Auth', sessionStorage.getItem('token'));

    return this.headers;
  }
  deleteSesionToken() {
    sessionStorage.removeItem('token');
  }


  createHttpHeader():HttpHeaders {
    let httpHeaders = new HttpHeaders();
    return httpHeaders.set('X-Auth', sessionStorage.getItem('token'));
  }
}
