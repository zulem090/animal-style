import { Cita } from '@prisma/client';

export interface CreateBookingDto extends Omit<Cita, 'idCita' | 'fechaHoraCita' | 'idPaciente'> {
  fechaHoraCita: Date;
  idPaciente?: number;
}
