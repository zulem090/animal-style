import prisma from '@/orm/prisma';
import { Prisma, Producto } from '@prisma/client';
import { NextResponse } from 'next/server';
import * as yup from 'yup';

const requiredMessage = 'este campo es requerido';

const productoUpdateSchema = yup.object({
  nombre: yup.string().required(requiredMessage),
  precio: yup.number().required(requiredMessage).min(0),
  cantidad: yup.number().required(requiredMessage).min(0),
  descripcion: yup.string().optional(),
  idTipo: yup.number().required(requiredMessage),
  idMarca: yup.number().required(requiredMessage),
  imagen: yup.object().optional(),
});

const productoDeleteSchema = yup.object({
  idProducto: yup.string().required(requiredMessage),
});

interface Context {
  params: {
    idProducto: string;
  };
}

const getProducto = async (idProducto: number): Promise<Producto> => {
  const producto: Producto | null = await prisma.producto.findUnique({ where: { idProducto } });

  if (!producto) throw new Error(`No producto with id ${idProducto} found`);

  return producto;
};

export async function GET(request: Request, { params }: Context): Promise<NextResponse<Producto>> {
  const producto: Producto = await getProducto(Number(params.idProducto));

  return NextResponse.json<Producto>(producto);
}

export async function PUT(request: Request, { params }: Context): Promise<NextResponse<Producto>> {
  const { idProducto } = params;
  const id: number = Number(idProducto);

  try {
    const payload: Prisma.ProductoUpdateInput = await productoUpdateSchema.validate(await request.json());

    const dto: Prisma.ProductoUpdateInput = {
      ...payload,
    };

    await getProducto(id);

    const updatedTodo: Producto = await prisma.producto.update({
      data: dto,
      where: { idProducto: id },
    });

    return NextResponse.json<Producto>(updatedTodo);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 }) as unknown as Promise<NextResponse<Producto>>;
  }
}

export async function DELETE(request: Request, { params }: Context): Promise<NextResponse<void>> {
  const { idProducto } = params;

  const id: number = Number(idProducto);

  try {
    await productoDeleteSchema.validate(await request.json());
    await getProducto(id);

    await prisma.producto.delete({ where: { idProducto: id } });

    return NextResponse.next() as NextResponse<void>;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 }) as unknown as Promise<NextResponse<void>>;
  }
}
