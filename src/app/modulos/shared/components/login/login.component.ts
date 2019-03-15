import { Autentication } from './../../../shared/vo/autentication';
import { Store } from './../../../shared/vo/store';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Globals } from '../../utils/globals';
import { LoginService } from '../../services/login.service';
import { MessageService } from './../../../shared/services/message.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { Usuario } from '../../vo/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  usuario: string;
  password: string;
  cadena: string;

  autentication: Autentication;

  ret: any;
  loading: boolean;
  idCompany: string;
  stores: Store[] = [];

  private easy = 'easy';
  private paris = 'paris';
  private johnson = 'johnson';

  constructor(private globals: Globals, private router: Router, private loginService: LoginService,
    private dialogService: DialogService, private messageService: MessageService) {
    // limpiar busqueda anterior
    this.cleanSearch();

    this.form = new FormGroup({
      usuario: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      cadena: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    // limpiar busqueda anterior
    this.cleanSearch();

    this.autentication = new Autentication();
    this.loading = false;
    this.idCompany = '1';
    this.loginService.getStoresFromCompany(this.idCompany).subscribe(
      (res: any) => (this.ret = res),
      err => {
        console.log(<any>err);
      },
      () => {
        this.stores = this.ret;
      }
    );
  }

  public onChange(value: String): void {
    this.globals.clean();

    console.log('Tienda seleccionada : ' + value);

    if (value === '2') {
      this.globals.setValue('theme', this.johnson);
      // this.globals.themeApp(this.johnson);
    } else {
      this.globals.setValue('theme', this.paris);
    }
  }

  loguear() {
    this.loading = true;
    this.messageService.cargando(this.loading);

    this.cadena = this.form.controls.cadena.value;
    this.usuario = this.form.controls.usuario.value;
    this.password = this.form.controls.password.value;
    // this.router.navigate(['/back-office']);

    console.log('cadena  :' + this.cadena);
    console.log('ususario :' + this.usuario);
    console.log('password :' + this.password);

    this.loginService.loginUser(this.usuario, this.password, this.cadena).subscribe(
        (res: any) => (this.ret = res),
        err => {
          this.loading = false;
          this.messageService.cargando(this.loading);
          console.log(err);
          console.log('Error al loguear');
        },
        () => {
          if (this.ret.code !== undefined && this.ret.code === 0) {
            this.loading = false;
            this.messageService.cargando(this.loading);
            console.log('imprimiendo valores del metodo Loguear() ' + JSON.stringify(this.ret));
            console.log('this.ret: ' + JSON.stringify(this.ret));
            sessionStorage.clear();
            sessionStorage.setItem('idProfile', this.ret.usuario.idProfile);
            sessionStorage.setItem('flagRoute', this.ret.usuario.flagRoute);
            sessionStorage.setItem('nameUser', this.ret.usuario.name + ' ' + this.ret.usuario.lastname);
            sessionStorage.setItem('idUser', this.ret.usuario.idUser);
            sessionStorage.setItem('cadena', this.cadena);
            sessionStorage.setItem('token', this.ret.token); // aqui puse el token
            // this.autentication = new Autentication();
            this.autentication.usuario = this.ret.usuario;
            this.autentication.menu = this.ret.menusProfile;
            this.globals.setValue('usuario', this.ret.usuario);
            this.globals.setValue('menu', this.ret.menusProfile);

            this.loginService.insertLogAuth(1, 0, this.autentication.usuario.idUser).subscribe(
                result => {
                  console.log('insertamos log correctamente');
                  console.log(result);
                },
                error => {
                  console.log(<any>error);
                }
              );

            if (sessionStorage.getItem('flagRoute') === 'dashboard') {
              console.log('dashboard');
              this.router.navigate(['/back-office/dashboard']);
            } else {
              console.log('welcome');
              this.router.navigate(['/back-office/welcome']);
            }
          } else if (this.ret.code === 100 && this.ret.code !== undefined) {
            this.loading = false;
            this.messageService.cargando(this.loading);
            this.messageService.enviarMensaje('Alerta', [this.ret.message], 'warn', this.dialogService);
            this.router.navigate(['/login']);
          } else {
            // console.log((this.ret.code !== undefined) ? 'Error: Código[' + this.ret.code + '] -' + this.ret.message : 'ERROR');
            console.log('Camino a enviar el mensaje de Error');
            this.loading = false;
            this.messageService.cargando(this.loading);
            this.messageService.enviarMensaje('Error Login', [this.ret.message], 'info', this.dialogService);
          }
        }
      );
  }

  cleanSearch() {
    this.usuario = null;
    this.password = null;
    this.cadena = null;
    this.autentication = null;
    this.ret = null;
    this.loading = false;
    this.idCompany = null;
    this.stores = [];
  }
}
