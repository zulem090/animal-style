import { prismaMock } from '@/test/mocks/prismaMock';
import { User } from '@prisma/client';
import { getAuthOptions } from './authOptions';
import { Session } from 'next-auth';

const authControllerMock = {
  loginEmailUser: jest.fn(),
};

jest.mock('@/controllers/authController', () => ({
  AuthController: jest.fn().mockImplementation(() => authControllerMock),
}));

describe('Auth Options', () => {
  const mockUser = {
    id: '1',
    nombre: 'Test User',
    email: 'test@test.com',
    role: 'ADMIN',
  } as User;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería configurar el adaptador de Prisma', () => {
    const options = getAuthOptions();

    expect(options.adapter).toBeDefined();
  });

  it('debería definir las páginas de autenticación correctamente', () => {
    const options = getAuthOptions();

    expect(options.pages?.signIn).toBe('/signin');
    expect(options.pages?.newUser).toBe('/signup');
  });

  it('debería manejar correctamente el callback jwt', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const options = getAuthOptions();
    const token = { id: '1', email: mockUser.email };
    const newToken = await options.callbacks?.jwt?.({
      token,
      user: undefined!,
      account: null!,
    });

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUser.email } });
    expect(newToken).toMatchObject({
      id: mockUser.id,
      role: mockUser.role,
      nombre: mockUser.nombre,
    });
  });

  it('debería devolver el token sin cambios si no se encuentra un usuario en jwt callback', async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

    const options = getAuthOptions();
    const token = { id: '1', email: 'no-user@test.com' };
    const newToken = await options.callbacks?.jwt?.({
      token,
      user: undefined!,
      account: null,
    });

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: token.email } });
    expect(newToken).toBe(token);
  });

  it('debería manejar correctamente el callback session', async () => {
    const token = {
      id: mockUser.id,
      role: mockUser.role,
      nombre: mockUser.nombre,
    };

    const options = getAuthOptions();
    const session = { user: {} } as Session;
    const newSession = await options.callbacks?.session?.({
      session,
      token,
      user: undefined!,
      newSession: undefined,
      trigger: 'update',
    });

    expect(newSession!.user).toMatchObject({
      id: mockUser.id,
      role: mockUser.role,
      name: mockUser.nombre,
    });
  });
});
