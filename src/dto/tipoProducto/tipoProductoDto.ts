import { TipoProducto } from '@prisma/client';

export interface TipoProductoDto extends Omit<TipoProducto, 'idTipoProducto'> {
  idTipoProducto: number;
}
