/**
 * Created by josegarridojana on 09-05-18.
 */
import { OrderFile } from './../../shared/vo/orderFile';

export class File {

  constructor(public fileName: number,
    public lines: string,
    public errorType: string,
    public update: string,
    public orders: OrderFile[]) {}
}
