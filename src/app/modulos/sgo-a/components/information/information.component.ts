import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  displayedColumns = ['SKU', 'Producto', 'Precio', 'FechaCompra','Canal','EstadoDesp'];
  dataSource = ELEMENT_DATA;

  dtOptions: DataTables.Settings = {};
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'simple',
      lengthChange:false,
      info : false,
       language : {
        infoPostFix: '',
        search: 'Buscar',
        zeroRecords: 'No se encontraron resultados',
        paginate: {
          first: 'Primero',
          last: 'Último',
          next: 'Siguiente',
          previous: 'Anterior',
           
        }
      }

    };
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}
export interface PeriodicElement {
  SKU: number;
  Producto: string;
  Precio: number;
  FechaCompra: string;
  Canal : string;
  EstadoDesp:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {SKU: 1, Producto: 'Hydrogen', Precio: 1.0079, FechaCompra: 'H',Canal:'Canal',EstadoDesp:'EstadoDesp'},
  {SKU: 2, Producto: 'Helium', Precio: 4.0026, FechaCompra: 'He',Canal:'Canal',EstadoDesp:'EstadoDesp'},
  {SKU: 3, Producto: 'Lithium', Precio: 6.941, FechaCompra: 'Li',Canal:'Canal',EstadoDesp:'EstadoDesp'},
  {SKU: 4, Producto: 'Beryllium', Precio: 9.0122, FechaCompra: 'Be',Canal:'Canal',EstadoDesp:'EstadoDesp'},
  {SKU: 5, Producto: 'Boron', Precio: 10.811, FechaCompra: 'B',Canal:'Canal',EstadoDesp:'EstadoDesp'},
  {SKU: 6, Producto: 'Carbon', Precio: 12.0107, FechaCompra: 'C',Canal:'Canal',EstadoDesp:'EstadoDesp'},
  {SKU: 7, Producto: 'Nitrogen', Precio: 14.0067, FechaCompra: 'N',Canal:'Canal',EstadoDesp:'EstadoDesp'},
  {SKU: 8, Producto: 'Oxygen', Precio: 15.9994, FechaCompra: 'O',Canal:'Canal',EstadoDesp:'EstadoDesp'},
  {SKU: 9, Producto: 'Fluorine', Precio: 18.9984, FechaCompra: 'F',Canal:'Canal',EstadoDesp:'EstadoDesp'},
  {SKU: 10, Producto: 'Neon', Precio: 20.1797, FechaCompra: 'Ne',Canal:'Canal',EstadoDesp:'EstadoDesp'},
];
