import { UsuarioDto } from '@/dto/auth/UsuarioDto';
import { User } from '@prisma/client';

export const toUsuarioDto = (usuario: User): UsuarioDto => ({
  id: usuario.id,
  nombre: usuario.nombre,
  apellido: usuario?.apellido,
  cedula: Number(usuario.cedula),
  email: usuario.email,
  role: 'USER',
  direccion: usuario.direccion,
  usuario: usuario.usuario,
  telefono: usuario.telefono ? Number(usuario.telefono) : undefined,
  password: usuario.password,
  idSucursalVirtual: usuario.idSucursalVirtual ? Number(usuario.idSucursalVirtual) : undefined,
});
