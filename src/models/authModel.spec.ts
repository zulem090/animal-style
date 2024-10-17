import { prismaMock } from '@/test/mocks/prismaMock';

import { Prisma, User as Usuario } from '@prisma/client';
import { signInEmailPassword, signInEmailUserPassword, signUpUser } from './authModel';
import { CreateUsuarioDto } from '@/dto/auth/CreateUsuarioDto';
import { compareSync, hashSync } from 'bcryptjs';
import { UsuarioDto } from '@/dto/auth/UsuarioDto';
import { redirect } from 'next/navigation';

jest.mock('@prisma/client', () => {
  const mockClass: jest.MockedClass<any> = jest.fn((...args) => {
    const instance = Object.create(mockClass.prototype);

    return Object.assign(instance, { message: args[0], ...args[1] });
  });

  return {
    Prisma: {
      PrismaClientKnownRequestError: mockClass,
    },
  };
});

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));
jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(),
  compareSync: jest.fn(),
}));
jest.mock('yup', () => ({
  ...jest.requireActual('yup'),
  object: jest.fn().mockReturnValue({
    validate: () => mockYup(),
  }),
}));

const mockYup = jest.fn();

describe('Auth Model', () => {
  const mockBcrypt = {
    compareSync: compareSync as jest.Mock,
    hashSync: hashSync as jest.Mock,
  };
  const mockRedirect = redirect as unknown as jest.Mock;

  const usuarioRequest: CreateUsuarioDto = {
    cedula: 1,
    nombre: 'Zule',
    apellido: 'Muñoz',
    usuario: 'zule1',
    password: 'pass1',
    role: 'ADMIN',
    email: 'zule@gmail.com',
    direccion: 'Calle 1',
    telefono: 3000000000,
  } as CreateUsuarioDto;

  const usuario: Usuario | UsuarioDto = {
    id: '1',
    ...usuarioRequest,
    password: 'encrypted',
  } as unknown as Usuario | UsuarioDto;

  describe('signUpUser', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockBcrypt.hashSync.mockReturnValueOnce('encrypted');
        prismaMock.user.create.mockResolvedValueOnce(usuario as Usuario);
      });

      it('debería registrar un usuario', async () => {
        const result = await signUpUser(usuarioRequest, false);

        expect(prismaMock.user.create).toHaveBeenCalledWith({
          data: { ...usuarioRequest, password: usuario.password },
        });
        expect(result).toEqual({ data: usuario });
      });

      it('debería registrar un usuario con redirection = true', async () => {
        const result = await signUpUser(usuarioRequest, true);

        expect(prismaMock.user.create).toHaveBeenCalledWith({
          data: { ...usuarioRequest, password: usuario.password },
        });

        expect(mockRedirect).toHaveBeenCalledWith('/signin');
        expect(result).toEqual(undefined);
      });

      it('debería registrar un usuario con redirection = true cuando no es pasada por parámetro', async () => {
        const result = await signUpUser(usuarioRequest);

        expect(prismaMock.user.create).toHaveBeenCalledWith({
          data: { ...usuarioRequest, password: usuario.password },
        });

        expect(mockRedirect).toHaveBeenCalledWith('/signin');
        expect(result).toEqual(undefined);
      });
    });

    describe('cuando es fallido', () => {
      const mockConsole = jest.spyOn(console, 'error').mockImplementation();

      beforeEach(() => {
        jest.clearAllMocks();
        mockBcrypt.hashSync.mockReturnValueOnce('encrypted');
      });
      it('debería lanzar un error general', async () => {
        const error = 'Error X del usuario';
        prismaMock.user.create.mockRejectedValueOnce({ message: error });

        const result = await signUpUser(usuarioRequest, false);

        expect(mockConsole).toHaveBeenCalledWith(`SignUp error: ${error}`);

        expect(result).toEqual({ error: { message: 'Error inesperado al crear usuario' } });
      });

      it('debería lanzar un error de tipo PrismaClientKnownRequestError', async () => {
        const errorData = {
          code: 'P2002',
          clientVersion: '1',
          meta: { target: 'Usuario' },
        };

        prismaMock.user.create.mockRejectedValueOnce(
          new Prisma.PrismaClientKnownRequestError('Usuario ya existe', errorData),
        );

        const result = await signUpUser(usuarioRequest, false);

        expect(mockConsole).not.toHaveBeenCalled();

        expect(result).toEqual({
          error: { message: 'Usuario ya existe en el sistema', code: errorData.code, data: errorData.meta },
        });
      });
    });
  });

  describe('signInEmailPassword', () => {
    const email = usuarioRequest.email;
    const password = usuarioRequest.password;

    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockBcrypt.compareSync.mockReturnValueOnce(true);
        prismaMock.user.findUnique.mockResolvedValueOnce(usuario as Usuario);
      });

      it('debería iniciar sesión un usuario con el correo y contraseña', async () => {
        const result = await signInEmailPassword(email, password);

        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
          where: { email },
        });
        expect(result).toEqual(usuario);
      });

      it('debería retornar null si el email no es proveido', async () => {
        const result = await signInEmailPassword(undefined, password);

        expect(result).toEqual(null);
      });
      it('debería retornar null si el password no es proveido', async () => {
        const result = await signInEmailPassword(email, undefined);

        expect(result).toEqual(null);
      });
    });

    describe('cuando es fallido', () => {
      const mockConsole = jest.spyOn(console, 'error').mockImplementation();

      beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
        mockBcrypt.hashSync.mockReturnValueOnce('encrypted');
      });

      it('debería lanzar un error general', async () => {
        const error = 'Error X del usuario';
        prismaMock.user.findUnique.mockRejectedValueOnce({ message: error });

        const result = await signInEmailPassword(email, password);

        expect(mockConsole).toHaveBeenCalledWith(`SignUp error: ${error}`);

        expect(result).toEqual(null);
      });

      it('debería lanzar un error cuando el usuario no existe', async () => {
        const error = 'Usuario no existe';
        prismaMock.user.findUnique.mockResolvedValueOnce(null);

        const result = await signInEmailPassword(email, password);

        expect(mockConsole).toHaveBeenCalledWith(`SignUp error: ${error}`);

        expect(result).toEqual(null);
      });

      it('debería lanzar un error cuando el password es incorrecto', async () => {
        const error = 'Contraseña incorrecta';
        prismaMock.user.findUnique.mockResolvedValueOnce({ ...(usuario as Usuario), password: undefined! });

        const result = await signInEmailPassword(email, 'password-incorrecto');

        expect(mockConsole).toHaveBeenCalledWith(`SignUp error: ${error}`);

        expect(result).toEqual(null);
      });
    });
  });

  describe('signInEmailUserPassword', () => {
    const username = usuarioRequest.usuario;
    const password = usuarioRequest.password;

    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockBcrypt.compareSync.mockReturnValueOnce(true);
        prismaMock.user.findMany.mockResolvedValueOnce([usuario as Usuario]);
      });

      it('debería iniciar sesión un usuario con el correo y contraseña', async () => {
        const result = await signInEmailUserPassword(username, password);

        expect(prismaMock.user.findMany).toHaveBeenCalledWith({
          where: {
            OR: [{ email: username }, { usuario: username }],
          },
        });
        expect(result).toEqual(usuario);
      });

      it('debería retornar null si el usuario no es proveido', async () => {
        const result = await signInEmailUserPassword(undefined, password);

        expect(result).toEqual(null);
      });
      it('debería retornar null si el password no es proveido', async () => {
        const result = await signInEmailUserPassword(username, undefined);

        expect(result).toEqual(null);
      });
    });

    describe('cuando es fallido', () => {
      const mockConsole = jest.spyOn(console, 'error').mockImplementation();

      beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
        mockBcrypt.hashSync.mockReturnValueOnce('encrypted');
      });

      it('debería lanzar un error general', async () => {
        const error = 'Error X del usuario';
        prismaMock.user.findMany.mockRejectedValueOnce({ message: error });

        const result = await signInEmailUserPassword(username, password);

        expect(mockConsole).toHaveBeenCalledWith(`SignUp error: ${error}`);

        expect(result).toEqual(null);
      });

      it('debería lanzar un error cuando el usuario no existe', async () => {
        const error = 'Usuario no existe';
        prismaMock.user.findMany.mockResolvedValueOnce([]);

        const result = await signInEmailUserPassword(username, password);

        expect(mockConsole).toHaveBeenCalledWith(`SignUp error: ${error}`);

        expect(result).toEqual(null);
      });

      it('debería lanzar un error cuando el password es incorrecto', async () => {
        const error = 'Contraseña incorrecta';
        prismaMock.user.findMany.mockResolvedValueOnce([{ ...(usuario as Usuario), password: undefined! }]);

        const result = await signInEmailUserPassword(username, 'password-incorrecto');

        expect(mockConsole).toHaveBeenCalledWith(`SignUp error: ${error}`);

        expect(result).toEqual(null);
      });
    });
  });
});
