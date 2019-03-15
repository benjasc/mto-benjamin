import { Utils } from './../../../shared/utils/utils';
import { Perfil } from './../../../mantenedores/vo/perfil';
import { MantenedorUserService } from '../../services/mantenedor.user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyDateModel } from 'mydatepicker';
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

@Component({
  selector: 'app-mantenedor-user',
  templateUrl: './mantenedor-user.component.html',
  styleUrls: ['./mantenedor-user.component.scss']
})
export class MantenedorUserComponent implements OnInit {

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
  listUsers: any;
  listaUsuarios: Usuario[] = [];
  listProfiles: any;
  listaPerfile: any;
  dir: any;
  modelAccordion: Array<any> = [{ isAccordionOpen: false }];

  private usuario: Usuario;
  private config: any;
  ret: any;
  loadingDelete: boolean;
  loadingInsert: boolean;
  loadingUpdate: boolean;
  loadingUpdateState: boolean;

  results: any;
  resultadoBusquedaUsuario: Usuario[] = [];
  resultsDetail: any;
  resultValid: any;
  resultInsert: any;

  editable: Boolean;

  idUserDeleteMyModal: any;
  idStoreDeleteMyModal: any;
  idProfileDeleteMyModal: any;

  idUserUpdateStateMyModal: any;
  idStoreUpdateStateMyModal: any;
  estadoUpdateStateMyModal: any;

  idProfileUpdateSelect: any;
  profileNameUpdateSelect: any;
  statusUpdateSelected: any;
  statusUpdateDescriptionSelected: any;

  myModalInsertInputIdProfile: any;
  myModalInsertInputStatus: any;
  myModalInsertInputName: any;
  myModalInsertInputLastName: any;
  myModalInsertInputUserName: any;
  myModalInsertInputEmail: String;

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
  valoresEditar: any;
  utils: Utils;
  cadena: number;
  prueba: any;

  @ViewChild('myModalInsert') myModalInsert;
  @ViewChild('myModalUpdate') myModalUpdate;
  @ViewChild('myModalDelete') myModalDelete;
  @ViewChild('myModalUpdateState') myModalUpdateState;


  constructor(public mantenedorUserService: MantenedorUserService, public messageService: MessageService,
    public dialogService: DialogService, public globals: Globals,
    public logService: LogService, public router: Router) {
      this.pgCurrent = 1;
      this.pgrows = GLOBAL.paginador_rows;
      this.orderProperty = '+ordernumber';
      this.config = this.globals.getValue();
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
      this.cadena = Number(sessionStorage.getItem('cadena'));
      console.log(this.cadena);
  }

    // Rut
  cuerpoRut: string;
  dvRut: string;
  url: String;
  // private imageSrc: String = '';
  ngOnInit() {
    this.messageService.cargando(true);
    // usuario
    this.usuario = this.config[1].val;
    // menu
    this.menu = this.config[2].val;

    // url
    this.url = this.router.url;

    // Modulos de acceso a ordenes

  //  console.log(
  //     'Access : '  + JSON.stringify(this.menu) + ' / ' + this.usuario.idUser +  ' / '  + this.router.url
  //   );

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
    // console.log('Cargando Canales');
    // this.messageService.cargando(true);
    // this.mantenedorUserService.getUser().subscribe(
    //   result => {
    //     if (result.code === 0 && result.code !== undefined) {
    //       console.log('entramos a un status 200 getUser');
    //       console.log(result);
    //       this.listUsers = result.message.replace(/\n/ig, '');
    //       this.listUsers = JSON.parse(this.listUsers);
    //       this.listaUsuarios = this.listUsers.listUsers;
    //       console.log(this.listaUsuarios);
    //       this.messageService.cargando(false);
    //     } else if (this.ret.code === 12) {
    //       this.messageService.cargando(false);
    //       this.messageService.enviarMensaje('Alerta', [this.ret.message], 'warn', this.dialogService);
    //       this.router.navigate(['/login']);
    //     } else {
    //       this.messageService.cargando(false);
    //       this.messageService.enviarMensaje('Error', ['Ha ocurrido un error'], 'warn', this.dialogService);
    //     }
    //   },
    //   error => {
    //     console.log(<any>error);
    //     this.messageService.cargando(false);
    //     this.messageService.enviarMensaje('Error', ['Ha ocurrido un error'], 'warn', this.dialogService);
    //   }
    // );

    this.mantenedorUserService.getProfile().subscribe(
      result => {
        console.log(result);
        this.listaPerfile = this.utils.validarRespuestaFormatear(result);
        this.listaPerfile = this.listaPerfile.listProfiles;
        console.log(this.listaPerfile);
          // console.log(result);
          // result = this.utils.validarRespuesta(result);
          // console.log('entramos a un status 200 getProfile');
          // console.log(result);
          // this.listProfiles = result.message.replace(/\n/ig, '');
          // this.listProfiles = JSON.parse(this.listProfiles);
          // this.listaPerfile = this.listProfiles.listProfiles;
          // console.log(this.listaPerfile);
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
  }

  searchInfo(idUser: string, username: string, status: string, idProfile: string, nameLastName: String) {
    console.log('Comienzo servicio de busqueda de usuarios');
    // Valido Campos y Fechas que no vengan Vacios
    if (idUser === '' && username === '' && status === '' && idProfile === '' && nameLastName === '') {
      this.messageService.enviarMensaje('Error búsqueda', ['Debe ingresar filtro de búsqueda'], 'info', this.dialogService);
      return;
    }

    this.clearSessionStorage();
    sessionStorage.setItem('formIdUser', idUser.toString());
    sessionStorage.setItem('formUserName', username.toString());
    sessionStorage.setItem('formUserStatus', status);
    sessionStorage.setItem('formUserIdProfile', idProfile.toString());
    sessionStorage.setItem('formUserNameLastName', nameLastName.toString());


    this.messageService.cargando(true);
    this.mantenedorUserService.searchInfoUser(idUser, username, status, idProfile, nameLastName, this.cadena).subscribe(
      res => {
        console.log(res);
        this.prueba = this.utils.validarRespuestaFormatear(res);
        console.log(this.prueba);
        this.resultadoBusquedaUsuario = this.prueba;
        console.log(this.resultadoBusquedaUsuario);
        // console.log(res);
        // res = this.utils.validarRespuesta(res);
        // // this.results = res.message;
        // this.results = res.message.replace(/\n/ig, '');
        // this.results = JSON.parse(this.results.toString());
        // this.resultadoBusquedaUsuario = this.results;
        // console.log(this.resultadoBusquedaUsuario);
        if (this.resultadoBusquedaUsuario.length === 0) {
          this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
        }
      },
      err => {
        this.messageService.cargando(false);
        console.log(err);
        this.utils.errorRespuesta();
      }
    );
  }

  insert(idStore: String, idProfile: String, status: String, email: String, lastName: String, name: String, userName: String) {
    this.usuario = this.config[1].val;
   if (idStore === '' || idProfile === '' || status === '' || email === '' || lastName === '' || name === '' || userName === '') {
        this.messageService.enviarMensaje('Error Insertar', ['Verifique que todos los campos esten completos'], 'info', this.dialogService);
    }  else if (!this.validationEmail(email)) {
      this.messageService.enviarMensaje('Error Insertar', ['Email no válido'], 'info', this.dialogService);
      return;
    }  else if (!this.validationEmailLength(email)) {
      this.messageService.enviarMensaje('Error Editar',
      ['Email no válido el largo maximo es de 150 caracteres'], 'info', this.dialogService);
      return;
    } else if (this.validaCampoMin(lastName + '')) {
       this.messageService.enviarMensaje('Error Insertar',
          ['Verifique los valores del campo lastaname tenga un  minimo de 3 caracteres'], 'info', this.dialogService);
    }  else if (this.validaCampoMin(name + '')) {
       this.messageService.enviarMensaje('Error Insertar',
          ['Verifique los valores del campo nombre tenga un  minimo de 3 caracteres'], 'info', this.dialogService);
    }  else if (this.validaCampoMin(userName + '')) {
       this.messageService.enviarMensaje('Error Insertar',
          ['Verifique los valores del campo usuario tenga un  minimo de 3 caracteres'], 'info', this.dialogService);
    }  else {

      this.messageService.cargando(true);
      this.mantenedorUserService.validateUser(idStore, userName).subscribe(
      resp => {
        this.resultValid = this.utils.validarRespuestaFormatear(resp);
        //  this.resultValid = resp.message;
        //  this.resultValid = JSON.parse(this.resultValid.toString());
         if (this.resultValid.response === 1) {
            console.log('EL usuario no existe en la base de datos');
            this.messageService.cargando(true);
            this.mantenedorUserService.insertUser(idStore, idProfile, status, email, lastName, name, userName).subscribe(
              res => {
                console.log(res);
                this.resultInsert = this.utils.validarRespuestaFormatear(res);

                // se inserta log
                this.insertarLog(9, 0, this.usuario.idUser, '', userName.toString());
                this.cleanResults();
                const searchIdUser =  sessionStorage.getItem('formIdUser');
                const searchStatus = sessionStorage.getItem('formUserStatus');
                const searchUserName = sessionStorage.getItem('formUserName');
                const searchUserIdProfile =  sessionStorage.getItem('formUserIdProfile');
                const searchUserNameLastName =  sessionStorage.getItem('formUserNameLastName');

                this.mantenedorUserService.searchInfoUser(searchIdUser, (searchUserName !== '' ? searchUserName : '-1'),
                (searchStatus !== '' ? searchStatus : '-1'), searchUserIdProfile,
                  (searchUserNameLastName !== '' ? searchUserNameLastName : '-1'), this.cadena).subscribe(
                    response => {
                        console.log(response);
                        this.resultadoBusquedaUsuario = this.utils.validarRespuestaFormatear(response);
                        this.messageService.cargando(false);

                        // this.results = response.message.replace(/\n/ig, '');
                        // this.results = JSON.parse(this.results.toString());
                        // this.resultadoBusquedaUsuario = this.results;

                        if (this.resultadoBusquedaUsuario.length === 0) {
                          this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
                        }
                    },
                    err => {
                      this.utils.errorRespuesta();
                      console.log(err);
                    }
                  );
                  this.myModalInsert.close();
                  this.messageService.cargando(false);
                  this.messageService.enviarMensaje('Insertar Usuario', ['Usuario insertado correctamente'], 'info', this.dialogService);


              },
              err => {
                this.messageService.cargando(false);
                console.log(err);
                this.messageService.enviarMensaje('Error insertar Usuario'
                , ['Error servicio insertar usuario'], 'info', this.dialogService);
              }
            );



         } else {
           this.messageService.enviarMensaje('Error Insertar',
            ['EL usuario existe en la base de datos'], 'info', this.dialogService);
            this.messageService.cargando(false);
         }
      },
      err => {
        this.utils.errorRespuesta();
        this.messageService.cargando(false);
            console.log(err);
            this.messageService.enviarMensaje('Error insertar Usuario', ['Error servicio insertar usuario'], 'info', this.dialogService);

      }
    );

      /*
        this.messageService.cargando(true);
        this.mantenedorUserService.insertUser(idStore, idProfile, status, email, lastName, name, userName).subscribe(
          res => {
            console.log(res);
            res = this.utils.validarRespuesta(res);
            this.messageService.cargando(true);
            this.results = res.message;
            this.messageService.cargando(false);
            this.messageService.enviarMensaje('Insertar Usuario', ['Usuario insertado correctamente'], 'info', this.dialogService);
            // se inserta log
            this.insertarLog(9, 0, this.usuario.idUser, '', userName.toString());
            this.cleanResults();
            const searchIdUser =  sessionStorage.getItem('formIdUser');
            const searchStatus = sessionStorage.getItem('formUserStatus');
            const searchUserName = sessionStorage.getItem('formUserName');
            const searchUserIdProfile =  sessionStorage.getItem('formUserIdProfile');
            const searchUserNameLastName =  sessionStorage.getItem('formUserNameLastName');

            console.log('-->' + searchIdUser + '-->' + searchStatus + '-->' + searchUserName + '-->' + searchUserIdProfile + '-->' );
            this.mantenedorUserService.searchInfoUser(searchIdUser, (searchUserName !== '' ? searchUserName : '-1'),
            (searchStatus !== '' ? searchStatus : '-1'), searchUserIdProfile,
              (searchUserNameLastName !== '' ? searchUserNameLastName : '-1'), this.cadena).subscribe(
                response => {
                    console.log(response);
                    response = this.utils.validarRespuesta(response);
                    this.messageService.cargando(false);
                    this.results = response.message;
                    if (this.results.length === 0) {
                      this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
                    }
                },
                err => {
                  this.utils.errorRespuesta();
                  console.log(err);
                }
              );
              this.myModalInsert.close();
          },
          err => {
            this.messageService.cargando(false);
            console.log(err);
            this.messageService.enviarMensaje('Error insertar Usuario', ['Error servicio insertar usuario'], 'info', this.dialogService);
          }
        );
        */

    }
  }

  update(idUser: number, idStore: number, idProfile: number, status: String, email: String,
    lastName: String, name: String, userName: String) {

    this.usuario = this.config[1].val;

    if (idUser === 0 || idStore === 0 || idProfile === 0 || email === '' || lastName === '' || name === '' || userName === '') {
        this.messageService.enviarMensaje('Error Editar', ['Verifique que todos los campos esten completos'], 'info', this.dialogService);
    } else if (!this.validationEmail(email)) {
      this.messageService.enviarMensaje('Error Editar', ['Email no válido'], 'info', this.dialogService);
      return;
    }  else if (!this.validationEmailLength(email)) {
      this.messageService.enviarMensaje('Error Editar',
      ['Email no válido el largo maximo es de 150 caracteres'], 'info', this.dialogService);
      return;
    } else if (this.validaCampoMin(lastName + '')) {
       this.messageService.enviarMensaje('Error Editar',
          ['Verifique los valores del campo lastname tenga un  minimo de 3 caracteres'], 'info', this.dialogService);
    }  else if (this.validaCampoMin(name + '')) {
       this.messageService.enviarMensaje('Error Editar',
          ['Verifique los valores del campo nombre tenga un  minimo de 3 caracteres'], 'info', this.dialogService);
    }  else if (this.validaCampoMin(userName + '')) {
       this.messageService.enviarMensaje('Error Editar',
          ['Verifique los valores del campo username tenga un  minimo de 3 caracteres'], 'info', this.dialogService);
    } else {
      this.messageService.cargando(true);
        this.mantenedorUserService.editUser(idUser.toString(), idStore.toString(), idProfile.toString(),
        status, email, lastName, name, userName).subscribe(
          res => {
            console.log(res);
            this.results = this.utils.validarRespuestaFormatear(res);
            // this.results = res.message;
            // this.messageService.cargando(true);
            this.messageService.enviarMensaje('Actualizar Usuario', ['Usuario actualizado correctamente'], 'info', this.dialogService);
            console.log(this.valoresEditar);
            // se inserta log
            this.insertarLog(10, 0, this.usuario.idUser, '', this.valoresEditar[0].username);
            this.cleanResults();
            const searchIdUser =  sessionStorage.getItem('formIdUser');
            const searchStatus = sessionStorage.getItem('formUserStatus');
            const searchUserName = sessionStorage.getItem('formUserName');
            const searchUserIdProfile =  sessionStorage.getItem('formUserIdProfile');
            const searchUserNameLastName =  sessionStorage.getItem('formUserNameLastName');

            console.log('-->' + searchIdUser + '-->' + searchStatus + '-->' + searchUserName + '-->' + searchUserIdProfile + '-->' );
            this.mantenedorUserService.searchInfoUser(searchIdUser, (searchUserName !== '' ? searchUserName : '-1'),
            (searchStatus !== '' ? searchStatus : '-1'), searchUserIdProfile,
              (searchUserNameLastName !== '' ? searchUserNameLastName : '-1'), this.cadena).subscribe(
                response => {
                  console.log(response);
                  this.results = this.utils.validarRespuestaFormatear(response);
                  // this.messageService.cargando(false);
                  // this.results = response.message.replace(/\n/ig, '');
                  // this.results = JSON.parse(this.results.toString());
                  console.log(this.results);
                  this.resultadoBusquedaUsuario = [];
                  this.resultadoBusquedaUsuario = this.results;
                  console.log(this.resultadoBusquedaUsuario);
                  // this.messageService.cargando(false);
                  console.log('aqui es');
                  // this.messageService.cargando(false);
                  if (this.results.length === 0) {
                    this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
                  }
                },
                err => {
                  console.log(err);
                  this.utils.errorRespuesta();
                }
              );
            this.myModalUpdate.close();
          },
          err => {
            console.log(err);
            this.utils.errorRespuesta();
          }
        );
    }
  }

  // delete(idUser: String, idStore: String, idProfile: String) {
  //   this.usuario = this.config[1].val;
  //   if (idUser === '' || idStore === '' || idProfile === '' ) {
  //  this.messageService.enviarMensaje('Error Editar', ['Verifique que todos los campos esten completos'], 'info', this.dialogService);
  //   }  else {
  //       this.messageService.cargando(true);
  //       this.mantenedorUserService.deleteUser( idUser, idStore, idProfile).subscribe(
  //         res => {
  //           console.log(res);
  //           this.results = this.utils.validarRespuestaFormatear(res);
  //           this.messageService.cargando(true);
  //           // this.results = res.message;
  //           if (this.results.message !== 0) {
  //             this.messageService.cargando(false);
  //             this.messageService.enviarMensaje('Error eliminar usuario', ['Error eliminar usuario'], 'info', this.dialogService);
  //           } else {
  //             this.messageService.cargando(false);
  //             this.messageService.enviarMensaje('Eliminar Usuario', ['Usuario eliminado correctamente'], 'info', this.dialogService);
  //             // se inserta el log
  //             this.logService.insertLog(0, 0 , this.usuario.idUser  + '')
  //               .subscribe(
  //                 (response: any) => (this.ret = response),
  //                   error => () => {
  //                     console.log('error al insertar log');
  //                     console.log(error);
  //                   },
  //                   () => {
  //                     console.log('insertamos log correctamente');
  //                     this.utils.validarRespuesta(this.ret);
  //                   }
  //               );

  //             this.cleanResults();
  //             const searchIdUser =  sessionStorage.getItem('formIdUser');
  //             const searchStatus = sessionStorage.getItem('formUserStatus');
  //             const searchUserName = sessionStorage.getItem('formUserName');
  //             const searchUserIdProfile =  sessionStorage.getItem('formUserIdProfile');
  //             const searchUserNameLastName =  sessionStorage.getItem('formUserNameLastName');

  //             console.log('-->' + searchIdUser + '-->' + searchStatus + '-->' + searchUserName + '-->' + searchUserIdProfile + '-->' );
  //               this.mantenedorUserService.searchInfoUser(searchIdUser, (searchUserName !== '' ? searchUserName : '-1'),
  //               (searchStatus !== '' ? searchStatus : '-1'), searchUserIdProfile,
  //               (searchUserNameLastName !== '' ? searchUserNameLastName : '-1'), this.cadena).subscribe(
  //                 response => {
  //                   response = this.utils.validarRespuesta(response);
  //                   this.messageService.cargando(false);
  //                   console.log(response);
  //                   this.results = response.message;
  //                   if (this.results.length === 0) {
  //                     this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
  //                   }
  //                 },
  //                 err => {
  //                   console.log(err);
  //                   this.utils.errorRespuesta();
  //                 }
  //               );
  //             this.myModalDelete.close();
  //           }
  //         },
  //         err => {
  //           this.messageService.cargando(false);
  //           console.log(err);
  //           this.messageService.enviarMensaje('Error eliminar usuario', ['Error servicio eliminar usuario'], 'info', this.dialogService);
  //         }
  //       );
  //   }
  // }

  changedState(idUser: String, idStore: String, status: String) {
    this.messageService.cargando(true);
    this.usuario = this.config[1].val;

    if (idUser === '' || idStore === '' || status === '' ) {
        this.messageService.enviarMensaje('Error Editar', ['Verifique que todos los campos esten completos'], 'info', this.dialogService);
    } else {
        this.mantenedorUserService.changedUserState( idUser, idStore, status).subscribe(
          res => {
            console.log(res);
            this.results = this.utils.validarRespuestaFormatear(res);
            this.messageService.cargando(true);
            // this.results = res.message;
            this.messageService.enviarMensaje('Cambiar estado de Usuario', ['Usuario cambiado correctamente'], 'info', this.dialogService);
            let busqueda = false;
            let usuario;
            while (!busqueda) {
              this.resultadoBusquedaUsuario.forEach(element => {
                  if (Number(idUser) === element.idUser) {
                  usuario = element;
                  busqueda = true;
                  console.log(usuario);
                  }
              });
            }
            if (Number(status) === 0) {
              this.insertarLog(11, 0, this.usuario.idUser, usuario.userName + ' habilitado', usuario.userName + ' deshabilitado');
            } else {
              this.insertarLog(11, 0, this.usuario.idUser, usuario.userName + ' deshabilitado', usuario.userName + ' habilitado');
            }

            this.cleanResults();
            const searchIdUser =  sessionStorage.getItem('formIdUser');
            const searchStatus = sessionStorage.getItem('formUserStatus');
            const searchUserName = sessionStorage.getItem('formUserName');
            const searchUserIdProfile =  sessionStorage.getItem('formUserIdProfile');
            const searchUserNameLastName =  sessionStorage.getItem('formUserNameLastName');

            console.log('-->' + searchIdUser + '-->' + searchStatus + '-->' + searchUserName + '-->' + searchUserIdProfile + '-->' );
            this.mantenedorUserService.searchInfoUser(searchIdUser, (searchUserName !== '' ? searchUserName : '-1'),
              (searchStatus !== '' ? searchStatus : '-1'), searchUserIdProfile,
              (searchUserNameLastName !== '' ? searchUserNameLastName : '-1'), this.cadena).subscribe(
                response => {
                  console.log(response);
                  this.results = this.utils.validarRespuestaFormatear(response);
                  // this.results = response.message.replace(/\n/ig, '');
                  // this.results = JSON.parse(this.results.toString());
                  console.log(this.results);
                  this.resultadoBusquedaUsuario = [];
                  this.resultadoBusquedaUsuario = this.results;
                  this.messageService.cargando(false);
                  console.log(this.resultadoBusquedaUsuario);
                  if (this.results.length === 0) {
                    this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
                  }
                },
                err => {
                  console.log(err);
                  this.utils.errorRespuesta();
                }
              );
            this.myModalUpdateState.close();
            // this.searchInfo('-1', '', '-1', '-1', '');
          },
          err => {
            console.log(err);
            this.utils.errorRespuesta();
          }
        );
    }
  }

  searchInfoInsert() {
    console.log('insert');

    this.myModalInsertInputIdProfile = '';
    this.myModalInsertInputStatus = '';
    this.myModalInsertInputName = '';
    this.myModalInsertInputLastName = '';
    this.myModalInsertInputUserName = '';
    this.myModalInsertInputEmail = '';

    // open Modal
    this.myModalInsert.open();

  }

  searchInfoUpdate(idUser: string, idStore: string, idProfile, profileName: String, status: string) {
    console.log('Update');
    this.messageService.cargando(true);
    this.idProfileUpdateSelect = idProfile;
    this.profileNameUpdateSelect = profileName;
    // this.statusUpdateSelected = sessionStorage.getItem('formUserStatus');
    console.log(status);
    // console.log(this.statusUpdateSelected);
    if (Number(status) === 1) {
      console.log('Habi');
      this.statusUpdateDescriptionSelected = 'Habilitado';
      this.statusUpdateSelected = 1;
    } else {
      console.log('desha');
      this.statusUpdateDescriptionSelected = 'Deshabilitado';
      this.statusUpdateSelected = 0;
    }

    if (this.resultsDetail !== []) {
      this.resultsDetail = [];
    }

    // search detail user
    this.mantenedorUserService.searchInfoUserUpdate(idUser, idStore, idProfile).subscribe(
      res => {
        console.log(res);
        this.resultsDetail = this.utils.validarRespuestaFormatear(res);
        // this.resultsDetail = res.message.replace(/\n/ig, '');
        // this.resultsDetail = JSON.parse(this.resultsDetail);
        this.valoresEditar = this.resultsDetail;
        this.messageService.cargando(false);
        console.log(this.resultsDetail);
      },
      err => {
        console.log(err);
        this.utils.errorRespuesta();
      }
    );
    // open Modal
    this.myModalUpdate.open();
  }

  // searchInfoDelete(idUser: string, idStore: string, idProfile) {
  //   console.log('==' + idUser + ' ==' + idStore + '==' + idProfile);

  //   this.idUserDeleteMyModal = idUser;
  //   this.idStoreDeleteMyModal = idStore;
  //   this.idProfileDeleteMyModal = idProfile;

  //   // open Modal
  //   this.myModalDelete.open();
  // }

  searchInfoUpdateState(idUser: string, idStore: string, status) {
    console.log('==' + idUser + ' ==' + idStore + '==' + status);

    this.idUserUpdateStateMyModal = idUser;
    this.idStoreUpdateStateMyModal = idStore;
    this.estadoUpdateStateMyModal = status;

    // open Modal
    this.myModalUpdateState.open();
  }

  leadingZero(value) {
    if (value < 10) {
      return '0' + value.toString();
    }
    return value.toString();
  }

  validaCampoMin(str: string) {
    if (str.length < 3 ) {
      return true;
    } else {
      return false;
    }
  }

  validaUser(idStore:  String, userName: string) {
    console.log('validate');

    this.mantenedorUserService.validateUser(idStore, userName).subscribe(
      res => {
         this.results = res.message;
         this.resultValid = JSON.parse(this.results.toString());
         console.log('==' + this.resultValid.response);
         if (this.resultValid.response === 1) {
           return true;
         } else {
          return false;
         }
      },
      err => {
        this.utils.errorRespuesta();
        console.log(err);
        return false;
      }
    );







  }

  // doExport() {
  //   this.ws = XLSX.utils.aoa_to_sheet([['Listado  de Usuarios']]);

  //      XLSX.utils.sheet_add_json(this.ws, this.mantenedorUserService.results, {origin: 1});

  //   // workbook
  //   this.wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(this.wb, this.ws, 'Listado de Usuarios');

  //   // XLSX file
  //   XLSX.writeFile(this.wb, 'Exportar_Usuarios.xlsx');
  // }
  // TODO revisar si el metodo se utiliza

  cambiaFechaDesde(event: IMyDateModel) {
    // Fecha Hasta
    this.fechaCompraHasta = undefined;

    if (event.date.year > 0) {
      const d: Date = new Date();
      this.myDatePickerOptionsCopy = Object.assign({}, this.formatoFechaHasta.myDatePickerOptions);

      this.formatoFechaHasta.myDatePickerOptions.disableSince = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 };
      this.myDatePickerOptionsCopy.disableUntil = { year: event.date.year, month: event.date.month, day: event.date.day - 1 };
      this.myDatePickerOptionsHasta = this.myDatePickerOptionsCopy;
    }

    this.fechaCompraDesde = (event.date.year > 0) ?
      new Date(event.date.year + ',' + event.date.month + ',' + event.date.day)
      : undefined;
  }
  cambiaFechaHasta(event: IMyDateModel) {

    this.fechaCompraHasta = (event.date.year > 0) ? new Date(event.date.year + ',' + event.date.month + ',' + event.date.day) : undefined;
  }

  validationEmail(email: any) {

    // const EMAIL_REGEXP = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})/;
    const EMAIL_REGEXP = /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/;
    if (EMAIL_REGEXP.test(email.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  validationEmailLength(email: any) {

    if (email.length <= 150) {
      return true;
    } else {
      return false;
    }
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
    this.resultadoBusquedaUsuario = [];
  }
  clearSessionStorage() {
    sessionStorage.removeItem('formIdUser');
    sessionStorage.removeItem('formUserName');
    sessionStorage.removeItem('formUserStatus');
    sessionStorage.removeItem('formUserIdProfile');
    sessionStorage.removeItem('formUserNameLastName');

  }

  insertarLog(idEvento: number, idOrder: number, idUser: number, valorAntiguo: string, valorNuevo: string) {
    this.logService.insertarLogBitacora(idEvento, idOrder, idUser, valorAntiguo, valorNuevo)
      .subscribe((res: any) => this.ret = res,
        (err) => {
          console.log('ocurrio un error al insertar log');
          console.log(err);
        },
        () => {
          console.log(this.ret);
          if (this.ret.code !== undefined && this.ret.code === 0) {
            // this.ret = this.utils.validarRespuesta(this.ret);
            console.log('se inserto el log correctamente');
          } else {
            console.log('problemas al insertar el log correctamente');
          }
        }
      );
  }

}
