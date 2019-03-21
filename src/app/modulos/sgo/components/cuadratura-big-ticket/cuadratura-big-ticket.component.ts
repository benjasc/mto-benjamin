import { Component, OnInit } from '@angular/core';
import { IMyDateModel } from 'mydatepicker';
@Component({
  selector: 'app-cuadratura-big-ticket',
  templateUrl: './cuadratura-big-ticket.component.html',
  styleUrls: ['./cuadratura-big-ticket.component.scss']
})
export class CuadraturaBigTicketComponent implements OnInit {


  fecha:String;
  constructor() { }

  ngOnInit() {
  }

  action(){
    console.log(this.fecha);
  }

}


