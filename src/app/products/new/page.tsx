import { getUserSession } from '@/helpers/auth/getUserSession';
import { ProductTemplateEditor } from '@/views/products';
import { redirect } from 'next/navigation';

export default async function newProductPage() {
  const user = await getUserSession();

  if (user?.role !== 'ADMIN') {
    redirect('/');
  }

  return <ProductTemplateEditor />;
}
