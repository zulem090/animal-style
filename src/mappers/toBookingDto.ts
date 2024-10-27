import { BookingDto } from '@/dto/booking/bookingDto';
import { Cita } from '@prisma/client';

export const toBookingDto = (booking: Cita): BookingDto => ({
  idCita: Number(booking.idCita),
  tipoCita: booking.tipoCita,
  nombreMascota: booking?.nombreMascota,
  tipoMascota: booking?.tipoMascota,
  fechaHoraCita: new Date(booking.fechaHoraCita),
  estado: booking.estado,
  observaciones: booking.observaciones,
  idUsuario: booking.idUsuario ? booking.idUsuario : null,
  idPaciente: booking.idPaciente ? Number(booking.idPaciente) : undefined,
});
