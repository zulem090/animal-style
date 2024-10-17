import { UsuarioDto } from '@/dto/auth/UsuarioDto';
import { User as UsuarioDb } from '@prisma/client';
import { toUsuarioDB } from './ToUsuarioDB';

describe('toUsuarioDB', () => {
  const mockUsuarioDto: UsuarioDto = {
    id: '1',
    nombre: 'Juan',
    apellido: 'Perez',
    cedula: 1234567890,
    email: 'juan.perez@example.com',
    direccion: 'Calle Falsa 123',
    usuario: 'juanp',
    telefono: 9876543210,
    password: 'securepassword',
    idSucursalVirtual: 456,
    role: 'ADMIN',
  };

  it('debería mapear correctamente UsuarioDto a UsuarioDb con todos los campos', () => {
    const result: UsuarioDb = toUsuarioDB(mockUsuarioDto);

    expect(result).toEqual({
      id: mockUsuarioDto.id,
      nombre: mockUsuarioDto.nombre,
      apellido: mockUsuarioDto.apellido,
      cedula: BigInt(mockUsuarioDto.cedula),
      email: mockUsuarioDto.email,
      role: 'ADMIN', // Valor fijo
      direccion: mockUsuarioDto.direccion,
      usuario: mockUsuarioDto.usuario,
      telefono: BigInt(mockUsuarioDto.telefono!), // Convertido a BigInt
      password: mockUsuarioDto.password,
      idSucursalVirtual: BigInt(mockUsuarioDto.idSucursalVirtual!), // Convertido a BigInt
    });
  });

  it('debería manejar campos opcionales como null si no están presentes', () => {
    const mockUsuarioDtoSinOpcionales: UsuarioDto = {
      ...mockUsuarioDto,
      telefono: undefined, // No tiene teléfono
      idSucursalVirtual: undefined, // No tiene sucursal virtual
    };

    const result: UsuarioDb = toUsuarioDB(mockUsuarioDtoSinOpcionales);

    expect(result).toEqual({
      id: mockUsuarioDtoSinOpcionales.id,
      nombre: mockUsuarioDtoSinOpcionales.nombre,
      apellido: mockUsuarioDtoSinOpcionales.apellido,
      cedula: BigInt(mockUsuarioDtoSinOpcionales.cedula),
      email: mockUsuarioDtoSinOpcionales.email,
      role: 'ADMIN',
      direccion: mockUsuarioDtoSinOpcionales.direccion,
      usuario: mockUsuarioDtoSinOpcionales.usuario,
      telefono: null, // Teléfono es null
      password: mockUsuarioDtoSinOpcionales.password,
      idSucursalVirtual: null, // Sucursal virtual es null
    });
  });

  it('debería convertir correctamente los campos de tipo BigInt', () => {
    const result: UsuarioDb = toUsuarioDB(mockUsuarioDto);

    // Comprobamos que los campos que deben ser BigInt lo son
    expect(result.cedula).toBe(BigInt(mockUsuarioDto.cedula));
    expect(result.telefono).toBe(BigInt(mockUsuarioDto.telefono!));
    expect(result.idSucursalVirtual).toBe(BigInt(mockUsuarioDto.idSucursalVirtual!));
  });

  it('debería manejar undefined o null en campos opcionales como telefono e idSucursalVirtual', () => {
    const mockUsuarioDtoParcial: UsuarioDto = {
      ...mockUsuarioDto,
      telefono: undefined,
      idSucursalVirtual: null!,
    };

    const result: UsuarioDb = toUsuarioDB(mockUsuarioDtoParcial);

    expect(result.telefono).toBeNull();
    expect(result.idSucursalVirtual).toBeNull();
  });
});
