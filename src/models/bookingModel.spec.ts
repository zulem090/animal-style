import { prismaMock } from '@/test/mocks/prismaMock';
import { createBooking, updateBooking, deleteBookingById, getAllBookings, getBookingById } from './bookingModel';
import { Cita } from '@prisma/client';
import { getServerSession, User as UserSession } from 'next-auth';
import { CreateBookingDto } from '@/dto/booking/createBookingDto';
import { omit } from 'lodash';
import { UpdateBookingDto } from '@/dto/booking/editBookingDto';

jest.mock('next/navigation');
jest.mock('next/cache');
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
  User: {},
}));
jest.mock('yup', () => ({
  ...jest.requireActual('yup'),
  object: jest.fn().mockReturnValue({
    validate: () => mockYup(),
  }),
}));

const mockYup = jest.fn();

describe('Booking Model', () => {
  const mockSession = getServerSession as jest.Mock;

  const userMock: UserSession = {
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
  } as unknown as UserSession;

  const bookingMock: Cita = {
    idCita: 1,
    tipoCita: 'Spa',
    tipoMascota: 'Felino',
    nombreMascota: 'Copito',
    estado: 'ACTIVO',
    idUsuario: userMock.id,
    idPaciente: 1,
    fechaHoraCita: new Date(new Date().setDate(new Date().getDate() + 10)),
    observaciones: '',
  } as unknown as Cita;
  const bookingMock2: Cita = {
    idCita: 2,
    tipoCita: 'Adiestramiento',
    tipoMascota: 'Canino',
    nombreMascota: 'Rex',
    estado: 'ACTIVO',
    idUsuario: userMock.id,
    idPaciente: 1,
    fechaHoraCita: new Date(new Date().setDate(new Date().getDate() + 5)),
    observaciones: '',
  } as unknown as Cita;
  const bookingsMock: Cita[] = [bookingMock, bookingMock2];

  describe('getAllBookings', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockSession.mockResolvedValueOnce({ user: { id: '1', role: 'USER' } });
      prismaMock.cita.findMany.mockResolvedValueOnce(bookingsMock);
    });

    describe('cuando es exitoso', () => {
      it('debería retornar un array de reservas', async () => {
        const result = await getAllBookings(0, 10);

        expect(prismaMock.cita.findMany).toHaveBeenCalledWith({
          skip: 0,
          take: 10,
          where: {
            idUsuario: '1',
          },
          include: { usuario: true },
        });
        expect(result).toEqual(bookingsMock);
      });

      it('debería retornar un array de reservas por el nombre de la mascota o el tipo de la cita', async () => {
        const nombre = 'reserva';
        const result = await getAllBookings(0, 10, nombre);

        expect(prismaMock.cita.findMany).toHaveBeenCalledWith({
          skip: 0,
          take: 10,
          where: {
            idUsuario: '1',
            OR: [
              {
                nombreMascota: { contains: nombre },
              },
              {
                tipoCita: { contains: nombre },
              },
            ],
          },
          include: { usuario: true },
        });
        expect(result).toEqual(bookingsMock);
      });

      it('debería retornar un array de reservas como ADMIN (sin filtrar estado)', async () => {
        mockSession
          .mockReset()
          .mockClear()
          .mockResolvedValueOnce({ user: { role: 'ADMIN' } });

        const result = await getAllBookings(0, 10);

        expect(prismaMock.cita.findMany).toHaveBeenCalledWith({
          skip: 0,
          take: 10,
          where: {
            estado: undefined,
          },
          include: { usuario: true },
        });
        expect(result).toEqual(bookingsMock);
      });
    });

    describe('cuando es fallido', () => {
      it('debería lanzar un error si el offset no es proveido', () => {
        expect(() => getAllBookings(undefined!, 10)).rejects.toThrow(new Error('offset must be a number'));
      });
      it('debería lanzar un error si el limit no es proveido', () => {
        expect(() => getAllBookings(0, undefined!)).rejects.toThrow(new Error('limit must be a number'));
      });
    });
  });

  describe('getBookingById', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.cita.findUnique.mockResolvedValueOnce(bookingMock2);
      });

      it('debería retornar un array de reservas', async () => {
        const result = await getBookingById(1);

        expect(prismaMock.cita.findUnique).toHaveBeenCalledWith({
          where: {
            idCita: 1,
          },
          include: { usuario: true },
        });
        expect(result).toEqual(bookingsMock[1]);
      });
    });

    describe('cuando es fallido', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.cita.findUnique.mockResolvedValueOnce(null);
      });

      it('debería lanzar un error si el offset no es proveido', () => {
        expect(() => getBookingById(3)).rejects.toThrow(new Error('No booking with id 3 found'));
      });
    });
  });

  describe('createBooking', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockYup.mockReturnValueOnce(bookingMock2);
        prismaMock.cita.findFirst.mockResolvedValueOnce(null);
        prismaMock.cita.create.mockResolvedValueOnce(bookingMock2);
      });

      it('debería crear un reserva', async () => {
        const result = await createBooking(bookingMock2 as unknown as CreateBookingDto);
        expect(prismaMock.cita.create).toHaveBeenCalledWith({
          data: {
            ...omit(bookingMock2, ['idCita', 'idUsuario', 'idPaciente']),
            usuario: { connect: { id: bookingMock2.idUsuario } },
            paciente: { connect: { idPaciente: bookingMock2.idPaciente } },
          },
        });
        expect(result).toEqual(undefined);
      });

      it('debería guardar sin atributos foraneos tipo y marca', async () => {
        mockYup
          .mockReset()
          .mockClear()
          .mockReturnValueOnce(omit(bookingMock2, ['idUsuario', 'idPaciente']));

        const result = await createBooking(bookingMock2 as unknown as CreateBookingDto);
        expect(prismaMock.cita.create).toHaveBeenCalledWith({
          data: {
            ...omit(bookingMock2, ['idCita', 'idUsuario', 'idPaciente']),
            usuario: undefined,
            paciente: undefined,
          },
        });
        expect(result).toEqual(undefined);
      });
    });

    describe('cuando es fallido', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockYup.mockReturnValueOnce(bookingMock2);
      });

      it('debería lanzar un error general si intentar guardar un reserva', () => {
        prismaMock.cita.create.mockRejectedValueOnce({ message: 'Error al intentar guardar' });
        expect(() => createBooking(bookingMock2 as unknown as CreateBookingDto)).rejects.toThrow(
          new Error('Error al intentar guardar'),
        );
      });
    });
  });

  describe('updateBooking', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockYup.mockReturnValueOnce(bookingMock2);
        prismaMock.cita.update.mockResolvedValueOnce(bookingMock2);
      });

      it('debería actualizar un reserva', async () => {
        const result = await updateBooking(bookingMock2 as unknown as UpdateBookingDto);
        expect(prismaMock.cita.update).toHaveBeenCalledWith({
          data: {
            ...omit(bookingMock2, ['idCita', 'idUsuario', 'idPaciente']),
            usuario: { connect: { id: bookingMock2.idUsuario } },
            paciente: { connect: { idPaciente: bookingMock2.idPaciente } },
          },
          where: {
            idCita: bookingMock2.idCita,
          },
        });
        expect(result).toEqual(undefined);
      });

      it('debería guardar sin atributos foraneos usuario y paciente', async () => {
        mockYup
          .mockReset()
          .mockClear()
          .mockReturnValueOnce(omit(bookingMock2, ['idUsuario', 'idPaciente']));

        const result = await updateBooking(bookingMock2 as unknown as UpdateBookingDto);
        expect(prismaMock.cita.update).toHaveBeenCalledWith({
          data: {
            ...omit(bookingMock2, ['idCita', 'idUsuario', 'idPaciente']),
            usuario: undefined,
            paciente: undefined,
          },
          where: {
            idCita: bookingMock2.idCita,
          },
        });
        expect(result).toEqual(undefined);
      });
    });

    describe('cuando es fallido', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockYup.mockReturnValueOnce(bookingMock2);
        prismaMock.cita.update.mockRejectedValueOnce({ message: 'Error al intentar actualizar' });
      });

      it('debería lanzar un error al intentar actualizar', () => {
        expect(() => updateBooking(bookingMock2 as unknown as UpdateBookingDto)).rejects.toThrow(
          new Error('Error al intentar actualizar'),
        );
      });
    });
  });

  describe('deleteBookingById', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.cita.findUnique.mockResolvedValueOnce(bookingMock2);
        prismaMock.cita.delete.mockResolvedValueOnce(bookingMock2);
      });

      it('debería eliminar un reserva por su id', async () => {
        const result = await deleteBookingById(1);

        expect(prismaMock.cita.findUnique).toHaveBeenCalledWith({
          where: {
            idCita: 1,
          },
          include: { usuario: true },
        });

        expect(prismaMock.cita.delete).toHaveBeenCalledWith({
          where: {
            idCita: 1,
          },
        });
        expect(result).toEqual(undefined);
      });
    });

    describe('cuando es fallido', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.cita.findUnique.mockResolvedValueOnce(null);
      });

      it('debería lanzar un error al intentar eliminar un reserva', () => {
        expect(() => deleteBookingById(3)).rejects.toThrow(new Error('No booking with id 3 found'));
      });
    });
  });
});
