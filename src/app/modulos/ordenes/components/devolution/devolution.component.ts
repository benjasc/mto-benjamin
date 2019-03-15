import { Utils } from './../../../shared/utils/utils';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchService } from './../../../shared/services/searchservice';
import { Globals } from './../../../shared/utils/globals';
import { Usuario } from './../../../shared/vo/usuario';
import { NcDetail } from './../../../../modulos/ordenes/vo/ncDetail';
import { Location } from '@angular/common';
import { MenuProfile } from './../../../shared/vo/menu';
import { MessageService } from './../../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { ActivatedRoute } from '@angular/router';
import { InconsistenciasOcService } from '../../services/inconsistencias-oc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-devolution',
  templateUrl: './devolution.component.html',
  styleUrls: ['./devolution.component.scss']
})
export class DevolutionComponent implements OnInit {

  searchservice: SearchService;
  resultsDetail: Object[];
  private config: any;

  public ncDetail: NcDetail[];

  // Perfilamiento
  private usuario: Usuario;
  private menu: MenuProfile[];
  editable: Boolean;

  ordernumbernc: String;
  public ordernumbernotecredit: Number;
  mpagoDetailList: Array<any>;
  saleDetail: Array<any>;

  public files: Array<any>;
  url: String;

  @ViewChild('modalHistory')
  modalHistory;
  utils: Utils;

  constructor(public searchInfo: SearchService, public globals: Globals, private location: Location, public messageService: MessageService,
    public dialogService: DialogService, public route: ActivatedRoute, public router: Router,
    public inconsistenciasOcService: InconsistenciasOcService) {
      this.resultsDetail = [];
      this.config = this.globals.getValue();
      this.editable = false;
      this.files = [];
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
     }

  ngOnInit() {
    this.ordernumbernc = this.route.snapshot.params.ordernumbernc;
    console.log('ordernumbernc ' + this.ordernumbernc);

    // cajas a pintar
    this.searchInfo.getTrazaNc('' + this.ordernumbernc).subscribe(
      result => {
        result = this.utils.validarRespuestaFormatear(result);
        // result = result.message.replace(/\n/ig, '');
        // result = JSON.parse(result);
        this.ncDetail = result.ncDetail;
        console.log('entramos a un status 200 ');
        console.log(result);
        for (let i = 0; i < result.ncDetail.length; i++) {
          this.doSearchBoxNcDetail('' + result.ncDetail[i].orderNumber);
          this.ordernumbernotecredit = result.ncDetail[i].orderNumber;
        }
      },
      error => {
        console.log('error');
        console.log(<any>error);
      }
    );
    // this.doSearchBoxNcDetail(this.ordernumbernc);
    this.doSearchNcDetailInfo(this.ordernumbernc);

    // usuario
    this.usuario = this.config[1].val;
    // menu
    this.menu = this.config[2].val;

    this.url = this.router.url;

    console.log('Access : '  + JSON.stringify(this.menu) + ' / ' + this.usuario.idUser +  ' / '  + this.router.url);

    for (let i = 0; i < this.menu.length; i++) {
      for (let j = 0; j < this.menu[i].subItems.length; j++) {
        console.log('Access Menu: ' + this.menu[i].idAccess + ' / ' + this.menu[i].idModule
        + ' / ' + this.menu[i].name + ' / ' +  this.menu[i].url);

        console.log('Access SubMenu: ' + this.menu[i].subItems[j].idAccess + ' / ' + this.menu[i].subItems[j].idModule
        + ' / ' + this.menu[i].subItems[j].name + ' / '  + ' / ' + this.menu[i].subItems[j].url);

        if (this.router.url === this.menu[i].subItems[j].url) {
          if (this.menu[i].subItems[j].idAccess > 2) {
            console.log('true');
            this.editable = true;
          } else {
            console.log('false');
            this.editable = false;
          }
        }
      }
    }
    console.log('Editable : ' + this.editable);
  }

  doSearchBoxNcDetail(oc: String) {
    // buscar cajas estado
    this.searchInfo.searchBoxDetail(oc);
  }

  doSearchDetailInfo(oc: String) {
    console.log('doSearchDetail');
    this.searchInfo.searchDetailInfo('' + oc);
  }

    doSearchNcDetailInfo(oc: String) {
    console.log('doSearchNcDetailInfo');
    this.searchInfo.searchNcDetailInfo('' + oc);
  }

  doSearchDetailInfo2(oc: String) {
    console.log('doSearchDetailInfo2');
    this.searchInfo.searchDetailInfo2('' + oc).subscribe(
      result => {
        console.log('entramos a un status 200 ');
        console.log(result);
        result = this.utils.validarRespuestaFormatear(result);
        // result = result.message.replace(/\n/ig, '');
        // result = JSON.parse(result);
        this.searchInfo.resultsDetail.mpagoDetailList = result.mpagoDetailList;
        this.searchInfo.resultsDetail.saleDetail = result.saleDetail;
      },
      error => {
        console.log('error');
        console.log(<any>error);
        this.messageService.enviarMensaje('Error búsqueda', ['Info no válido'], 'info', this.dialogService);
        // this.loading = false;
      }
    );
  }

  doModalLegacy(req: string, resp: String) {
    // menu
    this.menu = this.config[2].val;

    console.log('Access : ' + this.menu[0].idAccess + ' / ' + this.menu[0].idModule);
    if (this.menu[0].idAccess === 3) {
      this.searchInfo.setHitoryModal(req, resp);
      // open Modal
      this.modalHistory.open();
    } else {
      console.log('Usuario sin privilegios');
    }
  }

  doEditMail(orden: string, oldMail: String, newMail: String) {
    this.usuario = this.config[1].val;
    if (!this.validationEmail(newMail)) {
      this.messageService.enviarMensaje( 'Error búsqueda', ['Email no válido'], 'info', this.dialogService );
      this.searchInfo.searchDetail(orden);
      return;
    } else {
      this.searchInfo.editMail( orden,  newMail, oldMail, this.usuario.idUser + '' );
    }
  }

  doEditDte(orden: string, oldDte: String, newDte: String) {
    this.usuario = this.config[1].val;
    console.log( 'orden : ' +  orden + ' oldDte : ' + oldDte + ' newDte : ' + newDte + ' this.usuario.idUser : ' + this.usuario.idUser);
    // editar dte
    this.searchInfo.editDte(orden, newDte, oldDte, this.usuario.idUser + '');
  }

  validationEmail(email: any) {
    const EMAIL_REGEXP = /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/;
    if (EMAIL_REGEXP.test(email.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  onlyNumberKey(event) {
    return event.charCode === 8 || event.charCode === 0 ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  volver() {
    // history.go(-1);
    // history.back();
    const rut = sessionStorage.getItem('formRut');
    const dni = sessionStorage.getItem('formDni');
    const oc = sessionStorage.getItem('formOC');
    const sku = sessionStorage.getItem('formSku');
    const dire = sessionStorage.getItem('formDire');
    const dest = sessionStorage.getItem('formDest');
    const comprador = sessionStorage.getItem('formComprador');
    const codPe = sessionStorage.getItem('formCodPe');
    const fechaDesde = sessionStorage.getItem('formFechaDesde');
    const fechaHasta = sessionStorage.getItem('formFechaHasta');
    const formNombreRetira = sessionStorage.getItem('formNombreRetira');

     // history.go(-1);
    // history.back();
    this.searchInfo.search(  rut,  dni, oc, sku, dire, dest, comprador, codPe, fechaDesde, fechaHasta, formNombreRetira, null, null, null);
    console.log('=======' + sessionStorage.getItem('volverIc'));
    console.log('=======' + sessionStorage.getItem('volverEmail'));
    sessionStorage.setItem('volverIc', 'SI');
    sessionStorage.setItem('volverEmail', 'SI');
    this.location.back();
  }
}

