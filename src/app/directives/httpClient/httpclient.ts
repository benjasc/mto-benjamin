/**
 * Created by josegarridojana on 31-05-18.
 */
import {Injectable} from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class HttpClient {

  constructor(private _http: Http) {

  }

  createAuthorizationHeader(headers: Headers) {
    // headers.append('Authorization', 'Basic ' + btoa('username:password'));
    // headers.append('X-Parse-Application-Id','vibXzblJbLma64MWAa0fEW58kpsAXvPEORttiqSG');
    // headers.append('X-Parse-REST-API-Key','yt2Per1uhwXEMY7W9ml6QeKAEurRww3PApyXyyx0');
   // headers.append('Content-Type','application/json;');


    // tslint:disable-next-line:max-line-length
    // headers.append('authorization','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OTAwZDc5ZmFlZjQ1ODFjZWQwOThhNTgiLCJpYXQiOjEdfdfd0OTMyNTIxODMsImV4cCI6MTQ5NDQ2MTc4M30.FCqGnlmPuRc7YhIaxY7KmIxCq765-HyQvIgeJVucpjI');
    // headers.append('Access-Control-Allow-Origin','*');
    // headers.append('Invsec-Version','1');
    // headers.append('Invsec-Channel','1');
    // headers.append('Access-Control-Allow-Credentials','true');
    // headers.append('Access-Control-Allow-Headers', 'Authorization, Content-Type');//'X-Requested-With,content-type');




    // headers.append('Invsec-Type','application/json');


    // headers.append('Access-Control-Allow-Methods','POST, GET, OPTIONS, PUT');

    // headers.append('X-XSRF-Token','XXX');

  }

  createAuthorizationHeader2(headers: Headers) {
    // headers.append('Authorization', 'Basic ' + btoa('username:password'));
    // headers.append('X-Parse-Application-Id','vibXzblJbLma64MWAa0fEW58kpsAXvPEORttiqSG');
    // headers.append('X-Parse-REST-API-Key','yt2Per1uhwXEMY7W9ml6QeKAEurRww3PApyXyyx0');
   // headers.append('Content-Type','application/json;');


    // tslint:disable-next-line:max-line-length
    // headers.append('authorization','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OTAwZDc5ZmFlZjQ1ODFjZWQwOThhNTgiLCJpYXQiOjEdfdfd0OTMyNTIxODMsImV4cCI6MTQ5NDQ2MTc4M30.FCqGnlmPuRc7YhIaxY7KmIxCq765-HyQvIgeJVucpjI');
    // headers.append('Access-Control-Allow-Origin','*');
    // headers.append('Invsec-Version','1');
    // headers.append('Invsec-Channel','1');
    // headers.append('Access-Control-Allow-Credentials','true');
    // headers.append('Access-Control-Allow-Headers', 'Authorization, Content-Type');//'X-Requested-With,content-type');




    // headers.append('Invsec-Type','application/json');


    // headers.append('Access-Control-Allow-Methods','POST, GET, OPTIONS, PUT');

    // headers.append('X-XSRF-Token','XXX');

  }


  get(url) {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);

    return this._http.get(url, {
      headers: headers
    });
  }

  post(url, data) {

  const headers = new Headers();
  this.createAuthorizationHeader2(headers);
  return this._http.post(url, data, { headers: headers });

    // this.createAuthorizationHeader(headers);
    // return this._http.post(url, data, {headers: headers});

    // return this._http.post(url, data, JSON.stringify({'Content-Type': 'application/json'}));
     // return this._http.post(url, data, httpOptions);


  }
}
