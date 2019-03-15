import { FormGroup, FormArray } from '@angular/forms';
import { MaintainerProfileService } from '../../services/maintainer-profile.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DateFormat } from './dateFormat';
import { GLOBAL } from './../../../shared/services/global';
import * as XLSX from 'xlsx';
import { MessageService } from './../../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { Globals } from './../../../shared/utils/globals';
import { Usuario } from './../../../shared/vo/usuario';
import { MenuProfile } from './../../../shared/vo/menu';
import { LogService } from './../../../shared/services/log.service';
import { Router } from '@angular/router';
import { Utils } from './../../../shared/utils/utils';

@Component({
  selector: 'app-maintainer-profile',
  templateUrl: './maintainer-profile.component.html',
  styleUrls: ['./maintainer-profile.component.scss']
})
export class MaintainerProfileComponent implements OnInit {

  private menu: MenuProfile[];
  // DatePicker
  fechaCompraDesde: Date;
  fechaCompraHasta: Date;
  desdeString: String;
  hastaString: String;
  myDatePickerOptionsDesde: any;
  myDatePickerOptionsHasta: any;
  myDatePickerOptionsCopy: any;
  formatoFechaDesde: DateFormat;
  formatoFechaHasta: DateFormat;

  // Exportar
  ws: XLSX.WorkSheet;
  wb: XLSX.WorkBook;

  pgCurrent: Number;
  pgrows: Number;

  orderProperty: String;
  currentColumn: any;
  currentDirection: any;
  listProfiles: any;
  listAccess: any;
  dir: any;
  modelAccordion: Array<any> = [{ isAccordionOpen: false }];

  private usuario: Usuario;
  private config: any;
  ret: any;
  loadingDelete: boolean;
  loadingInsert: boolean;
  loadingUpdate: boolean;
  loadings: boolean;

  results: Object[];
  resultProfiles: any;
  resultModuleProfiles: Object[];
  profile: Object[];
  resultsDetail: any;
  resultsDetailPerfil: any;
  resultsDetailModulePerfil: any;
  resultsDetailModulePerfilInsert: any;

  editable: Boolean;

  idUserDeleteMyModal: any;
  idStoreDeleteMyModal: any;
  idProfileDeleteMyModal: any;
  idProfileTemp: any;


  areaUpdateSelect: any;
  perfilUpdateSelect: any;
  statusUpdateSelected: any;
  statusUpdateDescriptionSelected: any;

  myModalUpdateInputIdProfile: any;
  myModalInserInputIdProfile: any;
  myModalInsertInputStatus: any;
  myModalInsertInputName: any;
  myModalInsertInputLastName: any;
  myModalInsertInputUserName: any;
  myModalInsertInputPerfil: String;
  myModalInsertInputIdProfile: String;
  myModalInsertInputArea: String;
  myModalUpdateInputArea: String;
  myModalUpdateInputPerfil: String;
  myModalUpdateInputIdAccess: String;

  listEmailTemplates: any;

  loadingForwardEmail: boolean;
  resultsEmailByOC: Object[];
  extension: any;

  fileUpload: any;
  fileBase64: any;
  base64textString: any;
  nameFileBase64: any;
  fileNameFull: string;
  arrayFile: [''];

  cuerpoRut: string;
  dvRut: string;
  url: String;
  utils: Utils;

  @ViewChild('myModalInsert') myModalInsert;
  @ViewChild('myModalUpdate') myModalUpdate;
  @ViewChild('myModalDelete') myModalDelete;

  presupuestoForm: FormGroup;
  presupuesto: any;
  base: any;
  tipo: any;
  iva: any = 0;
  total: any = 0;
  items: FormArray;
  proveedores: any;
  categoriaClienteSeleccionada: string;
  query = '';
  listaFiltrada: string[] = [];
  marcas: string[] = [];
  accesosSeleccionados: string[] = [];
  accesosSeleccionadosInsert: string[] = [];
  accesosSeleccionadosModule: string[] = [];

  constructor(public maintainerProfileService: MaintainerProfileService, public messageService: MessageService,
    public dialogService: DialogService, public globals: Globals, public logService: LogService, public router: Router) {
      this.pgCurrent = 1;
      this.pgrows = GLOBAL.paginador_rows;
      this.orderProperty = '+ordernumber';
      this.config = this.globals.getValue();
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
  }

  ngOnInit() {
    this.messageService.cargando(true);
     // usuario
    this.usuario = this.config[1].val;
    // menu
    this.menu = this.config[2].val;
    // url
    this.url = this.router.url;
    // Modulos de acceso a ordenes
   console.log('Access : '  + JSON.stringify(this.menu) + ' / ' + this.usuario.idUser +  ' / '  + this.router.url);

    for (let i = 0; i < this.menu.length; i++) {
      for (let j = 0; j < this.menu[i].subItems.length; j++) {
        console.log('Access Menu: ' + this.menu[i].idAccess + ' / ' + this.menu[i].idModule
        + ' / ' + this.menu[i].name + ' / ' +  this.menu[i].url);

        console.log('Access SubMenu: ' + this.menu[i].subItems[j].idAccess + ' / ' + this.menu[i].subItems[j].idModule
        + ' / ' + this.menu[i].subItems[j].name + ' / '  + ' / ' + this.menu[i].subItems[j].url);

        if (this.router.url === this.menu[i].subItems[j].url) {
          if (this.menu[i].subItems[j].idAccess > 1) {
            console.log('true');
            this.editable = true;
          } else {
            console.log('false');
            this.editable = false;
          }
        }
      }
    }
    console.log('Editable : ' + this.editable );

     // Se inicializa los combos
    console.log('Cargando perfiles');
    this.maintainerProfileService.getProfile().subscribe(
      result => {
        this.listProfiles = this.utils.validarRespuestaFormatear(result);
        console.log(this.listProfiles);
        this.listProfiles = this.listProfiles.listProfiles;
      },
      error => {
        console.log(<any>error);
        this.utils.errorRespuesta();
      }
    );
    // Se inicializa los combos
    console.log('Cargando access');
    this.maintainerProfileService.getAccess().subscribe(
      result => {
        this.listAccess = this.utils.validarRespuestaFormatear(result);
        this.listAccess = this.listAccess.listAccess;
        console.log(this.listAccess);
        this.messageService.cargando(false);
      },
      error => {
        console.log(<any>error);
        this.utils.errorRespuesta();
      }
    );
    // Limpiar pantalla al ingresar
    this.cleanResults();

    this.formatoFechaDesde = new DateFormat();
    this.formatoFechaHasta = new DateFormat();

    // Fecha Desde
    const d: Date = new Date();
    this.formatoFechaDesde.myDatePickerOptions.disableSince = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 };
    this.formatoFechaDesde.myDatePickerOptions.disableUntil = { year: d.getFullYear(), month: d.getMonth() - 0, day: d.getDate() };
    this.myDatePickerOptionsDesde = this.formatoFechaDesde.myDatePickerOptions;
    // Fecha Hasta
    this.formatoFechaHasta.myDatePickerOptions.disableSince = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 };
    this.formatoFechaHasta.myDatePickerOptions.disableUntil = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 };
    this.myDatePickerOptionsHasta = this.formatoFechaHasta.myDatePickerOptions;

    /*
    this.items = this.pf.array(this.proveedores) as FormArray;
    this.items.push(this.createItem());

    this.proveedores = this.maintainerProfileService.getProveedores();
    console.log('==1==' + this.proveedores);
    console.log('==2==' + JSON.stringify(this.proveedores));
    this.presupuestoForm = this.pf.group({
      proveedor: ['', Validators.required ],
      fecha: ['', Validators.required ],
      concepto: ['', [ Validators.required, Validators.minLength(10)] ],
      base: ['', Validators.required ],
      tipo: ['', Validators.required ],
      iva: this.iva ,
      total: this.total,
      //items: this.pf.array([ this.createItem() ])
      //items: this.pf.array(this.proveedores)
      items: this.pf.array([ this.createItem() ])
    });

    this.onChanges(); */
  }

  searchInfo(idProfile: string, area: string, perfil: string) {
    console.log('searchInfo: idProfile ' + idProfile + ' area ' + area + ' perfil ' + perfil + '===' + (perfil !== '' ? perfil : '-1'));
    // Valido Campos y Fechas que no vengan Vacios
    if (idProfile === '' && area === '' && perfil === '' ) {
      this.messageService.enviarMensaje('Error búsqueda', ['Debe ingresar filtro de búsqueda'], 'info', this.dialogService);
      this.loadings = false;
      return;
    }

    this.clearSessionStorage();
    sessionStorage.setItem('formProfileIdProfile', idProfile.toString());
    sessionStorage.setItem('formProfileArea', area.toString());
    sessionStorage.setItem('formPerfil', perfil);

    this.loadings = true;
    this.messageService.cargando(this.loadings);
      this.maintainerProfileService.searchInfoProfile(idProfile, (area !== '' ? area : '-1'), (perfil !== '' ? perfil : '-1') )
        .subscribe(
          res => {
            this.results = this.utils.validarRespuestaFormatear(res);
            // this.results = res.message.replace(/\n/ig, '');
            // this.results = JSON.parse(this.results.toString());
            console.log(this.results);
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            if (this.results.length === 0) {
              this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
            }
          },
          err => {
            this.loadings = false;
            this.utils.errorRespuesta();
            console.log(err);
          }
        );
  }

   searchInfoInsert() {
     this.messageService.cargando(true);
    console.log('searchInfoInsert');

    this.myModalInsertInputArea = '';
    this.myModalInsertInputPerfil = '';
    this.myModalInsertInputName = '';
    this.myModalInsertInputLastName = '';
    this.myModalInsertInputUserName = '';
    this.myModalInsertInputPerfil = '';

    if (this.resultsDetailModulePerfilInsert !== []) {
      this.resultsDetailModulePerfilInsert = [];
    }

    if (this.accesosSeleccionados !== []) {
      this.accesosSeleccionados = [];
    }

    // search module perfil
    this.maintainerProfileService.searchInfoProfileInsert('-1').subscribe(
      res => {
        this.resultsDetailModulePerfilInsert = this.utils.validarRespuestaFormatear(res);
        console.log(this.resultsDetailModulePerfilInsert);
          // this.resultsDetailModulePerfilInsert = res.message.replace(/\n/ig, '');
          // this.resultsDetailModulePerfilInsert = JSON.parse(this.resultsDetailModulePerfilInsert);
          this.messageService.cargando(false);
      },
      err => {
        console.log(err);
        this.utils.errorRespuesta();
      }
    );
    // open Modal
    this.myModalInsert.open();
  }

  searchInfoUpdate(idProfile: string, area: String, perfil: String) {
    this.messageService.cargando(true);
   console.log('Search Update ' + ' idProfile ' + idProfile + ' area ' + area + ' perfil ' + perfil);
    this.areaUpdateSelect = area;
    this.perfilUpdateSelect = perfil;
    this.myModalUpdateInputIdProfile = idProfile;
    this.myModalUpdateInputArea = area;
    this.myModalUpdateInputPerfil = perfil;

    if (this.resultsDetail !== []) {
      this.resultsDetail = [];
    }

    if (this.resultsDetailPerfil !== []) {
      this.resultsDetailPerfil = [];
    }

    if (this.resultsDetailModulePerfil !== []) {
      this.resultsDetailModulePerfil = [];
    }

    if (this.accesosSeleccionados !== []) {
      this.accesosSeleccionados = [];
    }

    // search perfil
    this.maintainerProfileService.searchInfoProfile(idProfile, '-1', '-1').subscribe(
      res => {
        this.resultsDetailPerfil = this.utils.validarRespuestaFormatear(res);
        console.log(this.resultsDetailPerfil);
        // this.resultsDetailPerfil = res.message.replace(/\n/ig, '');
        // this.resultsDetailPerfil = JSON.parse(this.resultsDetailPerfil);
       },
      err => {
        console.log(err);
        this.messageService.cargando(false);
        this.utils.errorRespuesta();
      }
    );

    // search module perfil
    this.maintainerProfileService.searchInfoProfileUpdate(idProfile).subscribe(
      res => {
        this.resultsDetailModulePerfil = this.utils.validarRespuestaFormatear(res);
        // this.resultsDetailModulePerfil = res.message.replace(/\n/ig, '');
        // this.resultsDetailModulePerfil = JSON.parse(this.resultsDetailModulePerfil);
        this.messageService.cargando(false);
      },
      err => {
        console.log(err);
        this.messageService.cargando(false);
        this.utils.errorRespuesta();
      }
    );
    // open Modal
    this.myModalUpdate.open();
  }

  insert(area: String, perfil: String) {
    console.log('insert: ' + ' area: ' + area + ' perfil: ' + '' + perfil );
    this.usuario = this.config[1].val;
    if (area === '' || perfil === '' ) {
        this.messageService.enviarMensaje('Error Crear', ['Verifique que todos los campos esten completos'], 'info', this.dialogService);
    }  else {
      console.log('array length ' + this.accesosSeleccionados.length);
      console.log('JSON: ' + JSON.stringify(this.accesosSeleccionados));

      // Insertar Perfil
      this.loadings = true;
      this.messageService.cargando(this.loadings);
        this.maintainerProfileService.insertProfile(area, perfil).subscribe(
          resPerfil => {
            this.resultProfiles = this.utils.validarRespuestaFormatear(resPerfil);
            // this.messageService.cargando(true);
            // this.resultProfiles = resPerfil.message.replace(/\n/ig, '');
            // this.resultProfiles = JSON.parse(this.resultProfiles);
            this.myModalInsert.close();
            this.loadings = false;
            this.idProfileTemp = this.resultProfiles.response;
            // Insertar Modulo de Perfil
            this.insertModuleProfile(this.resultProfiles.response + '', this.maintainerProfileService);
            setTimeout(() => {
              this.editModuleProfile(this.resultProfiles.response + '', this.maintainerProfileService);

            }, 12000);
            this.cleanResults();
            // se inserta log
            this.insertarLog(13, 0, this.usuario.idUser, '', area + '-' + perfil.toString());

            const searchIdProfile =  sessionStorage.getItem('formProfileIdProfile');
            const searchProfileArea = sessionStorage.getItem('formProfileArea');
            const searchPerfil = sessionStorage.getItem('formPerfil');
            console.log('searchIdProfile: ' + searchIdProfile + ' searchProfileArea: ' +
            searchProfileArea + ' searchPerfil: ' + searchPerfil );
            this.loadings = true;
            this.messageService.cargando(this.loadings);
              this.maintainerProfileService.searchInfoProfile(searchIdProfile, (searchProfileArea !== '' ? searchProfileArea : '-1'),
              (searchPerfil !== '' ? searchPerfil : '-1')).subscribe(
                  res => {
                      this.results = this.utils.validarRespuestaFormatear(res);
                      // this.results = res.message.replace(/\n/ig, '');
                      // this.results = JSON.parse(this.results.toString());
                      this.loadings = false;
                      this.messageService.cargando(this.loadings);
                      if (this.results.length === 0) {
                        this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
                      }
                  },
                  err => {
                    this.utils.errorRespuesta();
                  }
                );
                this.messageService.enviarMensaje('Crear Perfil', ['Perfil creado correctamente'], 'info', this.dialogService);
          },
          err => {
            this.loadings = false;
            console.log(err);
            this.utils.errorRespuesta();
          }
        );
    }
  }

  update(idProfile: String, area: String, perfil: String) {
    console.log('Update: ' + ' idProfile: ' + idProfile + ' areaUpdate: ' + '' + area + ' perfil: ' + perfil);
    this.usuario = this.config[1].val;
    if (idProfile === '' || area === '' || perfil === '' ) {
        this.messageService.enviarMensaje('Error Editar', ['Verifique que todos los campos esten completos'], 'info', this.dialogService);
    } else {
      console.log('array length ' + this.accesosSeleccionados.length);
      console.log('JSON: ' + JSON.stringify(this.accesosSeleccionados));

      // Actualizar Perfil
      this.loadings = true;
      this.messageService.cargando(this.loadings);
      this.maintainerProfileService.editProfile(idProfile, area, perfil).subscribe(
      resPerfil => {
        this.resultProfiles = this.utils.validarRespuestaFormatear(resPerfil);
        this.messageService.cargando(true);
        console.log(this.resultProfiles);
        // this.resultProfiles = resPerfil.message.replace(/\n/ig, '');
        // this.resultProfiles = JSON.parse(this.resultProfiles.toString());
        this.myModalUpdate.close();
        this.loadings = false;
        this.messageService.cargando(this.loadings);

        // Actualiza Modulo de Perfil
        this.editModuleProfile(idProfile + '', this.maintainerProfileService);

        this.cleanResults();

        // se inserta el log
        // this.logService.insertLog(15, 0 , this.usuario.idUser  + '')
        //   .subscribe(
        //     (response: any) => (this.ret = response),
        //       error => () => {
        //         console.log('insertamos log correctamente');
        //       },
        //       () => {
        //         console.log('error al insertar log');
        //       }
        //   );

        this.insertarLog(15, 0, this.usuario.idUser, '', area + '-' + perfil.toString());

        const searchIdProfile =  sessionStorage.getItem('formProfileIdProfile');
        const searchProfileArea = sessionStorage.getItem('formProfileArea');
        const searchPerfil = sessionStorage.getItem('formPerfil');
        console.log('searchIdProfile: ' + searchIdProfile + ' searchProfileArea: ' + searchProfileArea
                    + ' searchPerfil: ' + searchPerfil );

        this.loadings = true;
        this.messageService.cargando(this.loadings);
        this.maintainerProfileService.searchInfoProfile(searchIdProfile, (searchProfileArea !== '' ? searchProfileArea : '-1'),
        (searchPerfil !== '' ? searchPerfil : '-1')).subscribe(
          res => {
            this.results = this.utils.validarRespuestaFormatear(res);
            // this.results = res.message.replace(/\n/ig, '');
            // this.results = JSON.parse(this.results.toString());
            console.log(this.results);
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            if (this.results.length === 0) {
              this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
            }
          },
          err => {
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            console.log(err);
            this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda'], 'info', this.dialogService);
          }
        );
        this.messageService.enviarMensaje('Actualizar Perfil', ['Perfil actualizado correctamente'], 'info', this.dialogService);
          // this.myModalUpdate.close();
      },
      err => {
        this.loadings = false;
        console.log(err);
        this.utils.errorRespuesta();
      }
     );
    }
  }

  delete(id) {}

  editModuleProfile(idProfile:  string, maintainerProfileService: any) {
    console.log('editModuleProfile: ' + idProfile + '' );
    this.accesosSeleccionados.forEach( function(valor, indice, array) {
      maintainerProfileService.editModuleProfile(+idProfile, +valor,  +array.splice(indice + 1, 1)).subscribe(
        res => {
          console.log(res);
          // this.utils.validarRespuesta(res);
          console.log('Module Perfil actualizado correctamente');
          },
        err => {
          console.log(err);
          this.messageService.cargando(false);
        }
      );
    });
  }

  insertModuleProfile(idProfile:  string, maintainerProfileService: any) {
    console.log('insertModuleProfile: ' + idProfile + '' );
    this.maintainerProfileService.searchInfoModuleProfileInsert('-1').subscribe(
    res => {
      res = this.utils.validarRespuestaFormatear(res);
      // res = res.message.replace(/\n/ig, '');
      // res = JSON.parse(res);
      for (let i = 0; i < res.length; i++) {
        console.log(  'i: ' + i +  ' modulo: ' + res[i].idModule +  ' estado: ' + res[i].idAccess);
        this.maintainerProfileService.insertModuleProfile(+idProfile, +res[i].idModule,  +res[i].idAccess).subscribe(
          response => {
            if (response.code !== null && response.code !== undefined) {
              console.log('Module Perfil insertar correctamente');
              this.messageService.cargando(false);
            }
          },
          err => {
            console.log('Error servicio insertar modulo perfil');
            console.log(err);
            this.messageService.cargando(false);
          }
        );
      }
    },
    err => {
      console.log(err);
      this.utils.errorRespuesta();
    });

  }


  select(itemModule, item) {
    this.accesosSeleccionados.push(itemModule, item);
    this.query = '';
    this.listaFiltrada = [];
    this.marcas.splice(this.marcas.indexOf(item), 0);
  }


  /*
  createItem(): FormGroup {
    return this.pf.group({
      name: '',
      description: '',
      price: ''
    });
  }
  */


  onChanges(): void {
      this.presupuestoForm.valueChanges.subscribe(valor => {
        this.base = valor.base;
        this.tipo = valor.tipo;
        this.presupuestoForm.value.iva = this.base * this.tipo;
        this.presupuestoForm.value.total = this.base + (this.base * this.tipo);
      });
  }

  onSubmit() {
    this.presupuesto = this.savePresupuesto();
  }

  addItem(): void {
    // this.items = this.pf.get('items') as FormArray;
    // this.items.push(this.createItem());
  }

  savePresupuesto() {
    const savePresupuesto = {
      proveedor: this.presupuestoForm.get('proveedor').value,
      fecha: this.presupuestoForm.get('fecha').value,
      concepto: this.presupuestoForm.get('concepto').value,
      base: this.presupuestoForm.get('base').value,
      tipo: this.presupuestoForm.get('tipo').value,
      iva: this.presupuestoForm.get('iva').value,
      total: this.presupuestoForm.get('total').value
    };
    return savePresupuesto;
  }

  sortProperty(column) {
    this.currentColumn = this.orderProperty.slice(1);
    this.currentDirection = this.orderProperty.slice(0, 1);
    this.dir = '+';

    if (column === this.currentColumn) {
      this.dir = this.currentDirection === '+' ? '-' : '+';
    }
    this.orderProperty = this.dir + column;
  }

  sortPropertyDate(column) {

    // Si ya fue ordenado por date queda con el *
    if (this.orderProperty.slice(0, 1) === '*') {
      this.orderProperty = this.orderProperty.slice(1);
    }

    this.currentColumn = this.orderProperty.slice(1);
    this.currentDirection = this.orderProperty.slice(0, 1);
    this.dir = '+';

    if (column === this.currentColumn) {
      this.dir = this.currentDirection === '+' ? '-' : '+';
    }
    this.orderProperty = '*' + this.dir + column;
  }

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  cleanResults() {
    this.results = [];
    // this.areaUpdateSelect = '';
   // this.myModalUpdateInputArea = '';
  }

  clearSessionStorage() {
    sessionStorage.removeItem('formProfileIdProfile');
    sessionStorage.removeItem('formProfileArea');
    sessionStorage.removeItem('formPerfil');
  }

  insertarLog(idEvento: number, idOrder: number, idUser: number, valorAntiguo: string, valorNuevo: string) {
    this.logService.insertarLogBitacora(idEvento, idOrder, idUser, valorAntiguo, valorNuevo)
    .subscribe((res: any) => this.ret = res,
    (err) => {
      this.messageService.cargando(false);
      console.log('ocurrio un error al insertar log');
    },
    () => {
      console.log(this.ret);
      if (this.ret.code !== undefined && this.ret.code === 0) {
        console.log('se inserto el log correctamente');
      } else {
      console.log('ocurrio un error al insertar log');
      }
    }
    );
  }
  /*
  createItem(): FormGroup {
    return this.pf.group({
      name: 'x2xx',
      description: 'x2x',
      price: '11'
    },
      {
        name: 'cccc',
        description: 'cccc',
        price: '1'
      });
  }
  */
}
