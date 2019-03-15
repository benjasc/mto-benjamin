import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoginService } from './../../../shared/services/login.service';
import { HttpClient } from '././../../../../directives/httpClient/httpclient';
import { Usuario } from './../../../shared/vo/usuario';
import { Globals } from './../../../shared/utils/globals';
import { Router } from '@angular/router';
import { MenuProfile } from './../../../shared/vo/menu';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  providers: [LoginService, HttpClient],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent implements OnInit {
  private menu: MenuProfile[];

  nameUser: string;

  config: any[];
  // logoApp: any;

  usuario: Usuario;
  logo: any;
  isModalActive = false;

   editable: Boolean;


  constructor(public globals: Globals, public router: Router, public loginService: LoginService) {

    this.config = this.globals.getValue();
    if (this.config.length > 0) {
      this.logo  = this.config[0].theme;
      this.usuario = this.config[1].val;
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {

    // if (sessionStorage.getItem('flagRoute') === 'dashboard') {
     // this.router.navigate(['/']);
    // }

    // usuario
    this.usuario = this.config[1].val;
    // menu
    this.menu = this.config[2].val;

    // Modulos de acceso a ordenes
    console.log(
      'Access : ' + this.menu[0].idAccess + ' / ' + this.menu[0].idModule + ''
    );

    if (this.menu[0].idAccess === 3) {
      this.editable = true;
    } else {
      this.editable = false;
    }
    console.log('Editable : ' + this.editable);

  }
}
