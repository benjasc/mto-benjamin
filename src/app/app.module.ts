import { BlockInfoComponent } from './modulos/ordenes/components/block-info/block-info.component';
import { EmailComponent } from './modulos/gestionMail/components/email/email.component';
import { ModalAlertComponent } from './modulos/shared/components/modalAlert/modalAlert.component';
import { BrowserModule,  } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { DatePipe, HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { HeaderComponent } from './modulos/shared/components/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './modulos/ordenes/components/dashboard/dashboard.component';
//import { LoginComponent } from './modulos/shared/components/login/login.component';
import { MyDatePickerModule } from 'mydatepicker';
import { ChartsModule } from 'ng2-charts';
import { MenuComponent } from './modulos/shared/components/menu/menu.component';
import { BackOfficeComponent } from './back-office/back-office.component';
import { OrderComponent } from './modulos/shared/components/order/order.component';
import { Globals } from './modulos/shared/utils/globals';
import { SearchComponent } from './modulos/ordenes/components/search/search.component';
import { AccordionModule } from 'ngx-accordion';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { ModalModule } from 'ngx-modal';
import { InconsistenciasOcComponent } from './modulos/ordenes/components/inconsistencias-oc/inconsistencias-oc.component';
import { DevolucionesAutomaticasComponent } from './modulos/devoluciones/components/automaticas/devoluciones.component';
import { DevolucionesManualesComponent } from './modulos/devoluciones/components/manuales/devoluciones.component';
import { NwbModule } from 'ng-wizi-bulma';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from './modulos/shared/services/searchservice';
import { ReportService } from './modulos/reportes/services/reportservice';
import { InconsistenciasOcService } from './modulos/ordenes/services/inconsistencias-oc.service';
import { EmailService } from './modulos/shared/services/email.service';
import { HttpModule } from '@angular/http';
import { DashboardService } from './modulos/ordenes/services/dashboard.service';
import { ConversorPipe } from './pipe/conversor.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import {OrderByPipe} from './pipe/orderby';
import {CapitalizePipe} from './pipe/capitalize.pipe';
import {WelcomePipe} from './pipe/welcome.pipe';
import { LoadingComponent } from './modulos/shared/components/loading/loading.component';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { MessageService } from './modulos/shared/services/message.service';
import { NumberDirectiveDirective } from './directives/number-directive.directive';
import { RutDirective } from './directives/RutDirective';
import { SkuDirective } from './directives/SkuDirective';
import { NumberOnlyDirective } from './directives/OnlyNumber.directive';
import { TrimPipe } from './pipe/trim.pipe';
import { DevolutionComponent } from './modulos/ordenes/components/devolution/devolution.component';
import { WelcomeComponent } from './modulos/ordenes/components/welcome/welcome.component';
import { FormatPipe } from './pipe/format.pipe';
import { ReportComponent } from './modulos/reportes/components/report/report.component';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService  } from 'ng4-loading-spinner';
import { ReportInfoOrderComponent } from './modulos/reportes/components/report-info-order/report-info-order.component';
import { ReportErrorUpateEomComponent } from './modulos/reportes/components/report-error-upate-eom/report-error-upate-eom.component';
import { EmailTemplateComponent } from './modulos/mantenedores/components/email-template/email-template.component';
import { EmailTemplateService } from './modulos/mantenedores/services/email.template.service';
import { MantenedorUserComponent } from './modulos/mantenedores/components/mantenedor-user/mantenedor-user.component';
import { MantenedorUserService } from './modulos/mantenedores/services/mantenedor.user.service';
import { LogService } from './modulos/shared/services/log.service';
import { MantenedorPointComponent } from './modulos/mantenedores/components/mantenedor-point/mantenedor-point.component';
import { BasepointService } from './modulos/mantenedores/services/basepoint.service';
import { LoyaltypayService } from './modulos/mantenedores/services/loyaltypay.service';
import { MaintainerProfileComponent } from './modulos/mantenedores/components/maintainer-profile/maintainer-profile.component';
import { MaintainerProfileService } from './modulos/mantenedores/services/maintainer-profile.service';
import { BitacoraService } from './modulos/reportes/services/bitacora.service';
import { BitacoraComponent } from './modulos/reportes/components/bitacora/bitacora.component';
import { EscapeHtmlPipe  } from './pipe/keep-html.pipe';
import { MantenedorParametrosComponent } from './modulos/mantenedores/components/mantenedor-parametros/mantenedor-parametros.component';
import { MaintainerParameterService } from './modulos/mantenedores/services/maintainer-parameter.service';
import { CommonService } from './modulos/shared/services/common.service';
import { OrderTypeService } from './modulos/shared/services/ordertypeservice';
import { EmisionUnitariaGdeService } from './modulos/gde/services/emisionUnitariaGde.service';
import localeCl from '@angular/common/locales/es-CL';
import localeClExtra from '@angular/common/locales/extra/es-CL';
import { HttpClientModule } from '@angular/common/http';
import { EmisionUnitariaGdeComponent } from './modulos/gde/components/emisionUnitariaGde/emisionUnitariaGde.component';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { DataTablesModule } from 'angular-datatables';
import { TableConfigEmisionGDE } from './modulos/gde/util/tableConfig.util';
//import { DataTableComponent } from './modulos/sgo/components/data-table/data-table.component';
//import { StepperComponent } from './modulos/sgo/components/steps/steps.component';
import { MaterialModule } from './material';
//import { InformationComponent } from './modulos/sgo/components/information/information.component';
import { NavbarComponent } from './modulos/sgo/components/navbar/navbar.component';
import { LoginComponent } from './modulos/sgo/components/login/login.component';
import { AdministracionUsuariosComponent } from './modulos/sgo/components/administracion-usuarios/administracion-usuarios.component';

registerLocaleData(localeCl, 'es-CL', localeClExtra);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    BlockInfoComponent,
    LoginComponent,
    MenuComponent,
    BackOfficeComponent,
    OrderComponent,
    SearchComponent,
    ReportComponent,
    InconsistenciasOcComponent,
    InconsistenciasOcComponent,
    DevolucionesAutomaticasComponent,
    DevolucionesManualesComponent,
    EmailComponent,
    ConversorPipe,
    OrderByPipe,
    ConversorPipe,
    ModalAlertComponent,
    LoadingComponent,
    NumberDirectiveDirective,
    RutDirective,
    SkuDirective,
    NumberOnlyDirective,
    CapitalizePipe,
    WelcomePipe,
    TrimPipe,
    DevolutionComponent,
    WelcomeComponent,
    FormatPipe,
    ReportComponent,
    ReportInfoOrderComponent,
    ReportErrorUpateEomComponent,
    EmailTemplateComponent,
    MantenedorUserComponent,
    MantenedorPointComponent,
    MaintainerProfileComponent,
    BitacoraComponent,
    EscapeHtmlPipe,
    MantenedorParametrosComponent,
    EmisionUnitariaGdeComponent,
    //DataTableComponent,
    //StepperComponent,
    //InformationComponent,
    NavbarComponent,
    AdministracionUsuariosComponent
    
  ],
  imports: [
    MaterialModule ,
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    AccordionModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    NwbModule,
    HttpModule,
    HttpClientModule,
    MyDatePickerModule,
    NgxPaginationModule,
    Ng4LoadingSpinnerModule,
    DataTablesModule,
    BootstrapModalModule.forRoot({container : document.body})
  ],
  providers: [
    Globals,
    SearchService,
    ReportService,
    InconsistenciasOcService,
    DashboardService,
    DatePipe,
    ConversorPipe,
    EmisionUnitariaGdeService,
    MessageService,
    EmailService,
    EmailTemplateService,
    MantenedorUserService,
    BasepointService,
    LoyaltypayService,
    LogService,
    MaintainerProfileService,
    BitacoraService,
    CommonService,
    MaintainerParameterService,
    OrderTypeService,
    TableConfigEmisionGDE,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: LOCALE_ID, useValue: 'es-CL' }
  ],
  entryComponents: [
    ModalAlertComponent,
    LoadingComponent,//StepperComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
