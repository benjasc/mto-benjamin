/**
 * Created by josegarridojana on 09-05-18.
 */
export class Sale {
  constructor(
    public codPPE: string,
    public country: string,
    public creationtime: string,
    public dteNumber: string,
    public email: string,
    public nameCustomer: string,
    public ordernumber: number,
    public ordertype: string,
    public phoneNumber: string,
    public salesChannel: string,
    public shippingdate: string,
    public status: string,
    public store: string

  ) {}
}
