import { AuthController } from '@/controllers/authController';
import { UsuarioDto } from '@/dto/auth/UsuarioDto';
import { toUsuarioDB } from '@/mappers/ToUsuarioDB';
import prisma from '@/orm/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Prisma, User } from '@prisma/client';
import { AuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';

export const getAuthOptions = (): AuthOptions => ({
  adapter: PrismaAdapter(Prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(creds) {
        const authController = new AuthController();
        const user: UsuarioDto | null = await authController.loginEmailUser(creds?.email, creds?.password);

        if (!user) return null;

        return toUsuarioDB(user);
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    newUser: '/signup',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días para que la sesión expire
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token }) {
      const dbUser: User | null = await prisma.user.findUnique({ where: { email: token.email ?? 'no-email' } });

      if (!dbUser) return token;

      token.id = dbUser.id;
      token.role = dbUser?.role ?? 'USER';
      token.nombre = dbUser.nombre;

      return token;
    },
    async session({ session, token }) {
      if (session && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.name = token.nombre as string;
      }

      return session;
    },
  },
});
