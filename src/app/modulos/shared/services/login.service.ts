import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from './../../../../environments/environment';
import { CommonService } from './common.service';

@Injectable()
export class LoginService {
    private metodo: string;
    public url_api: string;

    constructor(public http: Http, private commonService: CommonService) {
        this.url_api = environment.url_api;
    }

    getCompanies() {
        this.metodo = '/getCompanies';
        return this.http.get(this.url_api + this.metodo).map(res => res.json());
    }

    getStoresFromCompany(idCompany: string) {
        this.metodo = '/getStoresFromCompany/';
        return this.http.get(this.url_api + this.metodo + idCompany).map(res => res.json());
    }
/*
    private handleError(error: any) {
        console.error('Error', error);
        return Promise.reject(error.message || error);
    }
*/
    loginUser(user: string, password: string, cadena: string) {
        this.metodo =  '/auth';
        return this.http.post(this.url_api + this.metodo, {
            'user': user,
            'password': password,
            'cadena': cadena
        }, {}).map(res => res.json());
    }

    insertLogLogout(idEvent: number, orderNumber: number, idUser: number) {
        this.metodo = '/insertlog/' + idEvent + '/' + orderNumber + '/' + idUser;
        return this.http.get(this.url_api + this.metodo,
            { headers: this.commonService.createHeaderContent() }).map(res => res.json());
    }
    /*
    Metodo para insertar log
    @param Integer, idEvent 1	LogIn - 2	LogOut - 3	Empujar Error - 4	Modificar Email -5	Modificar DTE - 6	Reenvio Email
    @param Integer, Numero de orden
    @param Integer, id usuario
    */
    insertLogAuth(idEvent: number, orderNumber: number, idUser: number) {
        this.metodo = '/insertlog/' + idEvent + '/' + orderNumber + '/' + idUser;
        return this.http.get(this.url_api + this.metodo,
            { headers: this.commonService.createHeaderContent() }).map(res => res.json());
    }
    // metodo para eliminar regitro de la tabla sesion
    logoutDeleteSession(idUser: number) {
        this.metodo =  '/logoutDeleteSession/' + idUser;
        console.log(idUser);
        return this.http.get(this.url_api + this.metodo,
            { headers: this.commonService.createHeaderContent() }).map(res => res.json());
    }

}
