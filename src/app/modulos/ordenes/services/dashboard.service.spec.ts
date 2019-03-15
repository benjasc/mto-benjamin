import { DashboardService } from './dashboard.service';
import { ResumenVentas } from '../vo/ResumenVentas';
import { CommonService } from '../../shared/services/common.service';
import { OCFailCount } from '../vo/OCFailCount';

// Other imports
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';


describe('DashboardService', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let dashService: DashboardService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        CommonService,
        DashboardService
      ]
    });


    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    try {
      dashService = TestBed.get(DashboardService);
    } catch(e) {
      console.log('error: ', e);
    }
  });

  afterEach(() => {
    httpTestingController.verify();
  });


  it('debe hacer el resumen de pagos/vengas', () => {
    let mock = {"payments":[
        {"sumPayment":30000,"paymentMethod":"CREDITO"},
        {"sumPayment":20000,"paymentMethod":"DEBITO"},
        {"sumPayment":10000,"paymentMethod":"OTRO1"},
        {"sumPayment":20000,"paymentMethod":"OTRO2"},
        {"sumPayment":30000,"paymentMethod":"OTRO3"},
    ]};

    let expected: ResumenVentas = {
        fecha: "",
        items: [
            { monto: 110000, descripcion: 'Total' },
            { monto: 30000, descripcion: 'Crédito' },
            { monto: 20000, descripcion: 'Débito' },
            { monto: 60000, descripcion: 'Otros' },
        ]
    };

    let resumen = dashService.getResumenVentas(mock.payments);
    expect(resumen).toEqual(expected);

    mock = {"payments":[
      {"sumPayment":30000,"paymentMethod":"CREDITO"}
    ]};

    expected = {
      fecha: "",
      items: [
          { monto: 30000, descripcion: 'Total' },
          { monto: 30000, descripcion: 'Crédito' },
          { monto: 0, descripcion: 'Débito' },
          { monto: 0, descripcion: 'Otros' },
      ]
    };

    resumen = dashService.getResumenVentas(mock.payments);
    expect(resumen).toEqual(expected);
  });




  it('debe convertir los datos de ordenes con errores', () => {

    const respData = {
        "code": 0,
        "message": "{\r\n  \"ltErroneousCounts\" : [ {\r\n    \"descripcion\" : \"Actualizacion_OD\",\r\n    \"cantidad\" : 10\r\n  }, {\r\n    \"descripcion\" : \"Consulta_DTE\",\r\n    \"cantidad\" : 27\r\n  }, {\r\n    \"descripcion\" : \"Creacion_OD\",\r\n    \"cantidad\" : 28\r\n  }, {\r\n    \"descripcion\" : \"Creacion_TRX_SDV\",\r\n    \"cantidad\" : 11\r\n  }, {\r\n    \"descripcion\" : \"Email_Confirmacion_DTE\",\r\n    \"cantidad\" : 7\r\n  }, {\r\n    \"descripcion\" : \"Email_DTE\",\r\n    \"cantidad\" : 1\r\n  }, {\r\n    \"descripcion\" : \"Emision_DTE\",\r\n    \"cantidad\" : 1\r\n  }, {\r\n    \"descripcion\" : \"Ingreso_OC\",\r\n    \"cantidad\" : 5\r\n  }, {\r\n    \"descripcion\" : \"Regla_Email\",\r\n    \"cantidad\" : 9\r\n  }, {\r\n    \"descripcion\" : \"Update_Giftcard\",\r\n    \"cantidad\" : 1\r\n  }, {\r\n    \"descripcion\" : \"Update_Tmas\",\r\n    \"cantidad\" : 12\r\n  } ]\r\n}",
        "token": "asdfasdfasdf"
    };
    const respDataError = {
        "code": 12,
        "message": "{\r\n  \"ltErroneousCounts\" : [ {\r\n    \"descripcion\" : \"Actualizacion_OD\",\r\n    \"cantidad\" : 10\r\n  }, {\r\n    \"descripcion\" : \"Consulta_DTE\",\r\n    \"cantidad\" : 27\r\n  }, {\r\n    \"descripcion\" : \"Creacion_OD\",\r\n    \"cantidad\" : 28\r\n  }, {\r\n    \"descripcion\" : \"Creacion_TRX_SDV\",\r\n    \"cantidad\" : 11\r\n  }, {\r\n    \"descripcion\" : \"Email_Confirmacion_DTE\",\r\n    \"cantidad\" : 7\r\n  }, {\r\n    \"descripcion\" : \"Email_DTE\",\r\n    \"cantidad\" : 1\r\n  }, {\r\n    \"descripcion\" : \"Emision_DTE\",\r\n    \"cantidad\" : 1\r\n  }, {\r\n    \"descripcion\" : \"Ingreso_OC\",\r\n    \"cantidad\" : 5\r\n  }, {\r\n    \"descripcion\" : \"Regla_Email\",\r\n    \"cantidad\" : 9\r\n  }, {\r\n    \"descripcion\" : \"Update_Giftcard\",\r\n    \"cantidad\" : 1\r\n  }, {\r\n    \"descripcion\" : \"Update_Tmas\",\r\n    \"cantidad\" : 12\r\n  } ]\r\n}",
        "token": "asdfasdfasdf"
    };


    let obs = dashService.getOrdersWithErrorsCount(null, null);

    let expected: OCFailCount[] = [
      {
        origin : "Actualizacion_OD",
        count : 10
      }, {
        origin : "Consulta_DTE",
        count : 27
      }, {
        origin : "Creacion_OD",
        count : 28
      }, {
        origin : "Creacion_TRX_SDV",
        count : 11
      }, {
        origin : "Email_Confirmacion_DTE",
        count : 7
      }, {
        origin : "Email_DTE",
        count : 1
      }, {
        origin : "Emision_DTE",
        count : 1
      }, {
        origin : "Ingreso_OC",
        count : 5
      }, {
        origin : "Regla_Email",
        count : 9
      }, {
        origin : "Update_Giftcard",
        count : 1
      }, {
        origin : "Update_Tmas",
        count : 12
      }
    ]

    // prueba 1: llamada exitosa
    obs.subscribe(resp => {
      expect(resp).toEqual(expected);
    });

    // prueba 2: respuesta con codigo de error
    obs.subscribe(
      resp => fail('debe fallar'),
      err => {
        expect(err.message).toBeDefined();
      }
    );

    // prueba 3: respuesta nula
    obs.subscribe(
      resp => fail('debe fallar'),
      err => {
        expect(err.message).toBeDefined();
      }
    );

    // prueba 4: error http
    obs.subscribe(
      resp => fail('debe fallar'),
      err => {
        expect(err.message).toBeDefined();
      }
    );

    const req = httpTestingController.match(dashService.url_api + '/errors/count-orders');
    expect(req.length).toEqual(4, 'calls to getOrdersWithErrorsCount()');

    req[0].flush(respData);
    req[1].flush(respDataError);
    req[2].flush(null);
    req[3].flush({}, { status: 400, statusText: 'Error HTTP 400' });
  })
})

