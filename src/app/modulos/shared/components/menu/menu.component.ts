import { Globals } from './../../utils/globals';
import { MenuProfile } from './../../../shared/vo/menu';
import { Usuario } from './../../../shared/vo/usuario';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  items: any[];
  items2: any[];
  private config: any;

  @Input() logo: any;
  menuOpen: boolean;
  public usuario: Usuario;
  private menu: MenuProfile[];
  editable: Boolean;

  constructor(private globals: Globals) {
    this.config = this.globals.getValue();
  }

  ngOnInit() {
    if (this.config.length > 0) {
      console.log('MenuComponent this.config.length: ' + this.config.length);
      console.log('Variable Config[1]');
      console.log(this.config[1].val);
      this.usuario = this.config[1].val;
      console.log('MenuComponent usuario.name: ' + this.usuario);

      this.menu = this.config[2].val;
      console.log('MenuComponent menu.length: ' + this.menu.length);
    }

    // Modulos de acceso a ordenes
    console.log('Access Menu : ' + this.menu[0].idAccess + ' / ' + this.menu[0].idModule);
    if (this.menu[0].idAccess > 1 ) {
      this.editable = true;
    } else {
      this.editable = false;
    }
    console.log('editable ' + this.editable);
    this.items = this.menu;
    console.log('menusProfile ' + JSON.stringify(this.items));




     /*

    if (sessionStorage.getItem('flagRoute') === 'welcome') {

      this.items = [
        {
          name: 'Ordenes',
          icon: 'icono-order',
          active: false,
          visible: false,
          subItems: [
            //{ name: 'Dashboard', link: '/back-office/dashboard' },
            {
              name: (sessionStorage.getItem('flagRoute') === 'dashboard' ? 'Dashboard' : 'Welcome'),
              link: (sessionStorage.getItem('flagRoute') === 'dashboard' ? '/back-office/dashboard' : '/back-office/welcome') },
            { name: 'Visualización', link: '/back-office/search' },
           //{ name: 'Errores', link: '/back-office/inconsistencias-oc' }
          ]
        },
        {
          name: 'Gestión Mail',
          icon: 'icono-mail',
          active: false,
          visible: false,
          subItems: [
  //         { name: 'Dashboard' },
  //         { name: 'Visualización' },
            { name: 'Errores', link: '/back-office/email' }
          ]
        },
        {
          name: 'Reportes',
          icon: 'icono-reportes',
          active: false,
          visible: false,
          subItems: [
  //         { name: 'Dashboard' },
            { name: 'Reporteria Quiebre Stock', link: '/back-office/report'},
            { name: 'Reporteria Informacion OC', link: '/back-office/report-info-order'},
            { name: 'Reporteria Error Update EOM', link: '/back-office/report-error-update-eom'}
          ]
        },
        {
          name: 'Devoluciones',
          icon: 'icono-devoluciones',
          active: false,
          visible: false,
          subItems: [
            { name: 'Devoluciones automáticas', link: '/back-office/devoluciones/automaticas' },
            { name: 'Devoluciones manuales', link: '/back-office/devoluciones/manuales' }
          ]
        },
        {
          name: 'Mantenedores',
          icon: 'icono-mantenedores',
          active: false,
          visible: false,
          subItems: [

            // { name: 'Factores Puntos' },
            // { name: 'Perfiles' },
            // { name: 'Usuarios' },
            // { name: 'Módulos' },
            { name: 'Template Email', link: '/back-office/email-template' },
            { name: 'Usuarios', link: '/back-office/mantenedor-user' },
          ]
        }
      ];
    } else {
      this.items = [
        {
          name: 'Ordenes',
          icon: 'icono-order',
          active: false,
          visible: false,
          subItems: [
            //{ name: 'Dashboard', link: '/back-office/dashboard' },
            {
              name: (sessionStorage.getItem('flagRoute') === 'dashboard' ? 'Dashboard' : 'Welcome'),
              link: (sessionStorage.getItem('flagRoute') === 'dashboard' ? '/back-office/dashboard' : '/back-office/welcome') },
            { name: 'Visualización', link: '/back-office/search' },
            { name: 'Errores', link: '/back-office/inconsistencias-oc' }
          ]
        },
        {
          name: 'Gestión Mail',
          icon: 'icono-mail',
          active: false,
          visible: false,
          subItems: [
  //         { name: 'Dashboard' },
  //         { name: 'Visualización' },
            { name: 'Errores', link: '/back-office/email' }
          ]
        },
        {
          name: 'Reportes',
          icon: 'icono-reportes',
          active: false,
          visible: false,
          subItems: [
  //         { name: 'Dashboard' },
            { name: 'Reporteria Quiebre Stock', link: '/back-office/report'},
            { name: 'Reporteria Informacion OC', link: '/back-office/report-info-order'},
            { name: 'Reporteria Error Update EOM', link: '/back-office/report-error-update-eom'}
          ]
        },
        {
          name: 'Devoluciones',
          icon: 'icono-devoluciones',
          active: false,
          visible: false,
          subItems: [
            { name: 'Devoluciones automáticas', link: '/back-office/devoluciones/automaticas' },
            { name: 'Devoluciones manuales', link: '/back-office/devoluciones/manuales' }
          ]
        },
        {
          name: 'Mantenedores',
          icon: 'icono-mantenedores',
          active: false,
          visible: false,
          subItems: [

            // { name: 'Factores Puntos' },
            // { name: 'Perfiles' },
            // { name: 'Usuarios' },
            // { name: 'Módulos' },

            { name: 'Template Email', link: '/back-office/email-template' },
            { name: 'Usuarios', link: '/back-office/mantenedor-user' },

          ]
        }
      ];
    }
    */

    /*
    this.items = [
      {
        name: 'Ordenes',
        icon: 'icono-order',
        active: false,
        visible: false,
        subItems: [
          //{ name: 'Dashboard', link: '/back-office/dashboard' },
          {
            name: (sessionStorage.getItem('flagRoute') === 'dashboard' ? 'Dashboard' : 'Welcome'),
             link: (sessionStorage.getItem('flagRoute') === 'dashboard' ? '/back-office/dashboard' : '/back-office/welcome') },
          { name: 'Visualización', link: '/back-office/search' },
          { name: 'Errores', link: '/back-office/inconsistencias-oc' }
        ]
      },
      {
        name: 'Gestión Mail',
        icon: 'icono-mail',
        active: false,
        visible: false,
        subItems: [
 //         { name: 'Dashboard' },
 //         { name: 'Visualización' },
          { name: 'Errores', link: '/back-office/email' }
        ]
      },
      {
        name: 'Reportes',
        icon: 'icono-reportes',
        active: false,
        visible: false,
        subItems: [
 //         { name: 'Dashboard' },
          { name: 'Reporteria', link: '/back-office/report'}
        ]
      },
      {
        name: 'Devoluciones',
        icon: 'icono-devoluciones',
        active: false,
        visible: false,
        subItems: [
          { name: 'Devoluciones automáticas', link: '/back-office/devoluciones/automaticas' },
          { name: 'Devoluciones manuales', link: '/back-office/devoluciones/manuales' }
        ]
      },
      {
        name: 'Mantenedores',
        icon: 'icono-mantenedores',
        active: false,
        visible: false,
        subItems: [
          { name: 'Factores Puntos' },
          { name: 'Perfiles' },
          { name: 'Usuarios' },
          { name: 'Módulos' },
          { name: 'Template Email' },
        ]
      }
    ];
    */

    this.filterProfile();
  }

  public filterProfile() {
    for (let i = 0; i < this.items.length; i++) {
      for (let j = 0; j < this.menu.length; j++) {
        if (this.menu[j].name === this.items[i].name) {
          this.items[i].visible = true;
        }
      }
    }
  }

  public filterItemsOfType(type) {
    return this.items.filter(x => x.visible === type);
}

  public openMenu() {
    this.menuOpen = !this.menuOpen;
  }

  public menuClose() {
    this.menuOpen = false;
  }

  public showChilds = function (index) {
    this.menuOpen = true;
    this.items[index].active = !this.items[index].active;
    // this.collapseAnother(index);
    for (let i = 0; i < this.items.length; i++) {
      if (i !== index) {
        this.items[i].active = false;
      }
    }
  };

  public onContainerClicked(event: MouseEvent): void {
    // console.log('click');
    if ((<HTMLElement>event.target).classList.contains('app-menu__wrapper') ||
    (<HTMLElement>event.target).classList.contains('hideMenu')) {
      this.menuClose();
    }
  }

}

