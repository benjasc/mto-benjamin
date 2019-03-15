export class EmisionUnitariaModel {

  public isSelected: Boolean;
  public modeloDespacho: String;
  public estadoCDU: String;
  public motivoCDU: String;
  public estadoMotivoReserva: String;
  public cud: Number;
  public ubicacion: String;
  public sku: Number;
  public descripcionSKU: String;
  public region: String;
  public comuna: String;
  public direccionDespacho: String;
  public nBoleta: Number;
  public cantidad: Number;
  public sucursalVenta: String;
  public sucursalStock: String;

  constructor() {
    this.isSelected = false;
    this.modeloDespacho = undefined;
    this.estadoCDU = undefined;
    this.motivoCDU = undefined;
    this.estadoMotivoReserva = undefined;
    this.cud = 0;
    this.ubicacion = undefined;
    this.sku = 0;
    this.descripcionSKU = undefined;
    this.region = undefined;
    this.comuna = undefined;
    this.direccionDespacho = undefined;
    this.nBoleta = 0;
    this.cantidad = 0;
    this.sucursalVenta = undefined;
    this.sucursalStock = undefined;
  }






}
