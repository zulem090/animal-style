import { CreateUsuarioDto } from '@/dto/auth/CreateUsuarioDto';
import { CreateUsuarioResponse } from '@/dto/auth/CreateUsuarioResponse';
import { UsuarioDto } from '@/dto/auth/UsuarioDto';
import { User as Usuario } from '@prisma/client';
import { AuthController } from './authController';

const usuarioRequest: CreateUsuarioDto = {
  cedula: 1,
  nombre: 'Pepe',
  apellido: 'Justo',
  usuario: 'pepe1',
  password: 'pass1',
  role: 'ADMIN',
  email: 'pepe@gmail.com',
  direccion: 'Calle 1',
  telefono: 3000000000,
} as CreateUsuarioDto;

const usuario: Usuario | UsuarioDto = {
  id: '1',
  ...usuarioRequest,
  password: 'encrypted',
} as unknown as Usuario | UsuarioDto;

const modelMock = {
  signUpUser: jest.fn().mockResolvedValue({ data: usuarioRequest } as CreateUsuarioResponse),
  signInEmailPassword: jest.fn().mockResolvedValue(usuario),
  signInEmailUserPassword: jest.fn().mockResolvedValue(usuario),
};

jest.mock('@/models/authModel', () => ({
  signUpUser: (...args: unknown[]) => modelMock.signUpUser(...args),
  signInEmailPassword: (...args: unknown[]) => modelMock.signInEmailPassword(...args),
  signInEmailUserPassword: (...args: unknown[]) => modelMock.signInEmailUserPassword(...args),
}));

describe('AuthController', () => {
  const controller = new AuthController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear un usuario', async () => {
    const response = await controller.createUser(usuarioRequest, true);

    expect(modelMock.signUpUser).toHaveBeenCalled();
    expect(modelMock.signUpUser).toHaveBeenCalledWith(usuarioRequest, true);
    expect(response).toEqual({ data: usuarioRequest });
  });

  it('debe iniciar sesión con email y password', async () => {
    const email = 'pepe@gmail.com';
    const password = 'pass123';

    const response = await controller.login(email, password);

    expect(modelMock.signInEmailPassword).toHaveBeenCalled();
    expect(modelMock.signInEmailPassword).toHaveBeenCalledWith(email, password);
    expect(response).toEqual(usuario);
  });

  it('debe iniciar sesión con usuario y password', async () => {
    const username = 'pepe1';
    const password = 'pass123';

    const response = await controller.loginEmailUser(username, password);

    expect(modelMock.signInEmailUserPassword).toHaveBeenCalled();
    expect(modelMock.signInEmailUserPassword).toHaveBeenCalledWith(username, password);
    expect(response).toEqual(usuario);
  });
});
