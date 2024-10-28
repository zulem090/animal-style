import { Cita } from '@prisma/client';
import { toBookingDto } from './toBookingDto';
import { User } from 'next-auth';
import { BookingDto } from '@/dto/booking/bookingDto';

describe('toBookingDto', () => {
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

  const bookingDtoMock: BookingDto = {
    idCita: 1,
    tipoCita: 'Spa',
    tipoMascota: 'Felino',
    nombreMascota: 'Copito',
    estado: 'ACTIVO',
    idUsuario: userMock.id,
    idPaciente: 1,
    fechaHoraCita: new Date(new Date().setDate(new Date().getDate() + 10)),
    observaciones: '',
  };

  it('debería mapear correctamente un objeto Cita/Booking a BookingDto', () => {
    const result: BookingDto = toBookingDto(bookingMock);

    expect(result).toEqual(bookingDtoMock);
  });

  it('debería manejar correctamente campos opcionales como undefined', () => {
    const mockBooking3: Cita = {
      ...bookingMock,
      idUsuario: undefined!,
      idPaciente: undefined!,
    };

    const result: BookingDto = toBookingDto(mockBooking3);

    expect(result).toEqual({
      idCita: mockBooking3.idCita,
      tipoCita: mockBooking3.tipoCita,
      tipoMascota: mockBooking3.tipoMascota,
      nombreMascota: mockBooking3.nombreMascota,
      estado: mockBooking3.estado,
      idUsuario: null,
      idPaciente: undefined,
      fechaHoraCita: mockBooking3.fechaHoraCita,
      observaciones: mockBooking3.observaciones,
    });
  });
});
