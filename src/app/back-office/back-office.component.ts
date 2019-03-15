import { Usuario } from './../modulos/shared/vo/usuario';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from './../modulos/shared/utils/globals';

@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.scss']
})
export class BackOfficeComponent implements OnInit {
  private config: any;
  public logoApp: string;
  public usuario: Usuario;

  constructor(private globals: Globals, private router: Router) {
    // limpiar configuracion anterior
    // this.cleanSearch();

    this.config = this.globals.getValue();
    if (this.config.length > 0) {
      console.log('BackOfficeComponent this.config.length: ' + this.config.length);
      this.logoApp  = this.config[0].theme;
      this.usuario = this.config[1].val;
      // console.log('BackOfficeComponent config1: ' + JSON.stringify(this.usuario));
      // console.log('BackOfficeComponent config2: ' + JSON.stringify(this.config[2].val));
      // console.log('BackOfficeComponent usuario.name: ' + this.usuario.name);
      // console.log('BackOfficeComponent menu.length: ' + this.autentication.menu.length);
    } else {
      this.router.navigate(['/back-office/login/']);
    }
  }

  ngOnInit() {
    // limpiar configuracion anterior
    // this.cleanSearch();
  }

  cleanSearch() {
    this.config = null;
    this.logoApp = null;
    this.usuario = null;
  }
}
