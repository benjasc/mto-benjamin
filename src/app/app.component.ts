import { Component } from '@angular/core';
import { Globals } from './modulos/shared/utils/globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Globals]
})
export class AppComponent {
  constructor(private globals: Globals) {
  }

}
