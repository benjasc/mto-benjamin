import { Utils } from './../../../shared/utils/utils';
import { SearchService } from './../../../shared/services/searchservice';
import { Mail } from './../../../shared/vo/mail';
import { EmailTemplateService } from '../../services/email.template.service';
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
import { Router } from '@angular/router';
import { LogService } from './../../../shared/services/log.service';
import { headersToString } from 'selenium-webdriver/http';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})

export class EmailTemplateComponent implements OnInit {
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
  listEmailTemplates: any;
  dir: any;
  formatRut: string;
  modelAccordion: Array<any> = [{ isAccordionOpen: false }];

  private usuario: Usuario;
  private config: any;
  ret: any;
  loadingForwardEmail: boolean;
  loadings: boolean;
  // resultsEmailByOC: Object[];
  editable: Boolean;
  extension: any;
  results: any;
  filename: string;

  fileUpload: any;
  fileBase64: any;
  base64textString: any;
  nameFileBase64: any;
  fileNameFull: string;
  arrayFile: [''];
  url: String;
  contentBody: String;
  editarMail: Mail;
  editaMail: any;
  utils: Utils;
  @ViewChild('myModalEmailInfo') myModalEmailInfo;
  @ViewChild('myModalEmailShow') myModalEmailShow;

  constructor(public emailInfo: EmailTemplateService, public messageService: MessageService,
    public dialogService: DialogService, public searchInfoforEmail: SearchService,
    public globals: Globals, public logService: LogService, public router: Router) {
      this.pgCurrent = 1;
      this.pgrows = GLOBAL.paginador_rows;
      this.orderProperty = '+ordernumber';
      this.config = this.globals.getValue();
      this.editarMail = new Mail();
      this.utils = new Utils(this.messageService, this.router, this.dialogService);
  }

  // Rut
  cuerpoRut: string;
  dvRut: string;
  private imageSrc: String = '';

  ngOnInit() {

    this.messageService.cargando(true);
    // usuario
    this.usuario = this.config[1].val;
    // menu
    this.menu = this.config[2].val;
    // url
    this.url = this.router.url;
    // Modulos de acceso
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

    // // Se inicializa los combos
    console.log('Cargando Canales');
    console.log(sessionStorage.getItem('cadena'));
    this.emailInfo.getEmailTemplate(Number(sessionStorage.getItem('cadena'))).subscribe(
      result => {
        console.log(result);
        this.listEmailTemplates = this.utils.validarRespuestaFormatear(result);
        this.listEmailTemplates = this.listEmailTemplates.listEmailTemplates;
        console.log(this.listEmailTemplates);
      },
      error => {
        console.log(<any>error);
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

  public filterSubItemAccess(items: any, url: any) {
    for (let i = 0; i < items.length; i++) {
      if (url === items[i].url) {
          console.log('items[i].idAccess ' + items[i].idAccess);
          if (items[i].idAccess > 1) {
            this.editable = false;
          } else {
            this.editable = true;
          }
          // items[i].visible = true;
      }
    }
  }

  leadingZero(value) {
    if (value < 10) {
      return '0' + value.toString();
    }
    return value.toString();
  }

  doSearchEmailTemplate(idEmail: string, name: string, description: string, subject: string) {

    console.log('Comienzo servicio de busqueda de email');
    // Valido Campos y Fechas que no vengan Vacios
    if (idEmail === '' && name === '' && description === '' && subject === '') {
      this.messageService.enviarMensaje('Error búsqueda', ['Debe ingresar filtro de búsqueda'], 'info', this.dialogService);
      return;
    }
    const idStore = Number(sessionStorage.getItem('cadena'));
    console.log(idStore);
    this.loadings = true;
    this.messageService.cargando(this.loadings);
    this.emailInfo.searchEmailTemplate(+idEmail, idStore, name, description, subject, '-1', '-1').subscribe(
      res => {
        console.log(res);
        this.results = this.utils.validarRespuestaFormatear(res);
        // this.results = res.message.replace(/\n/ig, '');
        // this.results = JSON.parse(this.results);
        console.log(this.results);
        this.loadings = false;
        this.messageService.cargando(this.loadings);
      },
      err => {
        console.log(err);
        this.loadings = false;
        this.messageService.cargando(this.loadings);
        this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda'], 'info', this.dialogService);
      }
    );
 }

  searchEmailTemplateDetail(idEmail: string, name: string, description: string, subject: string, from: string, filename: string) {
    this.editarMail.idEmail = idEmail;
    this.editarMail.description = description;
    this.editarMail.subject = subject;
    this.editarMail.from = from;
    this.editarMail.name = name;
    this.editarMail.filename = filename;
    // if (this.searchInfoforEmail.resultsDetail !== []) {
    //   this.searchInfoforEmail.resultsDetail = [];
    // }
    // if (this.emailInfo.resultsEmailByOC !== []) {
    //   this.emailInfo.resultsEmailByOC = [];
    // }

    // open Modal
    this.myModalEmailInfo.open();
  }

   showEmailTemplate(idEmail: string, name: string, description: string, subject: string, body: string) {
    console.log('en showEmailTemplate');
    // if (this.searchInfoforEmail.resultsDetail !== []) {
    //   this.searchInfoforEmail.resultsDetail = [];
    // }
    // if (this.emailInfo.resultsEmailByOC !== []) {
    //   this.emailInfo.resultsEmailByOC = [];
    // }
    // aquí estamos vinculando una variable llamada 'content' a innerHTML
    this.contentBody = body;

   // search detail order
    this.searchInfoforEmail.searchEmailTemplateDetail(idEmail, name, description, subject);


    // open Modal
    this.myModalEmailShow.open();
  }

   updateEmailTemplate(idEmail: String, emailDescription: String, emailSubject: String, emailFrom: String,
     emailName: String, emailBody: String) {
    this.usuario = this.config[1].val;
    console.log('this.fileBase64 =' + this.fileBase64);
    console.log('this.base64textString = ' + this.base64textString);

    if (emailDescription === '' || emailSubject === '' || emailFrom === '' || emailName === '' || emailBody === '') {
        this.messageService.enviarMensaje('Error Editar', ['Verifique que todos los campos esten completos'], 'info', this.dialogService);
    } else if (this.validaCampoMin(emailDescription + '')) {
       this.messageService.enviarMensaje('Error Editar',
       ['Verifique los valores del campo descripcion tenga un  minimo de 3 caracteres'], 'info', this.dialogService);
    } else if (this.validaCampoMin(emailSubject + '')) {
       this.messageService.enviarMensaje('Error Editar',
          ['Verifique los valores del campo subject tenga un  minimo de 3 caracteres'], 'info', this.dialogService);
    } else if (this.validaCampoMin(emailName + '')) {
       this.messageService.enviarMensaje('Error Editar',
          ['Verifique los valores del campo nombre tenga un  minimo de 3 caracteres'], 'info', this.dialogService);
    } else if (this.validaCampoMin(emailFrom + '')) {
       this.messageService.enviarMensaje('Error Editar',
          ['Verifique los valores del campo from tenga un  minimo de 3 caracteres'], 'info', this.dialogService);
    } else if (!this.validationEmail(emailFrom)) {
      this.messageService.enviarMensaje('Error Editar', ['Email no válido'], 'info', this.dialogService);
      return;
    } else if (this.extension !== 'html') {
      this.messageService.enviarMensaje('Error Editar',
          ['El formato del archivo es invalido, solo se permiten archivos .html'], 'info', this.dialogService);
    } else if (this.base64textString === undefined ||  this.base64textString === '') {
      this.messageService.enviarMensaje('Error Editar',
          ['El archivo es invalido, solo se permiten archivos con contenido'], 'info', this.dialogService);
    } else {
      this.loadings = true;
      this.messageService.cargando(this.loadings);
      this.emailInfo.editEMailTemplateInfo(idEmail, emailDescription, emailSubject, emailFrom, emailName,
        this.base64textString, this.filename).subscribe(
          res => {
            console.log(res);
            this.results = this.utils.validarRespuestaFormatear(res);
            // this.results = res.message;
            this.myModalEmailInfo.close();
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            const searchIdEmail =  sessionStorage.getItem('formEmailTemplateIdEmail');
            const searchIdStore = sessionStorage.getItem('formEmailTemplateIdStore');
            const searchName = sessionStorage.getItem('formEmailTemplateName');
            const serachDescription =  sessionStorage.getItem('formEmailTemplateDescription');
            const searchSubject = sessionStorage.getItem('formEmailTemplateSubject');
            const searchTo = sessionStorage.getItem('formEmailTemplateTo');
            const searchFrom =  sessionStorage.getItem('formEmailTemplateFrom');

            console.log('-->' + searchIdEmail + '-->' + searchIdStore + '-->' + searchName + '-->' + serachDescription +
              '-->' + searchSubject + '-->' + searchTo + '-->' + searchFrom);
            this.loadings = true;
            this.messageService.cargando(this.loadings);
            this.emailInfo.searchEmailTemplate(
            +searchIdEmail, +searchIdStore, (searchName !== '' ? searchName : '-1')
            , (serachDescription !== '' ? serachDescription : '-1'), (searchSubject !== '' ? searchSubject : '-1')
            , (searchTo !== '' ? searchTo : '-1'), (searchFrom !== '' ? searchFrom : '-1')).subscribe(
                resSearch => {
                  console.log(resSearch);
                  this.results = this.utils.validarRespuestaFormatear(resSearch);
                  // this.results = resSearch.message.replace(/\n/ig, '');
                  // this.results = JSON.parse(this.results);
                  console.log(this.results);
                  this.loadings = false;
                  this.messageService.cargando(this.loadings);
                  console.log('paso 1');
                  if (this.results.length === 0) {
                    this.messageService.enviarMensaje('Error búsqueda', ['Sin Resultados'], 'info', this.dialogService);
                  }
                },
                err => {
                  console.log(err);
                  this.loadings = false;
                  this.messageService.cargando(this.loadings);
                  this.messageService.enviarMensaje('Error búsqueda', ['Error en servicio de búsqueda'], 'info', this.dialogService);
                }
              );

              this.messageService.enviarMensaje('Actualizar email template', ['Email template actualizado correctamente'],
                'info', this.dialogService);
              this.logService.insertLog(4, 0, this.usuario.idUser  + '').subscribe(
                result => {
                  console.log(result);
                  result = this.utils.validarRespuestaFormatear(result);
                  console.log(result);
                  console.log('insertamos log correctamente');
                },
                error => {
                  console.log(<any>error);
                }
              );
          },
          err => {
            console.log(err);
            this.loadings = false;
            this.messageService.cargando(this.loadings);
            this.messageService.enviarMensaje('Error actualizar email template', ['Error servicio actualizar email template'],
             'info', this.dialogService);
          }
        );
    }
  }

  validaCampoMin(str: string) {
    if (str.length < 3 ) {
      return true;
    } else {
      return false;
    }
  }

  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    const nombreArchivo = file.name;
    const ext = nombreArchivo.split('.').pop();
    this.extension = nombreArchivo.split('.').pop();
    if (ext !== 'html') {
      // Message
      this.fileBase64 = undefined;
      return;
    }
    const reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    /* se utiliza para comenzar a leer el contenido del Blob o File especificado.
    En ese momento, el atributo de result contiene los datos binarios sin procesar del archivo. */
    // reader.readAsBinaryString(file);
    /* es usado para leer el contenido del especificado Blob o File el atributo result contiene
     la información como una URL representando la información del archivo como una cadena de caracteres codificados en base64. */
    reader.readAsDataURL(file);
    this.arrayFile = e.srcElement.value.split('\\');
    this.nameFileBase64 = this.arrayFile[this.arrayFile.length - 1].toString();
    const files = e.srcElement.files;
  }

  _handleReaderLoaded(e) {
    const reader = e.target;
    this.imageSrc = reader.result;
    const arreglo = this.imageSrc.split(',');
    this.fileBase64 = arreglo[1];
    const binaryString = e.target.result;
    console.log('binaryString=' + binaryString);
    const base64textString = btoa(binaryString);
    console.log('base64textString=' + base64textString);
    // this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    // console.log('base = ' +this.base64textString.push('data:image/png;base64,' + btoa(e.target.result)));
  }

  // https://stackoverflow.com/questions/43733866/convert-input-file-to-base64-in-angular-2-without-using-filereader-in-ionic-v2
  handleInputChange2 (evt) {
    const files = evt.target.files;
    const file = files[0];
    const nombreArchivo = file.name;
    this.filename = file.name;
    const ext = nombreArchivo.split('.').pop();
    this.extension = nombreArchivo.split('.').pop();
    if (files && file) {
        const reader = new FileReader();
        reader.onload = this._handleReaderLoaded2.bind(this);
        reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded2(readerEvt) {
     const binaryString = readerEvt.target.result;
     this.base64textString = btoa(binaryString);
     console.log('btoa(binaryString)=' + btoa(binaryString));
  }
  // [En caso de que se pida que exporte]
  // doExport() {
  //   this.ws = XLSX.utils.aoa_to_sheet([['Listado Template Email']]);
  //   XLSX.utils.sheet_add_json(this.ws, this.emailInfo.results, {origin: 1});

  //   // workbook
  //   this.wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(this.wb, this.ws, 'Listado Template Email');

  //   // XLSX file
  //   XLSX.writeFile(this.wb, 'Exportar_Template_Email.xlsx');
  // }

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
    const EMAIL_REGEXP = /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/;
    console.log('validacion email : ' + email.toLowerCase());
    if (EMAIL_REGEXP.test(email.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  validarRut(cuerpoIn: any, dvIn: string) {
    let suma: any;
    let multiplo: any;
    let i: any;
    let index: any;
    let valor: any;
    let dvEsperado: string;
    valor = cuerpoIn + '' + dvIn;
    // Si no cumple con el mínimo ej. (n.nnn.nnn)
    if (cuerpoIn.length < 7) {
      console.log('Rut no cumple con largo minimo');
      return false;
    }
    // Calcular Dígito Verificador
    suma = 0;
    multiplo = 2;

    for (i = 1; i <= cuerpoIn.length; i++) {
      index = multiplo * valor.charAt(cuerpoIn.length - i);
      suma = suma + index;
      if (multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
    }

    // Calcular Dígito Verificador en base al Módulo 11
    dvEsperado = (11 - (suma % 11)) + '';

    // Casos Especiales (0 y K)
    dvIn = (dvIn === 'K') ? '10' : dvIn;
    dvIn = (dvIn === '0') ? '11' : dvIn;

    // Validar que el Cuerpo coincide con su Dígito Verificador
    if (dvEsperado !== dvIn) {
      console.log('Rut no coincide con dv');
      return false;
    }

    console.log('Rut válido');
    return true;
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

  // selectTipoDoc(tipoDocSelected: string) {
  //   this.emailInfo.tipoDoc = tipoDocSelected;
  // }

  cleanResults() {
    this.loadings = false;
    this.loadingForwardEmail = false;
    this.results = [];
    // this.resultsEmailByOC = [];
    this.fechaCompraDesde = undefined;
    this.fechaCompraHasta = undefined;
    sessionStorage.removeItem('volverIc');
    this.contentBody = '';
  }
//  clearSessionStorage() {
//     sessionStorage.removeItem('formEmailTemplateIdEmail');
//     sessionStorage.removeItem('formEmailTemplateIdStore');
//     sessionStorage.removeItem('formEmailTemplateName');
//     sessionStorage.removeItem('formEmailTemplateDescription');
//     sessionStorage.removeItem('formEmailTemplateSubject');
//     sessionStorage.removeItem('formEmailTemplateTo');
//     sessionStorage.removeItem('formEmailTemplateFrom');

//   }

}

