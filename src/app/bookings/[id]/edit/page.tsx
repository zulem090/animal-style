import { getUserSession } from '@/helpers/auth/getUserSession';
import { BookingTemplateEditor } from '@/views/bookings/BookingTemplateEditor';
import { redirect } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function EditBookingPage({ params: { id } }: Props) {
  const user = await getUserSession();

  if (!user?.id) {
    redirect('/');
  }

  return <BookingTemplateEditor bookingId={Number(id)} user={user} />;
}
