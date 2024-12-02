import prisma from '@/orm/prisma';
import { Prisma, User as UsuarioDb } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

interface Context {
  params: {
    email?: string;
    username?: string;
    password?: string;
  };
}

export async function POST(request: Request, { params = {} }: Context): Promise<NextResponse<string>> {
  const { email, username, password } = await request.json();

  if (!email || !username) {
    return NextResponse.json<string>('Error: se necesita el correo o usuario.');
  }

  if (!password) {
    return NextResponse.json<string>('Error: se necesita la contraseña.');
  }

  try {
    if (!email && !username) {
      return NextResponse.json<string>('Error: se necesita el correo o usuario.');
    }

    if (!password) {
      return NextResponse.json<string>('Error: se necesita la contraseña.');
    }

    const emailOrUsername = email ? email : username;

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
      return NextResponse.json<string>('Error: Usuario no existe.');
    }

    let passwordIncorrecto = false;

    usuarios.forEach((usuarioDb: UsuarioDb) => {
      if (!bcrypt.compareSync(password, usuarioDb.password ?? '')) {
        passwordIncorrecto = true;
      }
    });

    if (passwordIncorrecto) {
      return NextResponse.json('Error: Contraseña incorrecta.');
    }

    return NextResponse.json<string>('Inicio de sesión exitoso!');
  } catch (error: any) {
    console.error(`SignUp error: ${error.message}`);
    return NextResponse.json<string>('Error: Contraseña incorrecta.');
  }
}
