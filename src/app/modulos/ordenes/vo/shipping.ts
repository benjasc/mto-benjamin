/**
 * Created by josegarridojana on 09-05-18.
 */
export class Shipping {
  constructor(
    public address: string,
    public name: string,
    public numOD: string,
    public shippingDate: string,
    public statusOD: string,
    public typeOD: string
  ) {}
}
