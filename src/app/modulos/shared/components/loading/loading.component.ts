import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

export interface CargaModal {
  title: string;
}

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})

export class LoadingComponent extends DialogComponent<CargaModal, boolean> implements CargaModal {
  title: string;
  constructor(dialogService: DialogService) {
    super(dialogService);
  }
}
