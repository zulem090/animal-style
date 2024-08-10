'use server';

import { Resena } from '@prisma/client';
import prisma from '@/orm/prisma';
import { ResenaDto } from '@/dto/resena/resenaDto';

export async function getProductoResenas(idProducto: number): Promise<ResenaDto> {
  const resenas: Pick<Resena, 'puntuacion'>[] = await prisma.resena.findMany({
    where: { idProducto },
    select: { puntuacion: true },
  });

  const numeroResenas: number = resenas.length;
  const puntuacionPromedio: number =
    resenas.reduce((suma, resena) => suma + Number(resena.puntuacion), 0) / resenas.length;

  return { numeroResenas, puntuacionPromedio };
}

export async function getPuntuacionProductByUser(idProducto: number, idUsuario: string): Promise<number | undefined> {
  const resena = await prisma.resena.findFirst({
    where: { idProducto, idUsuario },
    select: { puntuacion: true },
  });

  if (!resena) return;

  return Number(resena.puntuacion);
}
