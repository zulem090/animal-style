import { Producto } from '@prisma/client';

export interface UpdateProductoDto
  extends Partial<Omit<Producto, 'idProducto' | 'idTipo' | 'idMarca' | 'imagen' | 'precio'>> {
  idProducto: number;
  imagen?: string;
  precio?: number;
  idTipo?: number;
  idMarca?: number;
}
