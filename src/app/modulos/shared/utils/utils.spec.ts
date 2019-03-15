import { Utils } from "./utils";
import { MessageService } from "../services/message.service";
import { Router } from "@angular/router";
import { DialogService } from "ng2-bootstrap-modal";
import { OCFailCount } from "../../ordenes/vo/OCFailCount";

describe('Utils', () => {

  let utils: Utils;

  beforeAll(() => {
    const mockRouter:Router = jasmine.createSpyObj('Router',['foo']);
    const dServ:DialogService = jasmine.createSpyObj('DialogService', ['foo']);
    const msgServ:MessageService = jasmine.createSpyObj('MessageService', ['foo']);
    utils = new Utils(msgServ, mockRouter, dServ);
  });


  it('debe convertir y agrupar conteo de errores en OCs', () => {

    let res = utils.failOCMapper(null);
    expect(res).toBeNull();

    let res2 = utils.failOCMapper(mockFailCount);
    let mapVersion = res2.reduce((obj, item) => (obj[item.origin] = item.count , obj), {});

    expect(mapVersion[Utils.LABEL_GIFTCARD]).toBeDefined();
    expect(mapVersion[Utils.LABEL_GIFTCARD]).toEqual(1);
    expect(mapVersion[Utils.LABEL_PPL]).toBeDefined();
    expect(mapVersion[Utils.LABEL_PPL]).toEqual(13);
  });
});



/***** FIXTURES */

const mockFailCount: OCFailCount[] = [
  {
    origin : "Actualizacion_OD",
    count : 10
  }, {
    origin : "Consulta_DTE",
    count : 10
  }, {
    origin : "Creacion_OD",
    count : 28
  }, {
    origin : "Creacion_TRX_SDV",
    count : 11
  }, {
    origin : "Email_Confirmacion_DTE",
    count : 1
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
