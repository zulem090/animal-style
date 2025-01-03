import { getUserSession } from '@/helpers/auth/getUserSession';
import { BookingTemplateEditor } from '@/views/bookings/BookingTemplateEditor';
import { redirect } from 'next/navigation';

export default async function newBookingPage() {
  const user = await getUserSession();

  if (!user?.id) {
    redirect('/');
  }

  return <BookingTemplateEditor user={user} />;
}
