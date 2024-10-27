import { BookingCard } from '@/components/bookings';
import { BookingDto } from '@/dto/booking/bookingDto';
import { User as UserSession } from 'next-auth';
import Link from 'next/link';

interface Props {
  user?: UserSession;
  bookings?: BookingDto[];
}

export const BookingsList = ({ user, bookings }: Props) => {
  return (
    <div className="mx-auto h-fit w-fit">
      <span className="text-4xl font-bold text-vino-500">Reservas</span>
      <div className="mb-4 flex justify-end">
        {user && user.role === 'ADMIN' && (
          <Link href="/bookings/new">
            <button className="w-50 rounded-md bg-vino-500 px-4 py-2 font-semibold text-white hover:bg-vino-600">
              Crear Reserva
            </button>
          </Link>
        )}
      </div>
      <div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {bookings?.length
            ? bookings!.map((booking) => <BookingCard key={booking.idCita} booking={booking} user={user} />)
            : 'No hay o no se encontró reservas'}
        </div>
      </div>
    </div>
  );
};
