import { HttpClient } from '@angular/common/http';
import { CommonService } from './../../shared/services/common.service';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { ResumenVentas } from '../vo/ResumenVentas';
import { OCFailCount } from '../vo/OCFailCount';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {
    private metodo: string;
    public url_api: string;
    ret: any;

    static readonly CODIGO_CREDITO: string = 'CREDITO';
    static readonly CODIGO_DEBITO: string  = 'DEBITO';

    constructor(public http: HttpClient, private commonService: CommonService) {
        this.url_api = environment.url_api;
    }

    getTotalStatus(state: number, store: number, channel: number) {
        this.metodo = '/homeScreen/';
        const jsonResponse = this.http.get(this.url_api + this.metodo + '/' + state + '/' + store + '/' + channel,
        { headers: this.commonService.createHttpHeader() });
        return jsonResponse;
    }

    getTotalAmountByChannel(store, state) {
        const method = '/channel';
        const jsonResponse = this.http.get(this.url_api + method + '/' + store + '/' + state,
        { headers: this.commonService.createHttpHeader() });
        return jsonResponse;
    }

    getTotalAmountByPaymentMethod(state, store, channel) {
        const method = '/payment';
        const jsonResponse = this.http.get(this.url_api + method + '/' + state + '/' + store + '/' + channel,
        { headers: this.commonService.createHttpHeader() });
        return jsonResponse;
    }
    getTotalFailed(state, store, channel) {
        const method = '/failed';
        const jsonResponse = this.http.get(this.url_api + method + '/' + state + '/' + store + '/' + channel,
        { headers: this.commonService.createHttpHeader() });
        return jsonResponse;
    }

    getFrequencyDistribution(state, store, channel) {
        const method = '/frequencyDistribution';
        const jsonResponse = this.http.get(this.url_api + method + '/' + state + '/' + store + '/' + channel,
        { headers: this.commonService.createHttpHeader() });
        return jsonResponse;
    }

    getShippingOrdersDays(days: number, channel: any) {
        const method = '/shipping';
        const jsonResponse = this.http.get(this.url_api + method + '/' + days + '/' + channel,
        { headers: this.commonService.createHttpHeader() });
        return jsonResponse;
    }

    /**
     * Obtiene el resumen de ventas por tipo de origen
     * @param payments lista de pagos
     */
    getResumenVentas(payments: any): ResumenVentas {

        const OTROS = 'OTROS';

        let obj:ResumenVentas = {
            fecha: "",
            items: []
        };

        let amounts = {}

        amounts[DashboardService.CODIGO_CREDITO]    = { amount: 0, label: 'Crédito'};
        amounts[DashboardService.CODIGO_DEBITO]     = { amount: 0, label: 'Débito'};
        amounts[OTROS]                              = { amount: 0, label: 'Otros'};

        for (let payment of payments) {
            if (payment.paymentMethod in amounts)
                amounts[payment.paymentMethod].amount = amounts[payment.paymentMethod].amount + payment.sumPayment;
            else
                amounts[OTROS].amount = amounts[OTROS].amount + payment.sumPayment;
        }

        let total = Object.keys(amounts).reduce((prev, curr, i) => prev + (+amounts[curr].amount), 0);

        obj.items.push({
            descripcion: "Total",
            monto: total
        });

        for (let key in amounts) {
            obj.items.push({
                descripcion: amounts[key].label,
                monto: amounts[key].amount
            });
        }
        return obj;
    }

    getOrdersWithErrorsCount(startDate, endDate): Observable<OCFailCount[]> {
      const method = '/errors/count-orders';
      return this.http.post(
        this.url_api + method, {
          status: "0",
          startDate: startDate,
          endDate: endDate,
          channel: 1,
          store: 1,
          ordenCompra: "-1",
          typeOrder: "0"
        }, { headers: this.commonService.createHttpHeader() })
      .pipe(
        map((json:any) => {

          if ((json && json.code != 0) || !json) {
            throw new Error('Error en el servicio');
          }

          let errs = JSON.parse(json.message).ltErroneousCounts;

          return errs.map(oc => ({
            origin: oc.descripcion,
            count: oc.cantidad
          }));
        })
      );
    }
}
