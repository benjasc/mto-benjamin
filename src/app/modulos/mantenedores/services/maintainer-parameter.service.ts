import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from './../../../../environments/environment';
import { CommonService } from './../../shared/services/common.service';

@Injectable()
export class MaintainerParameterService {
  metodo: string;
  urlApi: string;
  constructor(public http: Http,
    private commonService: CommonService) {
    this.urlApi = environment.url_api;
   }

  obtenerProperties(idTienda: number, idFather: number) {
    this.metodo = '/getProperties';
    return this.http.post(this.urlApi + this.metodo, {
      'idTienda': idTienda,
      'idFather': idFather
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }
  modificarProperties(idCategoria: number, idProperty: number, valorAnterior: string,
    valorNuevo: string, cadena: number, idUsuario: number, descripcion: string) {
    this.metodo = '/modificaProperty';
    return this.http.post(this.urlApi + this.metodo, {
      'idCategoria': idCategoria,
      'idProperty': idProperty,
      'valorAnterior': valorAnterior,
      'valorNuevo': valorNuevo,
      'cadena': cadena,
      'idUsuario': idUsuario,
      'descripcion': descripcion
    }, { headers: this.commonService.createHeaderContent() }).map(res => res.json());
  }
}
