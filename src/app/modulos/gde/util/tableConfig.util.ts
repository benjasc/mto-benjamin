import { Injectable } from "@angular/core";
import { EmisionUnitariaModel } from '../model/emisionUnitariaGde.model'
@Injectable()
export class TableConfigEmisionGDE{

  dtOptionsExport: any =  {
        language: {
          emptyTable: 'Ningún dato disponible en esta tabla',
          info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
          infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
          infoFiltered: '(filtrado de un total de _MAX_ registros)',
          infoPostFix: '',
          lengthMenu: 'Mostrar _MENU_ registros',
          loadingRecords: 'Cargando...',
          processing: 'Procesando...',
          search: 'Buscar',
          zeroRecords: 'No se encontraron resultados',
          paginate: {
            first: 'Primero',
            last: 'Último',
            next: 'Siguiente',
            previous: 'Anterior',
          },
          aria: {
            sortAscending: ': Activar para ordenar la columna de manera ascendente',
            sortDescending: ': Activar para ordenar la columna de manera descendente',
          }
        },
        destroy: true,
        columns: [
          {
            title: 'isSelected',
            data: 'isSelected'
          },
          {
            title: 'modeloDespacho',
            data: 'modeloDespacho'
          },
          {
            title: 'estadoCDU',
            data: 'estadoCDU'
          },
          {
            title: 'motivoCDU',
            data: 'motivoCDU'
          },
          {
            title: 'estadoMotivoReserva',
            data: 'estadoMotivoReserva'
          },
          {
            title: 'cud',
            data: 'cud',
            class:'none'
          },
          {
            title: 'ubicacion',
            data: 'ubicacion',
            class:'none'
          },
          {
            title: 'sku',
            data: 'sku',
            class:'none'
          },
          {
            title: 'descripcionSKU',
            data: 'descripcionSKU',
            class:'none'
          },
          {
            title:'region',
            data:'region',
            class:'none'
          },
          {
            title: 'comuna',
            data: 'comuna',
            class:'none'

          },
          {
            title: 'direccionDespacho',
            data: 'direccionDespacho'
          },
          {
            title: 'nBoleta',
            data: 'nBoleta'
          },
          {
            title: 'Folio Seguro',
            data: 'folioSeguro'
          },
          {
            title: 'cantidad',
            data: 'cantidad',
            class:'none'
          },
          {
            title: 'sucursalVenta',
            data: 'sucursalVenta',
            class:'none'
          },
          {
            title: 'sucursalStock',
            data: 'sucursalStock',
            class:'none'
          }

        ],
        pagingType: 'full_numbers',
        pageLength: 2,
        dom: 'Bfrtip',
        buttons: [
          'csv',
          'excel'
        ],
        responsive: true


        }

    constructor(){}
}
