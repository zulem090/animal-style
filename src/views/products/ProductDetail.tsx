'use client';

import { User as UserSession } from 'next-auth';
import { Spinner } from '@/components/loaders';
import { ProductRating } from '@/components/products';

import { useGetProductById } from '@/hooks/useGetProductById';
import Image from 'next/image';
import { titleFormat } from '@/helpers/shared/titleFormat';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/hooks/store';
import { ProductStore } from '@/store';
import { useEffect } from 'react';

interface Props {
  productId: number;
  user?: UserSession;
}

export const ProductDetail = ({ productId, user }: Props) => {
  const { product, isLoading, error } = useGetProductById(productId);
  const { setLoadingSearch } = useProductStore((state: ProductStore) => state);

  useEffect(() => {
    if (!isLoading) {
      setLoadingSearch(false);
    }
  }, [isLoading, setLoadingSearch]);

  const router = useRouter();
  const isActivo: boolean = product?.estado === 'ACTIVO';

  if (!isLoading && !isActivo && user?.role !== 'ADMIN') {
    router.push('/products');

    return;
  }

  if (error) {
    return <div>Un error inesperado ha occurido</div>;
  }

  return (
    <div className="mx-auto w-fit">
      {isLoading ? (
        <Spinner data-testid="simbolo-carga-detalle-producto" dog className="mx-auto -mt-96 size-1/6 h-screen" />
      ) : (
        <div className="mx-auto flex flex-wrap justify-items-center rounded-lg bg-white shadow-md md:w-[100%] lg:w-[100%] xl:w-[100%] 2xl:w-[80%]">
          <div className="mx-auto lg:w-1/2">
            <Image
              className="rounded-t-lg p-8"
              width={800}
              height={800}
              src={product?.imagen || '/images/no-image-found.jpg'}
              alt="product image"
            />
          </div>
          <div className="p-8 lg:w-1/2">
            <div className="divide-y divide-dashed divide-vino-700">
              <div className="mb-5 pb-5">
                <h3 className="text-5xl font-semibold tracking-tight text-gray-900">
                  {product?.nombre}
                  {user?.role === 'ADMIN' && (
                    <span className={`ml-2 text-sm ${isActivo ? 'text-blue-400' : 'text-red-400'}`}>
                      {titleFormat(product?.estado)}
                    </span>
                  )}
                </h3>
                <ProductRating productId={productId} showPromedio showTotalResenas />
              </div>
              <div className="mb-2 flex items-center justify-between gap-4 py-8">
                <div>
                  <span className="text-3xl font-bold text-gray-900">${product?.precio.toLocaleString()}</span>
                </div>
                <div className="w-1/2">
                  <form>
                    <div className="flex h-fit flex-wrap gap-2 lg:content-center lg:justify-center xl:content-between xl:justify-between">
                      <div className="self-end">
                        <label htmlFor="cantidad" className="mb-2 block text-gray-600">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          id="cantidad"
                          min={1}
                          max={product?.cantidad}
                          name="cantidad"
                          className="rounded-md border border-gray-300 px-2 py-2 focus:border-vino-500 focus:outline-none"
                          autoComplete="off"
                          defaultValue={1}
                        />
                        {/* <div className="text-vino-700">{errors.cantidad && touched.cantidad && errors.cantidad}</div> */}
                      </div>
                      <div className="place-self-center self-end sm:mt-10">
                        <button
                          type="button"
                          className="h-fit rounded-lg bg-vino-500 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-vino-600 focus:ring-4 focus:ring-blue-300"
                        >
                          Añadir al Carrito
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="pt-8">
                <div className="my-10 flex justify-evenly">
                  <p>
                    <span className="font-bold text-vino-600">Tipo:</span> {product?.tipo}
                  </p>
                  <p>
                    <span className="font-bold text-vino-600">Marca:</span> {product?.marca}
                  </p>
                </div>
                <p className="font-bold text-vino-600">Descripción:</p>
                <p>{product?.descripcion}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
