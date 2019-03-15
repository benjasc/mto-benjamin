import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { MessageService } from './../../../shared/services/message.service';
import { DashboardService } from './../../services/dashboard.service';
import { Globals } from './../../../shared/utils/globals';
import { Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ConversorPipe } from '../../../../pipe/conversor.pipe';
import { DashboardComponent } from './dashboard.component';
import { FormatPipe } from '../../../../pipe/format.pipe';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;


  beforeEach(() => {
    const dialogServiceStub = {};
    const messageServiceStub = {
      cargando: () => ({}),
      enviarMensaje: () => ({})
    };
    const dashboardServiceStub = {
      getTotalStatus: () => ({ subscribe: () => ({}) }),
      getTotalAmountByChannel: () => ({ subscribe: () => ({}) }),
      getTotalAmountByPaymentMethod: () => ({
        pipe: () => ({ subscribe: () => ({}) })
      }),
      getTotalFailed: () => ({ subscribe: () => ({}) }),
      getFrequencyDistribution: () => ({ subscribe: () => ({}) }),
      getResumenVentas: () => ({}),
      getOrdersWithErrorsCount: () => ({
        pipe: () => ({ subscribe: () => ({}) })
      }),
      getOrdersWithErrorsCountShipping: () => ({ subscribe: () => ({}) }),
      getShippingOrdersDays: () => ({ subscribe: () => ({}) })
    };

    const globalsStub = { getValue: () => ([{}, {}, {val: []}] ), foo: () => {} };
    const renderer2Stub = {};
    const routerStub = { navigate: () => ({}), url: {} };
    const conversorPipeStub = { transformDate: () => ({}) };

    TestBed.configureTestingModule({
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DashboardComponent, FormatPipe],
      providers: [
        { provide: DialogService, useValue: dialogServiceStub },
        { provide: MessageService, useValue: messageServiceStub },
        { provide: DashboardService, useValue: dashboardServiceStub },
        { provide: Globals, useValue: globalsStub },
        { provide: Renderer2, useValue: renderer2Stub },
        { provide: Router, useValue: routerStub },
        { provide: ConversorPipe, useValue: conversorPipeStub }
      ]
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const messageServiceStub: MessageService = fixture.debugElement.injector.get(
        MessageService
      );
      const globalsStub: Globals = fixture.debugElement.injector.get(Globals);
      spyOn(component, 'callTotalStatusService');
      spyOn(component, 'callGetTotalFailedService');
      spyOn(component, 'callGetTotalAmountByChannelService');
      spyOn(component, 'callGetTotalAmountByPaymentMethodService');
      spyOn(component, 'callGetFrequencyDistributionService');
      spyOn(component, 'callGetShippingOrdersDays');
      spyOn(component, 'callGetOrdersWithErrorsCount').and.returnValue(of({}));
      spyOn(component, 'callGetOrdersWithErrorsCountShipping');
      spyOn(component, 'hexToRgbA');
      spyOn(messageServiceStub, 'cargando');
      component.ngOnInit();
      expect(component.callTotalStatusService).toHaveBeenCalled();
      expect(component.callGetTotalFailedService).toHaveBeenCalled();
      expect(component.callGetTotalAmountByChannelService).toHaveBeenCalled();
      expect(
        component.callGetTotalAmountByPaymentMethodService
      ).toHaveBeenCalled();
      expect(component.callGetFrequencyDistributionService).toHaveBeenCalled();
      expect(component.callGetShippingOrdersDays).toHaveBeenCalled();
      expect(component.callGetOrdersWithErrorsCount).toHaveBeenCalled();
      expect(component.callGetOrdersWithErrorsCountShipping).toHaveBeenCalled();
      expect(component.hexToRgbA).toHaveBeenCalled();
      expect(messageServiceStub.cargando).toHaveBeenCalled();
    });
  });




  describe('callGetOrdersWithErrorsCount', () => {
    it('makes expected calls', () => {
      const messageServiceStub: MessageService = fixture.debugElement.injector.get(
        MessageService
      );
      const conversorPipeStub: ConversorPipe = fixture.debugElement.injector.get(
        ConversorPipe
      );

      const dashboardServiceStub: DashboardService = fixture.debugElement.injector.get(
        DashboardService
      );

      spyOn(component, 'incrementCounter');
      spyOn(messageServiceStub, 'enviarMensaje');
      spyOn(dashboardServiceStub, 'getOrdersWithErrorsCount').and.returnValue(_throw('Error simulado desde el servicio'));
      spyOn(conversorPipeStub, 'transformDate');
      component.callGetOrdersWithErrorsCount();
      expect(component.incrementCounter).toHaveBeenCalled();
      expect(messageServiceStub.enviarMensaje).toHaveBeenCalled();
      expect(conversorPipeStub.transformDate).toHaveBeenCalled();
    });


    it('respuesta ok', () => {
      const dashboardServiceStub: DashboardService = fixture.debugElement.injector.get(
        DashboardService
      );
      spyOn(dashboardServiceStub, 'getOrdersWithErrorsCount').and.returnValue(of({}));
      component.loadingMap = new Map();
      component.callGetOrdersWithErrorsCount();
    });
  });
});
