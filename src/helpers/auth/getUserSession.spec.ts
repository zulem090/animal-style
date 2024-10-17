import { prismaMock } from '@/test/mocks/prismaMock';
import { toUsuarioDB } from '@/mappers/ToUsuarioDB';
import { User } from '@prisma/client';
import { Account, Awaitable, DefaultSession, Session } from 'next-auth';
import { getAuthOptions } from './authOptions';
import { JWT } from 'next-auth/jwt';
import { AdapterUser } from 'next-auth/adapters';

const authControllerMock = {
  loginEmailUser: jest.fn(),
};

const prismaAdapterMock = jest.fn();

jest.mock('@/controllers/authController', () => ({
  AuthController: jest.fn().mockImplementation(() => authControllerMock),
}));

jest.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: () => prismaAdapterMock(),
}));
jest.mock('@/mappers/ToUsuarioDB');

const mockToUsuarioDB = toUsuarioDB as jest.MockedFunction<typeof toUsuarioDB>;

describe('getAuthOptions', () => {
  it('should return the correct AuthOptions', async () => {
    const mockUserDB: User = {
      id: '1',
      nombre: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword',
      role: 'USER',
    };

    mockToUsuarioDB.mockReturnValue(mockUserDB);
    prismaMock.user.findUnique.mockResolvedValue(mockUserDB);

    const authOptions = getAuthOptions();

    expect(authOptions.adapter).toBeDefined();
    expect(authOptions.providers).toHaveLength(1);
    expect(authOptions.providers[0].name).toBe('Credentials');
    expect(authOptions.pages).toEqual({
      signIn: '/signin',
      newUser: '/signup',
    });
    expect(authOptions.session).toEqual({
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60,
    });
    expect(authOptions.secret).toBe(process.env.NEXTAUTH_SECRET);

    // Test the jwt callback
    const jwtCallback = authOptions.callbacks?.jwt;
    const token: JWT = {
      id: '1',
      email: 'john.doe@example.com',
    };
    const newToken = (await jwtCallback?.({
      token,
      user: {} as User,
      account: {} as Account,
    })) as JWT;
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: token.email ?? 'no-email' },
    });
    expect(newToken?.id).toBe(mockUserDB.id);
    expect(newToken?.role).toBe(mockUserDB.role);
    expect(newToken?.nombre).toBe(mockUserDB.nombre);

    // Test the session callback
    const sessionCallback = authOptions.callbacks?.session;
    const session = { user: {} } as Session;
    const newSession = (await sessionCallback?.({
      session,
      token: newToken,
      user: {} as AdapterUser,
      newSession: undefined,
      trigger: 'update',
    })!) as Awaitable<Session | DefaultSession>;
    expect(newSession!.user?.role).toBe(mockUserDB.role);
    expect(newSession?.user?.id).toBe(mockUserDB.id);
    expect(newSession?.user?.name).toBe(mockUserDB.nombre);
  });

  it('should return null if user is not found in authorize callback', async () => {
    authControllerMock.loginEmailUser.mockResolvedValue(null);

    const authOptions = getAuthOptions();
    const authorizeCallback = authOptions.providers[0].authorize;
    const credentials = { email: 'john.doe@example.com', password: 'password' };
    const user = await authorizeCallback?.(credentials);
    expect(user).toBeNull();
  });

  it('should return the original token if user is not found in jwt callback', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const authOptions = getAuthOptions();
    const jwtCallback = authOptions.callbacks?.jwt;
    const token = { email: 'john.doe@example.com' };
    const newToken = await jwtCallback?.({ token });
    expect(newToken).toEqual(token);
  });
});
