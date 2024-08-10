import { getUserSession } from '@/helpers/auth/getUserSession';
import { ProductTemplateEditor } from '@/views/products';
import { redirect } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params: { id } }: Props) {
  const user = await getUserSession();

  if (user?.role !== 'ADMIN') {
    redirect('/');
  }

  return <ProductTemplateEditor productId={Number(id)} />;
}
