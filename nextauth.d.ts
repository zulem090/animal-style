// nextauth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';

interface IUser extends DefaultUser {
  /**
   * Roles del usuario
   */
  role?: string;
  apellido?: string | null;
  cedula?: number | bigint | null;
  telefono?: number | bigint | null;
  direccion?: string | null;
  /**
   * Agregar cualquier otro campo que tu manejas
   */
}

declare module 'next-auth' {
  interface User extends IUser {}

  interface Session {
    user?: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends IUser {}
}
