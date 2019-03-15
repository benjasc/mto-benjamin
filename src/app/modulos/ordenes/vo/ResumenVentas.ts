export interface ResumenVentas {
    fecha: string;
    items: ItemResumenVentas[];
}

export interface ItemResumenVentas {
    descripcion: string;
    monto: number;
}