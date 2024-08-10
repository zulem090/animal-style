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
    <div className="w-fit mx-auto">
      {isLoading ? (
        <Spinner dog className="h-screen mx-auto size-1/6 -mt-96" />
      ) : (
        <div className="mx-auto md:w-[100%] lg:w-[100%] xl:w-[100%] 2xl:w-[80%] flex flex-wrap justify-items-center bg-white shadow-md rounded-lg">
          <div className="mx-auto lg:w-1/2">
            <Image
              className="rounded-t-lg p-8"
              width={800}
              height={800}
              src={product?.imagen || '/images/no-image-found.jpg'}
              alt="product image"
            />
          </div>
          <div className="lg:w-1/2 p-8">
            <div className="divide-y divide-dashed divide-vino-700">
              <div className="pb-5 mb-5">
                <h3 className="text-gray-900 font-semibold text-5xl tracking-tight">
                  {product?.nombre}
                  {user?.role === 'ADMIN' && (
                    <span className={`ml-2 text-sm ${isActivo ? 'text-blue-400' : 'text-red-400'}`}>
                      {titleFormat(product?.estado)}
                    </span>
                  )}
                </h3>
                <ProductRating productId={productId} showPromedio showTotalResenas />
              </div>
              <div className="flex items-center justify-between py-8 mb-2 gap-4">
                <div>
                  <span className="text-3xl font-bold text-gray-900">${product?.precio.toLocaleString()}</span>
                </div>
                <div className="w-1/2">
                  <form>
                    <div className="h-fit flex flex-wrap lg:justify-center lg:content-center xl:justify-between xl:content-between gap-2">
                      <div className="self-end">
                        <label htmlFor="cantidad" className="block text-gray-600 mb-2">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          id="cantidad"
                          min={1}
                          max={product?.cantidad}
                          name="cantidad"
                          className="border border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:border-vino-500"
                          autoComplete="off"
                          defaultValue={1}
                        />
                        {/* <div className="text-vino-700">{errors.cantidad && touched.cantidad && errors.cantidad}</div> */}
                      </div>
                      <div className="self-end place-self-center sm:mt-10">
                        <button
                          type="button"
                          className="h-fit text-white bg-vino-500 hover:bg-vino-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                        >
                          Añadir al Carrito
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="pt-8">
                <div className="flex justify-evenly my-10">
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
