import { Producto } from '@prisma/client';

export interface ProductoDto extends Omit<Producto, 'idProducto' | 'idTipo' | 'idMarca' | 'imagen' | 'precio'> {
  idProducto: number;
  precio: number;
  imagen?: string;
  idTipo?: number;
  idMarca?: number;
  tipo?: string;
  marca?: string;
}
