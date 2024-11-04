'use server';

import { CreateUsuarioDto } from '@/dto/auth/CreateUsuarioDto';
import { CreateUsuarioResponse } from '@/dto/auth/CreateUsuarioResponse';
import { UsuarioDto } from '@/dto/auth/UsuarioDto';
import { toUsuarioDto } from '@/mappers/toUsuarioDto';
import prisma from '@/orm/prisma';
import { Prisma, User as UsuarioDb } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

const uniqueConstraintErrorCode = 'P2002';

export const signUpUser = async (
  usuario: CreateUsuarioDto,
  redirection: boolean = true,
): Promise<CreateUsuarioResponse | undefined> => {
  try {
    const password: string = bcrypt.hashSync(usuario.password, 10);

    const usuarioDb: UsuarioDb = await prisma.user.create({
      data: {
        ...usuario,
        role: 'USER',
        password,
      },
    });

    if (!redirection) {
      return { data: toUsuarioDto(usuarioDb) };
    }
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === uniqueConstraintErrorCode) {
        const field: string = error.meta?.target as string;

        return { error: { message: `${field} ya existe en el sistema`, code: error.code, data: error.meta } };
      }
    }
    console.error(`SignUp error: ${error.message}`);

    return { error: { message: 'Error inesperado al crear usuario' } };
  }

  if (redirection) redirect('/signin');
};

export const signInEmailPassword = async (email?: string, password?: string): Promise<UsuarioDto | null> => {
  try {
    if (!email || !password) return null;

    const usuario: UsuarioDb | null = await prisma.user.findUnique({ where: { email } });

    if (!usuario) {
      throw new Error('Usuario no existe');
    }

    if (!bcrypt.compareSync(password, usuario.password ?? '')) {
      throw new Error('Contraseña incorrecta');
    }

    return toUsuarioDto(usuario);
  } catch (error: any) {
    console.error(`SignUp error: ${error.message}`);
    return null;
  }
};

export const signInEmailUserPassword = async (
  emailOrUsername?: string,
  password?: string,
): Promise<UsuarioDto | null> => {
  try {
    if (!emailOrUsername || !password) return null;

    const usuarios: UsuarioDb[] | null = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: emailOrUsername,
          },
          {
            usuario: emailOrUsername,
          },
        ],
      } as Prisma.UserWhereUniqueInput,
    });

    if (!usuarios.length) {
      throw new Error('Usuario no existe');
    }

    let usuario: UsuarioDb;

    usuarios.forEach((usuarioDb: UsuarioDb) => {
      if (!bcrypt.compareSync(password, usuarioDb.password ?? '')) {
        throw new Error('Contraseña incorrecta');
      }
      usuario = usuarioDb;
    });

    return toUsuarioDto(usuario!);
  } catch (error: any) {
    console.error(`SignUp error: ${error.message}`);
    return null;
  }
};
