import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'with-options',
  templateUrl: 'data-table.component.html'
})
export class DataTableComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'simple',
      
    };
  }
}