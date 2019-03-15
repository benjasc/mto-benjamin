import { HttpClient } from '@angular/common/http';
import { CommonService } from './../../shared/services/common.service';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { map } from 'rxjs/operators';
import { EmisionUnitariaModel } from '../model/emisionUnitariaGde.model';
@Injectable()
export class EmisionUnitariaGdeService {
    private metodo: string;
    public url_api: string;
    ret: any;

    constructor(public http: HttpClient, private commonService: CommonService) {
        this.url_api = environment.url_api;
    }

    public getGuiasDespacho (inputOCRut: String) {
        this.metodo = '/getGuiasDespacho';
        return this.http.get(this.url_api + this.metodo + '/' + inputOCRut).pipe(map(res => res));
    }
}
