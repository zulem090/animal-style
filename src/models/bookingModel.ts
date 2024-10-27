'use server';

import { CreateBookingDto } from '@/dto/booking/createBookingDto';
import { UpdateBookingDto } from '@/dto/booking/editBookingDto';
import { BookingDto } from '@/dto/booking/bookingDto';
import { getUserSession } from '@/helpers/auth/getUserSession';
import { toBookingDto } from '@/mappers/toBookingDto';
import { User as UserSession } from 'next-auth';
import prisma from '@/orm/prisma';
import { Prisma, Cita } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as yup from 'yup';

const bookingCreateSchema: yup.Schema = yup.object({
  tipoCita: yup.string().required(),
  nombreMascota: yup.string().required(),
  tipoMascota: yup.string().required(),
  observaciones: yup.string().optional(),
  estado: yup.string().optional(),
  fechaHoraCita: yup.date().required(),
  idUsuario: yup.string().required(),
  idPaciente: yup.number().optional(),
});

const bookingUpdateSchema: yup.Schema = yup.object({
  idCita: yup.number().required(),
  tipoCita: yup.string().required(),
  nombreMascota: yup.string().required(),
  tipoMascota: yup.string().required(),
  observaciones: yup.string().optional(),
  estado: yup.string().optional(),
  fechaHoraCita: yup.date().required(),
  idUsuario: yup.string().required(),
  idPaciente: yup.number().optional(),
});

const getBooking = async (bookingId: number): Promise<Cita> => {
  const bookingo: Cita | null = await prisma.cita.findUnique({
    where: { idCita: bookingId },
    include: { usuario: true },
  });

  if (!bookingo) throw new Error(`No booking with id ${bookingId} found`);

  return bookingo;
};

export async function getBookingById(bookingId: number): Promise<BookingDto> {
  const bookingo: Cita = await getBooking(bookingId);

  return await toBookingDto(bookingo);
}

export async function getAllBookings(offset: number, limit: number, nombre?: string): Promise<BookingDto[]> {
  if (isNaN(offset)) {
    throw new Error('offset must be a number');
  }

  if (isNaN(limit)) {
    throw new Error('limit must be a number');
  }
  const session: UserSession | undefined = await getUserSession();

  const searchTermQuery: Prisma.CitaWhereInput | undefined = !nombre
    ? undefined
    : {
        OR: [
          {
            nombreMascota: { contains: nombre },
          },
          {
            tipoCita: { contains: nombre },
          },
        ],
      };

  const searchQuery: Prisma.CitaWhereInput = {
    idUsuario: session?.id,
    ...searchTermQuery,
  };

  const bookings: Cita[] = await prisma.cita.findMany({
    skip: offset,
    take: limit,
    where: searchQuery,
    include: { usuario: true },
  });

  return bookings.map(toBookingDto);
}

export async function createBooking(bookingDto: CreateBookingDto): Promise<void> {
  try {
    const payload = await bookingCreateSchema.validate(bookingDto);

    const booking: Prisma.CitaCreateInput = {
      tipoCita: payload.tipoCita,
      nombreMascota: payload.nombreMascota,
      tipoMascota: payload.tipoMascota,
      observaciones: payload.observaciones,
      estado: payload.estado,
      fechaHoraCita: payload.fechaHoraCita,
      usuario: payload.idUsuario ? { connect: { id: payload.idUsuario } } : undefined,
      paciente: payload.idPaciente ? { connect: { idPaciente: payload.idPaciente } } : undefined,
    };

    await prisma.cita.create({ data: booking });
  } catch (error: any) {
    throw new Error(error.message);
  }

  redirect('/bookings');
}

export async function updateBooking(bookingDto: UpdateBookingDto): Promise<void> {
  try {
    const payload = await bookingUpdateSchema.validate(bookingDto);

    const booking: Prisma.CitaUpdateInput = {
      tipoCita: payload.tipoCita,
      nombreMascota: payload.nombreMascota,
      tipoMascota: payload.tipoMascota,
      observaciones: payload.observaciones,
      estado: payload.estado,
      fechaHoraCita: payload.fechaHoraCita,
      usuario: payload.idUsuario ? { connect: { id: payload.idUsuario } } : undefined,
      paciente: payload.idPaciente ? { connect: { idPaciente: payload.idPaciente } } : undefined,
    };

    await prisma.cita.update({ data: booking, where: { idCita: payload.idCita } });
  } catch (error: any) {
    throw new Error(error.message);
  }

  redirect('/bookings');
}

export async function deleteBookingById(bookingId: number): Promise<void> {
  await getBooking(bookingId);

  await prisma.cita.delete({ where: { idCita: bookingId } });

  revalidatePath('/bookings');
}
