import { Cita } from '@prisma/client';
import { User as UserSession } from 'next-auth';
import { BookingController } from './bookingController';
import { CreateBookingDto } from '@/dto/booking/createBookingDto';
import { UpdateBookingDto } from '@/dto/booking/editBookingDto';

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

const modelMock = {
  getBookingById: jest.fn().mockResolvedValue(bookingMock),
  getAllBookings: jest.fn().mockResolvedValue(bookingsMock),
  createBooking: jest.fn().mockResolvedValue(undefined),
  deleteBookingById: jest.fn().mockResolvedValue(undefined),
  updateBooking: jest.fn().mockResolvedValue(undefined),
  activeBooking: jest.fn().mockResolvedValue(undefined),
  inactiveBooking: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@/models/bookingModel', () => ({
  getAllBookings: (...args: unknown[]) => modelMock.getAllBookings(...args),
  createBooking: (...args: unknown[]) => modelMock.createBooking(...args),
  getBookingById: (...args: unknown[]) => modelMock.getBookingById(...args),
  deleteBookingById: (...args: unknown[]) => modelMock.deleteBookingById(...args),
  updateBooking: (...args: unknown[]) => modelMock.updateBooking(...args),
}));

describe('BookingController', () => {
  const controller = new BookingController();
  const idCita: number = Number(bookingMock.idCita);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe obtener una reserva por el id', async () => {
    const response = await controller.getById(idCita);

    expect(modelMock.getBookingById).toHaveBeenCalled();
    expect(modelMock.getBookingById).toHaveBeenCalledWith(idCita);
    expect(response).toEqual(bookingMock);
  });

  it('debe obtener todos los reservas', async () => {
    const response = await controller.getAll(0, 10);

    expect(modelMock.getAllBookings).toHaveBeenCalled();
    expect(modelMock.getAllBookings).toHaveBeenCalledWith(0, 10, undefined);
    expect(response).toEqual(bookingsMock);
  });

  it('debe crear una reserva', async () => {
    const createBookingDto: CreateBookingDto = {
      ...bookingMock,
      idCita: undefined,
    } as unknown as CreateBookingDto;

    const response = await controller.create(createBookingDto);

    expect(modelMock.createBooking).toHaveBeenCalled();
    expect(modelMock.createBooking).toHaveBeenCalledWith(createBookingDto);
    expect(response).toEqual(undefined);
  });

  it('debe actualizar una reserva', async () => {
    const updateBookingDto: UpdateBookingDto = { ...bookingMock } as unknown as UpdateBookingDto;

    const response = await controller.update(updateBookingDto);

    expect(modelMock.updateBooking).toHaveBeenCalled();
    expect(modelMock.updateBooking).toHaveBeenCalledWith(updateBookingDto);
    expect(response).toEqual(undefined);
  });

  it('debe obtener todos los reservas por parámetro de búsqueda', async () => {
    const response = await controller.getAll(0, 10, 'nombrereserva');

    expect(modelMock.getAllBookings).toHaveBeenCalled();
    expect(modelMock.getAllBookings).toHaveBeenCalledWith(0, 10, 'nombrereserva');
    expect(response).toEqual(bookingsMock);
  });

  it('debe eliminar una reserva por el id', async () => {
    const response = await controller.deleteById(idCita);

    expect(modelMock.deleteBookingById).toHaveBeenCalled();
    expect(modelMock.deleteBookingById).toHaveBeenCalledWith(idCita);
    expect(response).toEqual(undefined);
  });
});
