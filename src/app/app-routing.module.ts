//import { DataTableComponent} from './modulos/sgo/components/data-table/data-table.component'
import { OrderComponent } from './modulos/shared/components/order/order.component';
import { DashboardComponent } from './modulos/ordenes/components/dashboard/dashboard.component';
//import { LoginComponent } from './modulos/shared/components/login/login.component';
import { LoginComponent } from './modulos/sgo/components/login/login.component';
import { SearchComponent } from './modulos/ordenes/components/search/search.component';
import { BackOfficeComponent } from './back-office/back-office.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InconsistenciasOcComponent } from './modulos/ordenes/components/inconsistencias-oc/inconsistencias-oc.component';
import { DevolucionesAutomaticasComponent } from './modulos/devoluciones/components/automaticas/devoluciones.component';
import { DevolucionesManualesComponent } from './modulos/devoluciones/components/manuales/devoluciones.component';
import { EmailComponent } from './modulos/gestionMail/components/email/email.component';
import { DevolutionComponent } from './modulos/ordenes/components/devolution/devolution.component';
import { WelcomeComponent } from './modulos/ordenes/components/welcome/welcome.component';
import { ReportComponent } from './modulos/reportes/components/report/report.component';
import { ReportInfoOrderComponent } from './modulos/reportes/components/report-info-order/report-info-order.component';
import { ReportErrorUpateEomComponent } from './modulos/reportes/components/report-error-upate-eom/report-error-upate-eom.component';
import { EmailTemplateComponent } from './modulos/mantenedores/components/email-template/email-template.component';
import { MantenedorUserComponent } from './modulos/mantenedores/components/mantenedor-user/mantenedor-user.component';
import { MantenedorPointComponent } from './modulos/mantenedores/components/mantenedor-point/mantenedor-point.component';
import { MaintainerProfileComponent } from './modulos/mantenedores/components/maintainer-profile/maintainer-profile.component';
import { BitacoraComponent } from './modulos/reportes/components/bitacora/bitacora.component';
import { MantenedorParametrosComponent } from './modulos/mantenedores/components/mantenedor-parametros/mantenedor-parametros.component';
import { EmisionUnitariaGdeComponent } from './modulos/gde/components/emisionUnitariaGde/emisionUnitariaGde.component';
//import { StepperComponent } from './modulos/sgo/components/steps/steps.component';
//import { InformationComponent } from './modulos/sgo/components/information/information.component';
import { NavbarComponent } from './modulos/sgo/components/navbar/navbar.component';
import { AdministracionUsuariosComponent } from './modulos/sgo/components/administracion-usuarios/administracion-usuarios.component';


const routes: Routes = [
  //{ path: 'pasos', component: StepperComponent },
  { path: 'administracion', component: AdministracionUsuariosComponent },
  { path: 'sgo', component: NavbarComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'welcome', component: WelcomeComponent},
  { path: 'search', component: SearchComponent },
  { path: 'order/:ordernumber', component: OrderComponent },
  { path: 'email', component: EmailComponent },
  { path: 'inconsistencias-oc', component: InconsistenciasOcComponent },
  { path: 'devoluciones/automaticas', component: DevolucionesAutomaticasComponent },
  { path: 'devoluciones/manuales', component: DevolucionesManualesComponent },
  { path: 'devolution/:ordernumbernc', component: DevolutionComponent },
  { path: 'report', component: ReportComponent },
  { path: 'report-info-order', component: ReportInfoOrderComponent },
  { path: 'report-error-update-eom', component: ReportErrorUpateEomComponent },
  { path: 'email-template', component: EmailTemplateComponent },
  { path: 'mantenedor-user', component: MantenedorUserComponent },
  { path: 'mantenedor-point', component: MantenedorPointComponent },
  { path: 'maintainer-profile', component: MaintainerProfileComponent },
  { path: 'bitacora', component: BitacoraComponent },
  { path: 'maintainer-parameter', component: MantenedorParametrosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'gde', component: EmisionUnitariaGdeComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'gde', pathMatch: 'full', redirectTo: 'welcome' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

