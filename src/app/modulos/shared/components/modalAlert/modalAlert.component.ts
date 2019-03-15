import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';


export interface AlertModal {
  title: string;
  messages: string[];
  type: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-modalAlert',
  templateUrl: './modalAlert.component.html',
  styleUrls: ['./modalAlert.component.css']
})

export class ModalAlertComponent extends DialogComponent<AlertModal, boolean> implements AlertModal {

  title: string;
  messages: string[];
  type: string;
  logout: boolean;
  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  cerrar() {
    this.dialogService.removeDialog(this);
  }
}
