'use client';

import { BookingController } from '@/controllers/bookingController';
import { BookingDto } from '@/dto/booking/bookingDto';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaRegEdit } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';
import { User as UserSession } from 'next-auth';
import { useMemo, useState } from 'react';
import { Spinner } from '../loaders';
import { titleFormat } from '@/helpers/shared/titleFormat';

interface Props {
  user?: UserSession;
  booking: BookingDto;
}

export const BookingCard = ({ booking, user }: Props) => {
  const router = useRouter();
  const bookingController = useMemo(() => new BookingController(), []);

  const [loadEdit, setLoadEdit] = useState<boolean>(false);
  const [loadDelete, setLoadDelete] = useState<boolean>(false);

  const isActivo: boolean = booking.estado === 'ACTIVO';

  const fechaFormateada: string = booking.fechaHoraCita.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleEdit = () => {
    setLoadEdit(true);
    router.push(`/bookings/${booking.idCita}/edit`);
  };

  const handleDeleteBooking = async () => {
    setLoadDelete(true);

    toast.loading(`Eliminando reserva de ${booking.nombreMascota}...`, { id: 'loadingDelete' });
    try {
      await bookingController.deleteById(booking.idCita);
      toast.remove('loadingDelete');
      toast.success(`Reserva de ${booking.nombreMascota} ha sido eliminado!`, { duration: 4000 });
    } catch (error) {
      console.error(error);
      toast.remove('loadingDelete');
      toast.error(`Error inesperado al eliminar reserva de ${booking.nombreMascota}, inténtelo nuevamente`, {
        duration: 4000,
      });
    }
  };

  return (
    <div className="flex max-w-sm flex-wrap justify-between rounded-lg border p-4 shadow-md">
      <div className="flex flex-wrap content-start">
        <div className="h-fit w-full">
          <Image
            src={`/images/reservas/${booking.tipoCita}.svg`}
            alt={booking.tipoCita}
            className="h-48 w-full rounded-md object-cover"
            height={100}
            width={100}
          />
        </div>
        <div className="flex w-full flex-wrap justify-between px-1 py-4">
          <div>
            <div className="mb-2 text-xl font-bold text-vino-500">
              <p>
                {booking.tipoCita}
                {user?.role === 'ADMIN' && (
                  <span className={`ml-2 text-xs ${isActivo ? 'text-blue-400' : 'text-red-400'}`}>
                    {titleFormat(booking.estado)}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex min-h-20 w-full flex-wrap">
            <div className="w-full self-end">
              <p className="text-base text-slate-600">
                <span className="font-bold">Mascota:</span> {titleFormat(booking.nombreMascota)}
              </p>
              <p className="mb-6 text-base text-slate-600">
                <span className="font-bold">Tipo de Mascota:</span> {booking.tipoMascota}
              </p>
              <p className="mb-6 text-base text-slate-600">
                <span className="font-bold">Tipo de Reserva:</span> {booking.tipoCita}
              </p>
              <p className="text-base text-slate-600">
                <span className="font-bold">Fecha: </span>
                {fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}
              </p>
              <p className="mb-6 text-base text-slate-600">
                <span className="font-bold">Hora: </span>
                {booking.fechaHoraCita.toLocaleTimeString().replace(/:\d{2}(?=\s?[ap]\.?\s?m\.?)/i, '')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between self-end px-1 py-4">
        <div className="self-center">
          <Link href={`/bookings/${booking.idCita}`} className="text-vino-500 hover:text-vino-700 hover:underline">
            Leer más
          </Link>
        </div>
        {user && user.role === 'ADMIN' && (
          <div>
            <button
              data-testid="boton-editar"
              className="mr-2 rounded-lg bg-vino-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-vino-600 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleEdit}
              disabled={loadEdit}
            >
              {loadEdit ? <Spinner className="text-white" /> : <FaRegEdit size={20} />}
            </button>
            <button
              data-testid="boton-eliminar"
              className="rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-blue-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              onClick={handleDeleteBooking}
              disabled={loadDelete}
            >
              {loadDelete ? <Spinner className="text-white" /> : <IoTrashOutline size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
