export const revalidate = false;

import { Suspense, lazy } from 'react';

import { ProductController } from '@/controllers/productController';
import { getUserSession } from '@/helpers/auth/getUserSession';
import { ProductsListLoader } from '@/components/loaders';
import { ProductoDto } from '@/dto/producto/productoDto';

interface Props {
  searchParams: { nombre?: string };
}

const ProductsList = lazy(() =>
  import('../../views/products/ProductsList').then((mod) => ({ default: mod.ProductsList })),
);

export default async function ProductsPage({ searchParams }: Props) {
  const user = await getUserSession();
  const productControler = new ProductController();
  const products: ProductoDto[] = await productControler.getAll(0, 100, searchParams?.nombre);

  return (
    <>
      <Suspense fallback={<ProductsListLoader />}>
        <ProductsList user={user} products={products} />
      </Suspense>
    </>
  );
}
