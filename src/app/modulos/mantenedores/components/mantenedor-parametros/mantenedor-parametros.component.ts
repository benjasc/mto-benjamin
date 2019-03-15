import { Utils } from './../../../shared/utils/utils';
import { DialogService } from 'ng2-bootstrap-modal';
import { MessageService } from './../../../shared/services/message.service';
import { Property } from './../../../../modulos/mantenedores/vo/Property';
import { MaintainerParameterService } from './../../services/maintainer-parameter.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mantenedor-parametros',
  templateUrl: './mantenedor-parametros.component.html',
  styleUrls: ['./mantenedor-parametros.component.scss']
})
export class MantenedorParametrosComponent implements OnInit {
  ret: any;
  listaPadres: Property[];
  listaHijos: Property[];
  padres: Property[] = [];
  padreSeleccionado: Property;
  idStore: number;
  isFather: boolean;
  propiedadModificar: Property;
  valorNuevo: string;
  categoriaNueva: string;
  validaciones: boolean;
  idUsuario: number;
  mensaje: string;
  descripcion: string;
  @ViewChild('myModalModifyValue') myModalModifyValue;
  @ViewChild('modalMessage') modalMessage;
  utils: Utils;

  constructor(public maintainerParameterService: MaintainerParameterService,
    private router: Router,
    public messageService: MessageService,
    public dialogService: DialogService) {
      this.padreSeleccionado = new Property();
      this.propiedadModificar = new Property();
      this.idStore = Number.parseInt(sessionStorage.getItem('cadena'));
      this.valorNuevo = '';
      this.categoriaNueva = '';
      this.validaciones = false;
      this.idUsuario = Number.parseInt(sessionStorage.getItem('idUser'));
      this.mensaje = '';
      this.isFather = false;
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
      this.descripcion = '';
     }

  ngOnInit() {
    this.traeProperties(0, true);
  }

  traeProperties(idFather: number, isFather: boolean) {
    this.messageService.cargando(true);
    this.isFather = isFather;
    this.maintainerParameterService.obtenerProperties(this.idStore, idFather)
      .subscribe((res: any) => this.ret = res,
        (err) => {
          this.messageService.cargando(false);
          console.log(err);
          this.utils.errorRespuesta();
        },
        () => {
          if (this.ret.code !== undefined && this.ret.code === 0) {
              this.ret = this.utils.validarRespuesta(this.ret);
              if (this.isFather === true) {
                this.padres = this.ret.parametros;
                this.listaPadres = this.ret.parametros;
              } else {
                this.listaHijos = this.ret.parametros;
                this.buscarPadreSeleccionado(idFather);
              }
              this.messageService.cargando(false);
          } else if (this.ret.code === 12) {
            this.messageService.cargando(false);
            this.messageService.enviarMensaje('Alerta', [this.ret.message], 'warn', this.dialogService);
            this.router.navigate(['/login']);
          } else {
            this.messageService.cargando(false);
            this.messageService.enviarMensaje('Error', ['Ha ocurrido un error al obtener parametros'], 'warn', this.dialogService);
          }
        }
      );
  }
  volver() {
    this.traeProperties(0, true);
  }
  buscarPadreSeleccionado(idPadre: number) {
    this.padres.forEach(element => {
      if (idPadre === element.idProperty) {
        this.padreSeleccionado = element;
      }
    });
  }
  ModificarProperty(property: Property) {
    this.propiedadModificar = property;
    this.myModalModifyValue.open();
  }
  modificarValores(idParametro: number, valorAnterior: string, descripcion: string) { // Modifica en base de datos

    this.messageService.cargando(true);
    if (this.categoriaNueva === '') {
      this.categoriaNueva = '-1';
    }
    this.maintainerParameterService.modificarProperties(Number.parseInt(this.categoriaNueva.toString()),
      idParametro, valorAnterior, this.valorNuevo, this.idStore, this.idUsuario, descripcion)
      .subscribe((res: any) => this.ret = res,
        (err) => {
          this.mensaje = this.ret.message;
          this.messageService.cargando(false);
          console.log(err);
          this.utils.errorRespuesta();
        },
        () => {
          if (this.ret.code !== undefined && this.ret.code === 0) {
            this.utils.validarRespuesta(this.ret);
            this.mensaje = this.ret.message;
            this.messageService.cargando(false);
            this.modalMessage.open();
          } else {
            this.messageService.cargando(false);
            this.mensaje = this.ret.message;
            this.modalMessage.open();
          }
        }
      );
  }
    cerrar() {
    this.valorNuevo = '';
    this.categoriaNueva = '';
    this.validaciones = false;
    this.myModalModifyValue.close();
  }
  cerrarMensaje() {
    this.valorNuevo = '';
    this.categoriaNueva = '';
    this.validaciones = false;
    this.modalMessage.close();
    this.myModalModifyValue.close();
    this.traeProperties(this.padreSeleccionado.idProperty, false);
  }
  verificaValores() {
    if (this.valorNuevo !== '' && this.valorNuevo !== undefined) {
      this.validaciones = true;
    } else {
      this.validaciones = false;
    }
  }
  verificaDescripcion() {
    if (this.descripcion !== '' && this.descripcion !== undefined) {
      this.validaciones = true;
    } else {
      this.validaciones = false;
    }
  }
}

