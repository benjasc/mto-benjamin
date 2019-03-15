import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Greeting } from './modulos/shared/vo/greeting';
import { environment } from '../environments/environment';

@Injectable()
export class DataService {
    public url_api: string;
    private customersUrl = 'customer';  // URL to web API
    private greetingUrl = '/app/greeting';  // URL to web API
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
        this.url_api = environment.url_api;
    }

    // Get all customers
    getGreeting(): Promise<Greeting> {
        return this.http.get(this.url_api + this.greetingUrl)
        .toPromise()
        .then(response => response.json() as Greeting)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('Error', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
