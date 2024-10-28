import { User } from '@prisma/client';
import { UserController } from './userController';

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

const modelMock = {
  updatePersonalInfo: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@/models/userModel', () => ({
  updatePersonalInfo: (...args: unknown[]) => modelMock.updatePersonalInfo(...args),
}));

describe('UserController', () => {
  const controller = new UserController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe actualizar una reserva', async () => {
    const response = await controller.changePersonalInfo({
      direccion: userMock.direccion,
      telefono: userMock.telefono,
    });

    expect(modelMock.updatePersonalInfo).toHaveBeenCalled();
    expect(modelMock.updatePersonalInfo).toHaveBeenCalledWith({
      direccion: userMock.direccion,
      telefono: userMock.telefono,
    });
    expect(response).toEqual(undefined);
  });
});
