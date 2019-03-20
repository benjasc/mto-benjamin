import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.scss']
})
export class MainNavbarComponent implements OnInit {
  titulo: string;
  constructor() { }

  ngOnInit() {
    this.titulo = sessionStorage.getItem('titulo');

  }

}
