import { User as UserSession } from 'next-auth';
import { getUserSession } from '@/helpers/auth/getUserSession';

import { ProductDetail } from '@/views/products';

interface Props {
  params: { id: string };
}

export default async function ProductPage({ params: { id } }: Props) {
  const session: UserSession | undefined = await getUserSession();

  return <ProductDetail productId={Number(id)} user={session} />;
}
