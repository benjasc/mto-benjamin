import { Component, OnInit } from '@angular/core';
import {MainNavbarComponent} from '../shared/components/main-navbar/main-navbar.component';

@Component({
  selector: 'app-administracion-usuarios',
  templateUrl: './administracion-usuarios.component.html',
  styleUrls: ['./administracion-usuarios.component.scss']
})
export class AdministracionUsuariosComponent implements OnInit {

  titulo:string ;
  constructor() {  
    this.titulo = "Administracion de Usuarios";
    sessionStorage.setItem('titulo', this.titulo);
   }

  ngOnInit() {
  }

}
