import { User as UsuarioDB } from '@prisma/client';

export interface UsuarioDto extends Omit<UsuarioDB, 'cedula' | 'telefono' | 'idSucursalVirtual'> {
  cedula: number;
  telefono?: number;
  idSucursalVirtual?: number;
}
