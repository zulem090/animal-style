import { UsuarioDto } from '@/dto/auth/UsuarioDto';
import { User } from '@prisma/client';
import { toUsuarioDto } from './toUsuarioDto';

describe('toUsuarioDto', () => {
  const mockUser: User = {
    id: '1',
    nombre: 'Juan',
    apellido: 'Perez',
    cedula: BigInt(1234567890),
    email: 'juan.perez@example.com',
    direccion: 'Calle Falsa 123',
    usuario: 'juanp',
    telefono: BigInt(9876543210),
    password: 'securepassword',
    idSucursalVirtual: BigInt(456),
    role: 'USER', // Aunque se mapee siempre a 'ADMIN'
  };

  it('debería mapear correctamente un objeto User a UsuarioDto', () => {
    const result: UsuarioDto = toUsuarioDto(mockUser);

    expect(result).toEqual({
      id: mockUser.id,
      nombre: mockUser.nombre,
      apellido: mockUser.apellido,
      cedula: Number(mockUser.cedula),
      email: mockUser.email,
      role: 'ADMIN', // Siempre se mapeará como 'ADMIN'
      direccion: mockUser.direccion,
      usuario: mockUser.usuario,
      telefono: Number(mockUser.telefono), // Convertido a Number
      password: mockUser.password,
      idSucursalVirtual: Number(mockUser.idSucursalVirtual), // Convertido a Number
    });
  });

  it('debería manejar correctamente campos opcionales como undefined', () => {
    const mockUserSinOpcionales: User = {
      ...mockUser,
      telefono: null, // Sin teléfono
      idSucursalVirtual: null, // Sin sucursal virtual
    };

    const result: UsuarioDto = toUsuarioDto(mockUserSinOpcionales);

    expect(result).toEqual({
      id: mockUserSinOpcionales.id,
      nombre: mockUserSinOpcionales.nombre,
      apellido: mockUserSinOpcionales.apellido,
      cedula: Number(mockUserSinOpcionales.cedula),
      email: mockUserSinOpcionales.email,
      role: 'ADMIN', // Siempre 'ADMIN'
      direccion: mockUserSinOpcionales.direccion,
      usuario: mockUserSinOpcionales.usuario,
      telefono: undefined, // Convertido a undefined
      password: mockUserSinOpcionales.password,
      idSucursalVirtual: undefined, // Convertido a undefined
    });
  });

  it('debería convertir correctamente los campos BigInt a Number', () => {
    const result: UsuarioDto = toUsuarioDto(mockUser);

    expect(result.cedula).toBe(Number(mockUser.cedula));
    expect(result.telefono).toBe(Number(mockUser.telefono));
    expect(result.idSucursalVirtual).toBe(Number(mockUser.idSucursalVirtual));
  });

  it('debería manejar undefined para los campos opcionales si son null', () => {
    const mockUserWithNullFields: User = {
      ...mockUser,
      telefono: null,
      idSucursalVirtual: null,
    };

    const result: UsuarioDto = toUsuarioDto(mockUserWithNullFields);

    expect(result.telefono).toBeUndefined();
    expect(result.idSucursalVirtual).toBeUndefined();
  });
});
