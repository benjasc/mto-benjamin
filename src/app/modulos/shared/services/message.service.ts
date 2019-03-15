import { LoadingComponent } from './../../shared/components/loading/loading.component';
import { ModalAlertComponent } from './../../shared/components/modalAlert/modalAlert.component';
import { Globals } from './../../shared/utils/globals';
import { Injectable } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';


@Injectable()
export class MessageService {
    mensaje: string;
    loading;

    constructor( private dialogService: DialogService, private globals: Globals) {}

    enviarMensaje(titulo: string, mensajes: string[], tipo: string , dialogService: DialogService ) {
        console.log('Entre para enviar mensajes' + titulo + ' / ' + mensajes + ' / ' + tipo);
        const disposable = this.dialogService.addDialog(ModalAlertComponent, {
            title: titulo,
            messages: mensajes,
            type: tipo
        });
        // .subscribe((isConfirmed) => { });
        // setTimeout(() =>  {
        //     disposable.unsubscribe();
        // }, 100000);
    }

    cargando(open: boolean) {
        // if (open) {
        //     this.loading = this.dialogService.addDialog(LoadingComponent, {
        //         title: this.globals.MsjLoading
        //     }).subscribe((isConfirmed) => { });
        // } else {
        //     this.loading.unsubscribe();
        // }
    }
}
