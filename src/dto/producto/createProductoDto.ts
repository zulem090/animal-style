import { Producto } from '@prisma/client';

export interface CreateProductoDto extends Omit<Producto, 'idProducto' | 'idTipo' | 'idMarca' | 'imagen' | 'precio'> {
  precio: number;
  imagen?: string;
  idTipo?: number;
  idMarca?: number;
}
