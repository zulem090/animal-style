import { Cita } from '@prisma/client';

export interface UpdateBookingDto extends Partial<Omit<Cita, 'idCita' | 'fechaHoraCita' | 'idPaciente'>> {
  idCita: number;
  fechaHoraCita: Date;
  idPaciente?: number;
}
