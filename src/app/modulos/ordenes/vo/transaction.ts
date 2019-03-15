/**
 * Created by josegarridojana on 09-05-18.
 */
export class Transaction {
  constructor(
    public numDTE: string,
    public numStore: string,
    public numTerminal: string,
    public sdvDate: string,
    public typeDTE: string
  ) {}
}
