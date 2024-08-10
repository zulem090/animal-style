import { UsuarioDto } from '@/dto/auth/UsuarioDto';
import { User as UsuarioDb } from '@prisma/client';

export const toUsuarioDB = (usuario: UsuarioDto): UsuarioDb => ({
  id: usuario.id,
  nombre: usuario.nombre,
  apellido: usuario?.apellido,
  cedula: BigInt(usuario.cedula),
  email: usuario.email,
  role: 'ADMIN',
  direccion: usuario.direccion,
  usuario: usuario.usuario,
  telefono: usuario.telefono ? BigInt(usuario.telefono) : null,
  password: usuario.password,
  idSucursalVirtual: usuario.idSucursalVirtual ? BigInt(usuario.idSucursalVirtual) : null,
});
