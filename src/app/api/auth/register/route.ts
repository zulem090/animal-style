import prisma from '@/orm/prisma';
import { Prisma, User as UsuarioDb } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { toUsuarioDto } from '@/mappers/toUsuarioDto';
import { CreateUsuarioDto } from '@/dto/auth/CreateUsuarioDto';
import { CreateUsuarioResponse } from '@/dto/auth/CreateUsuarioResponse';

const uniqueConstraintErrorCode = 'P2002';

interface Context {
  params: CreateUsuarioDto;
}

export async function POST(request: Request, { params }: Context): Promise<NextResponse<CreateUsuarioResponse>> {
  const usuario: CreateUsuarioDto = await request.json();
  try {
    const password: string = bcrypt.hashSync(usuario.password, 10);

    const usuarioDb: UsuarioDb = await prisma.user.create({
      data: {
        ...usuario,
        role: 'USER',
        password,
      },
    });

    return NextResponse.json<CreateUsuarioResponse>({ data: toUsuarioDto(usuarioDb) });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === uniqueConstraintErrorCode) {
        const field: string = error.meta?.target as string;

        return NextResponse.json<CreateUsuarioResponse>({
          error: { message: `${field} ya existe en el sistema`, code: error.code, data: error.meta },
        });
      }
    }
    console.error(`SignUp error: ${error.message}`);

    return NextResponse.json<CreateUsuarioResponse>({
      error: { message: `Error inesperado al crear usuario: ${error.message}` },
    });
  }
}
