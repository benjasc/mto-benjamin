import { Component, OnInit } from '@angular/core';
import { IMyDateModel } from 'mydatepicker';
import { Session } from 'protractor';

@Component({
  selector: 'app-cuadratura-big-ticket',
  templateUrl: './cuadratura-big-ticket.component.html',
  styleUrls: ['./cuadratura-big-ticket.component.scss']
})



export class CuadraturaBigTicketComponent implements OnInit {
  fecha:String;
  titulo:string;
  constructor() {
    this.titulo = "Consulta de Cuadratura BigTicket - BackOffice";
    sessionStorage.setItem("titulo",this.titulo);
   }

  ngOnInit() {
  }

  action(){
    console.log(this.fecha);
  }

}


