/**
 * Created by josegarridojana on 09-05-18.
 */
export class Order {
         constructor(
           public orderNumber: number,
           public origin: number,
           public description: string,
           public detalle: string,
           public update: string
          ) {}
       }
