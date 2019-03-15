import { Utils } from './../../../shared/utils/utils';
import { Usuario } from './../../../shared/vo/usuario';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from './../../../shared/utils/globals';
import { LoginService } from './../../../shared/services/login.service';
import { HttpClient } from './../../../../directives/httpClient/httpclient';
import { DialogService } from 'ng2-bootstrap-modal';
import { MessageService } from './../../../shared/services/message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [LoginService, HttpClient]
})
export class HeaderComponent implements OnInit {

  config: any[];
  // logoApp: any;

  usuario: Usuario;
  logo: any;
  isModalActive = false;
  url: any;
  utils: Utils;

  constructor(public globals: Globals, public router: Router, public loginService: LoginService
    , private dialogService: DialogService, private messageService: MessageService) {
    console.log('====' + sessionStorage.getItem('username'));
    this.config = this.globals.getValue();
    if (this.config.length > 0) {
      this.logo  = this.config[0].theme;
      this.usuario = this.config[1].val;
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
      // setTimeout(() => {
      //  this.logout();
      // }, 600000);
    } else {
      this.router.navigate(['/']);
    }
  }

   @ViewChild('myProfile') myProfile;

  public logout() {
    console.log(sessionStorage.getItem('idUser'));
    const idUser = sessionStorage.getItem('idUser');
    this.loginService.logoutDeleteSession(Number(idUser)).subscribe(
      result => {
        console.log(result);
         this.utils.validarRespuestaFormatear(result);
         this.messageService.cargando(false);
        // if (result.code === 0 && result.code !== undefined) {
        //   console.log('correcta eliminacion de sesión');
        // } else {
        //   console.log('problemas al eliminar la sesión');
        // }
      },
      error => {
        this.messageService.cargando(false);
        console.log(<any>error);
      }
    );
    // borrar globals
    this.globals.clean();
    sessionStorage.removeItem('token');
    // redireccionar login
    // this.location.replaceState('/');
    this.router.navigate(['/']);

    this.loginService.insertLogAuth(2, 0, this.usuario.idUser).subscribe(
      result => {
        console.log('insertamos log correctamente');
        console.log(result);
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  ngOnInit() {
    console.log('Url Header ' + this.router.url);
    this.url = this.router.url;

  }

   openProfile() {
    // open Modal
     this.myProfile.open();
  }


}
