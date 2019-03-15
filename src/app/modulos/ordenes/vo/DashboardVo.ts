export interface DespachoDias {
    titulo: string;
    despacho: Despacho[];
}

export interface Despacho {
    fecha: string;
    contador: number;
}

export interface OrdenCompra {
    concepto: string;
    cantidad: number;
    porcentaje: number;
    idx: number;
}
