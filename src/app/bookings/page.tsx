export const revalidate = false;

import { Suspense, lazy } from 'react';

import { getUserSession } from '@/helpers/auth/getUserSession';
import { ProductsListLoader } from '@/components/loaders';
import { BookingController } from '@/controllers/bookingController';
import { redirect } from 'next/navigation';
import { BookingDto } from '@/dto/booking/bookingDto';

interface Props {
  searchParams: { nombre?: string };
}

const ProductsList = lazy(() =>
  import('../../views/bookings/BookingsList').then((mod) => ({ default: mod.BookingsList })),
);

export default async function ProductsPage({ searchParams }: Props) {
  const user = await getUserSession();

  if (!user?.id) {
    redirect('/');
  }
  const bookingController = new BookingController();
  const bookings: BookingDto[] = await bookingController.getAll(0, 100, searchParams?.nombre);

  return (
    <>
      <Suspense fallback={<ProductsListLoader />}>
        <ProductsList user={user} bookings={bookings} />
      </Suspense>
    </>
  );
}
