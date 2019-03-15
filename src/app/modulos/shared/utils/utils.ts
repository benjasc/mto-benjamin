import { OCFailCount } from './../../ordenes/vo/OCFailCount';
import { MessageService } from './../services/message.service';
import { Router } from '@angular/router';
import { DialogService } from 'ng2-bootstrap-modal';
import CONSTANTS from './constants';

export class Utils {

    static readonly LABEL_GIFTCARD = 'GiftCard';
    static readonly LABEL_OEM = 'OEM';
    static readonly LABEL_PPL = 'PPL';
    static readonly LABEL_SDV = 'SdV';
    static readonly LABEL_XCASH = 'XCash';

    constructor(public messageService: MessageService,
        private router: Router, private dialogService: DialogService) { }

    validarRespuesta(res: any) {
        if (res.code === 0 && res.code !== undefined) {
          // cargando  !== null && cargando !== undefined ? this.messageService.cargando(cargando) : this.messageService.cargando(false);
          if (res.token !== null && res.token !== undefined && res.token !== '') {
            sessionStorage.setItem('token', res.token);
          }
          // this.messageService.cargando(false);
          return res;
        } else if (res.code === 12) {
          this.messageService.cargando(false);
          this.messageService.enviarMensaje('Alerta', [res.message], 'warn', this.dialogService);
          this.router.navigate(['/login']);
        } else {
          this.messageService.cargando(false);
          this.messageService.enviarMensaje('Error', ['Ha ocurrido un error en el servicio'], 'warn', this.dialogService);
        }
    }

    validarRespuestaFormatear(res: any) {
      if (res.code === 0 && res.code !== undefined) {
        if (res.token !== null && res.token !== undefined && res.token !== '') {
          sessionStorage.setItem('token', res.token);
        }
        // this.messageService.cargando(false);
        let respuesta: any;
        respuesta = res.message;
        respuesta = respuesta.replace(/\n/ig, '');
        respuesta = JSON.parse(respuesta);
        // this.messageService.cargando(false);
        return respuesta;
      } else if (res.code === 12) {
        this.messageService.cargando(false);
        this.messageService.enviarMensaje('Alerta', [res.message], 'warn', this.dialogService);
        this.router.navigate(['/login']);
      } else {
        this.messageService.cargando(false);
        this.messageService.enviarMensaje('Error', ['Ha ocurrido un error en el servicio'], 'warn', this.dialogService);
      }
  }

    errorRespuesta() {
    this.messageService.cargando(false);
    this.messageService.enviarMensaje('Error', ['Ha ocurrido un error en el servicio'], 'warn', this.dialogService);
    }

    validarToken () {// hay que revisar este metodo, aun no se implementa
      if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === undefined ) {
        sessionStorage.clear();
        this.messageService.cargando(false);
        this.router.navigate(['/login']);
        this.messageService.cargando(false);
      }
    }
    validarCarga(numero: number, numeroDeMetodos: number) {
      if (numero === numeroDeMetodos) {
        this.messageService.cargando(false);
      } else {
        numero = numero + 1;
        return numero;
      }
    }

    getErrorOC(code: number){
      return CONSTANTS.ERROR_OC[code];
    }


    failOCMapper(data: OCFailCount[]) {

      if (!data) return null;

      let order = [
        Utils.LABEL_GIFTCARD,
        Utils.LABEL_OEM,
        Utils.LABEL_PPL,
        Utils.LABEL_SDV,
        Utils.LABEL_XCASH,
      ];

      let sum = order.reduce( (prev, o) => { prev[o] = 0; return  prev; }, {} );

      const COUNTS_MAP = {
        "Actualizacion_OD": Utils.LABEL_OEM,
        "Consulta_DTE": Utils.LABEL_PPL,
        "Creacion_OD": Utils.LABEL_OEM,
        "Creacion_TRX_SDV": Utils.LABEL_SDV,
        "Email_Confirmacion_DTE": Utils.LABEL_PPL,
        "Email_DTE": Utils.LABEL_PPL,
        "Emision_DTE": Utils.LABEL_PPL,
        //"Ingreso_OC": ?,
        //"Regla_Email": ?,
        "Update_Giftcard": Utils.LABEL_GIFTCARD,
        "Update_Tmas": Utils.LABEL_XCASH,
      }

      for (const count of data) {
        let label = COUNTS_MAP[count.origin];
        if (label && order.includes(label)) {
          sum[label] = sum[label] + count.count;
        }
      }

      return Object.keys(sum).map(el => ({ origin: el, count: sum[el] }));
    }
}
