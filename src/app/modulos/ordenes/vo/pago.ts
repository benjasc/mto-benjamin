/**
 * Created by josegarridojana on 09-05-18.
 */
export class Pago {
  constructor(
    public payment: string,
    public discount: string,
    public subtotal: string,
    public totalPay: string
  ) {}
}
