'use server';

import { MarcaDto } from '@/dto/marca/marcaDto';
import prisma from '@/orm/prisma';
import { Marca } from '@prisma/client';

export async function getAllMarcas(): Promise<MarcaDto[]> {
  const marcas: Marca[] = await prisma.marca.findMany();

  return marcas.map((marca) => ({ idMarca: Number(marca.idMarca), nombre: marca.nombre }));
}
