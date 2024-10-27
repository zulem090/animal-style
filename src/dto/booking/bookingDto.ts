import { Cita } from '@prisma/client';

export interface BookingDto extends Omit<Cita, 'idCita' | 'fechaHoraCita' | 'idPaciente'> {
  idCita: number;
  fechaHoraCita: Date;
  idPaciente?: number;
}
