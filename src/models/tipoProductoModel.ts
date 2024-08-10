'use server';

import { TipoProductoDto } from '@/dto/tipoProducto/tipoProductoDto';
import prisma from '@/orm/prisma';
import { TipoProducto } from '@prisma/client';

export async function getAllTipoProductos(): Promise<TipoProductoDto[]> {
  const tipos: TipoProducto[] = await prisma.tipoProducto.findMany();

  return tipos.map((tipo) => ({ idTipoProducto: Number(tipo.idTipoProducto), nombre: tipo.nombre }));
}
