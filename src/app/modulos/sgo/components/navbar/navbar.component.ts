import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit, OnDestroy, OnInit {
//tabla 2
displayedColumns = ['Fecha', 'Canal', 'OC', 'EstOC','TipoDesp','FactBol','FolioDte'];
  dataSource = ELEMENT_DATA;
  //tabla 2
  //tabla 3
displayedColumnss = ['Codigo', 'Descripcion', 'Valor'];
dataSourcee = ELEMENT_DATA2;
//tabla 3


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

 dtTrigger: Subject<any> = new Subject();

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple',
      lengthChange:false,
      info : false,
       language : {
        infoPostFix: '',
        search: 'Filtro',
        zeroRecords: 'No se encontraron resultados',
        paginate: {
          first: 'Primero',
          last: 'Último',
          next: 'Siguiente',
          previous: 'Anterior',
           
        }
      },
      ajax: 'data/data.json',
      columns: [{
        title: 'SKU',
        data: 'id'
      },
      {
        title: 'Producto',
        data: 'id'
      },
      {
        title: 'Precio',
        data: 'id'
      },
      {
        title: 'Fecha Compra',
        data: 'id'
      },
      {
        title: 'Canal',
        data: 'id'
      },
      {
        title: 'Estado Desp.',
        data: 'id'
      }]
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}

export interface Element {
  Fecha: string;
  Canal: String;
  OC: number;
  EstOC: string;
  TipoDesp: string;
  FactBol: string;
  FolioDte: number;

}

const ELEMENT_DATA: Element[] = [
  {Fecha: '01-07-2015', Canal: 'Ripley.com', OC: 53748294, EstOC: 'Boleta',TipoDesp:'D.Domicilio AM',FactBol:'Boleta',FolioDte:288239344}
];

//tabla 3
export interface Element2 {
  Codigo: string;
  Descripcion: String;
  Valor: number;
  
}

const ELEMENT_DATA2: Element2[] = [
  {Codigo: '54354677895', Descripcion: 'Docking Philips 1x39.0000000', Valor: 39000},
  {Codigo: '54354677895', Descripcion: 'Docking Philips 1x39.0000000', Valor: 39000},
  {Codigo: '54354677895', Descripcion: 'Docking Philips 1x39.0000000', Valor: 39000}
];
//tabla 3
