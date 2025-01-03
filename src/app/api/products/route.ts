import prisma from '@/orm/prisma';
import { Prisma, Producto } from '@prisma/client';
import { NextResponse } from 'next/server';
import * as yup from 'yup';

const requiredMessage = 'este campo es requerido';

const productoCreateSchema = yup.object({
  nombre: yup.string().required(requiredMessage),
  precio: yup.number().required(requiredMessage).min(0),
  cantidad: yup.number().required(requiredMessage).min(0),
  descripcion: yup.string().optional(),
  idTipo: yup.number().required(requiredMessage),
  idMarca: yup.number().required(requiredMessage),
  imagen: yup.object().optional(),
});

export async function GET(request: Request): Promise<NextResponse<Producto[] | object>> {
  const { searchParams } = new URL(request.url);
  const offset: number = Number(searchParams.get('offset') ?? '0');
  const limit: number = Number(searchParams.get('limit') ?? '10');

  if (isNaN(offset)) {
    return NextResponse.json({ message: 'offset must be a number' }, { status: 400 });
  }

  if (isNaN(limit)) {
    return NextResponse.json({ message: 'limit must be a number' }, { status: 400 });
  }

  const productos: Producto[] = await prisma.producto.findMany({ skip: offset, take: limit });

  return NextResponse.json<Producto[]>(productos);
}

export async function POST(request: Request): Promise<NextResponse<Producto>> {
  try {
    const payload = (await productoCreateSchema.validate(await request.json())) as unknown as Producto;

    const dto: Prisma.ProductoCreateInput = {
      nombre: payload.nombre,
      precio: payload.precio,
      cantidad: payload.cantidad,
      descripcion: payload.descripcion,
      imagen: payload.imagen,
      tipo: { connect: { idTipoProducto: BigInt(payload.idTipo!) } },
      marca: { connect: { idMarca: BigInt(payload.idMarca!) } },
    };

    const producto: Producto = await prisma.producto.create({ data: dto });

    return NextResponse.json<Producto>(producto);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 }) as unknown as Promise<NextResponse<Producto>>;
  }
}
