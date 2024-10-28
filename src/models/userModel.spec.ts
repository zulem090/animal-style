import { prismaMock } from '@/test/mocks/prismaMock';
import { User } from '@prisma/client';
import { getUserSession } from '@/helpers/auth/getUserSession';
import { updatePersonalInfo } from './userModel';

jest.mock('@/helpers/auth/getUserSession', () => ({
  getUserSession: jest.fn(),
}));

describe('User Model', () => {
  const mockSession = getUserSession as jest.Mock;

  const userMock: User = {
    id: 1,
    cedula: 1,
    name: 'Zule',
    apellido: 'Muñoz',
    usuario: 'zule1',
    password: 'pass1',
    role: 'ADMIN',
    email: 'zule@gmail.com',
    direccion: 'Calle 1',
    telefono: 3000000000,
  } as unknown as User;

  const userMock2: User = {
    id: 2,
    cedula: 2,
    name: 'Pepe',
    apellido: 'Ganga',
    usuario: 'pepe1',
    password: 'pass2',
    role: 'ADMIN',
    email: 'pepe@gmail.com',
    direccion: 'Calle 2',
    telefono: 3000000001,
  } as unknown as User;

  describe('updatePersonalInfo', () => {
    const payload: Pick<User, 'direccion' | 'telefono'> = {
      direccion: userMock.direccion,
      telefono: userMock.telefono,
    };

    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockSession.mockResolvedValueOnce(userMock);
        prismaMock.user.findUnique.mockResolvedValueOnce(userMock2);
        prismaMock.user.update.mockResolvedValueOnce(userMock2);
      });

      it('debería actualizar el usuario por su dirección y teléfono', async () => {
        const result = await updatePersonalInfo(payload);
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
          where: { id: userMock.id },
        });
        expect(prismaMock.user.update).toHaveBeenCalledWith({
          data: payload,
          where: {
            id: userMock.id,
          },
        });
        expect(result).toEqual(undefined);
      });

      it('no debería de actualizar el usuario si se probee la misma información personal', async () => {
        prismaMock.user.findUnique.mockReset().mockClear().mockResolvedValueOnce(userMock);
        const result = await updatePersonalInfo(payload);
        expect(prismaMock.user.update).not.toHaveBeenCalled();
        expect(result).toEqual(undefined);
      });

      it('no debería de actualizar el usuario si no hay dirección ni teléfono', async () => {
        const payloadSinDatos: Pick<User, 'direccion' | 'telefono'> = {
          direccion: undefined!,
          telefono: undefined!,
        };
        const result = await updatePersonalInfo(payloadSinDatos);
        expect(prismaMock.user.update).not.toHaveBeenCalled();
        expect(result).toEqual(undefined);
      });
    });

    describe('cuando es fallido', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockSession.mockResolvedValueOnce(userMock);
      });

      it('debería lanzar un error si el usuario no existe', () => {
        prismaMock.user.findUnique.mockResolvedValueOnce(null);

        expect(() => updatePersonalInfo(payload)).rejects.toThrow(new Error(`No user with id ${userMock.id} found`));
      });
      it('debería lanzar un error general al intentar actualizar', () => {
        prismaMock.user.findUnique.mockResolvedValueOnce(userMock2);
        prismaMock.user.update.mockRejectedValueOnce({ message: 'Error al intentar actualizar' });

        expect(() => updatePersonalInfo(payload)).rejects.toThrow(new Error('Error al intentar actualizar'));
      });
    });
  });
});
