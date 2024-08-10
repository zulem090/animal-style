'use client';

import { CiSearch } from 'react-icons/ci';
import { Spinner } from '../loaders';
import React, { FocusEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { Formik, FormikHelpers } from 'formik';
import { useRouter, useSearchParams } from 'next/navigation';

import { ProductController } from '@/controllers/productController';
import { ProductoDto } from '@/dto/producto/productoDto';
import Image from 'next/image';
import { useProductStore } from '@/hooks/store';
import { ProductStore } from '@/store';

interface SearchForm {
  search?: string;
}

export const SearchProduct = () => {
  const productController = useMemo(() => new ProductController(), []);

  const router = useRouter();
  const params = useSearchParams();
  const {
    productsPreview: products,
    setProductPreview: setProducts,
    loadingSearch: loading,
    setLoadingSearch: setLoading,
  } = useProductStore((state: ProductStore) => state);

  const [showPreviewer, setShowPreviewer] = useState<boolean>(false);
  const search: string = params.get('nombre') || '';

  const initialValues: SearchForm = {
    search,
  };

  const handleSearch = (params: SearchForm) => {
    setLoading(true);
    setShowPreviewer(false);

    if (!params.search) {
      router.push('/products');
    } else {
      router.push(`/products?nombre=${params.search}`);
    }
    setLoading(false);
  };

  const handleKeyDownSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showPreviewer) {
      if ((!e.shiftKey && e.code === 'Tab') || e.code === 'ArrowDown') {
        e.preventDefault();
        (document.querySelector('#products-previewer')?.firstChild?.firstChild as HTMLButtonElement)?.focus();
      } else if ((e.shiftKey && e.code === 'Tab') || e.code === 'ArrowUp') {
        e.preventDefault();
        (document.querySelector('#products-previewer')?.lastChild?.firstChild as HTMLButtonElement)?.focus();
      }
    }
  };

  const handleKeyUpSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const omitKeys = [
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'Enter',
      'Meta',
      'MetaLeft',
      'MetaRight',
      'Shift',
      'ShiftLeft',
      'Tab',
    ];
    if (omitKeys.includes(e.code)) return;

    const search: string = e.currentTarget.value;

    if (search.length >= 2) {
      setLoading(true);
      const productsFound: ProductoDto[] = await productController.getAll(0, 5, search);
      setProducts(productsFound);
      if (products) {
        setShowPreviewer(true);
      }
    } else if (search.length === 0) {
      setProducts([]);
    }

    setLoading(false);
  };

  const handleBlurSearch = (e: FocusEvent<HTMLInputElement | HTMLButtonElement>) => {
    const clickedElement: string | undefined = e.relatedTarget?.id;

    if (!clickedElement?.includes('product-preview-')) {
      setShowPreviewer(false);
    }
  };

  const handleFocusSearch = () => {
    setShowPreviewer(true);
  };

  const handleProductPreviewClick = (productId: string, helpers: Pick<FormikHelpers<SearchForm>, 'setFieldValue'>) => {
    setLoading(true);

    helpers.setFieldValue('search', '');
    setShowPreviewer(false);
    setProducts([]);

    router.push(`/products/${productId}`);
  };

  const handleProductPreviewKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    let el: HTMLButtonElement | HTMLInputElement;

    if (e.code === 'ArrowDown') {
      e.preventDefault();

      if (e.currentTarget?.parentElement?.nextSibling) {
        el = e.currentTarget?.parentElement?.nextSibling.firstChild as HTMLButtonElement;
      } else {
        el = document.querySelector('#products-search') as HTMLInputElement;
      }

      el.focus();
    }
    if (e.code === 'ArrowUp') {
      e.preventDefault();

      if (e.currentTarget?.parentElement?.previousSibling) {
        el = e.currentTarget?.parentElement?.previousSibling?.firstChild as HTMLButtonElement;
      } else {
        el = document.querySelector('#products-search') as HTMLInputElement;
      }

      el.focus();
    }
  };

  return (
    <>
      <div hidden className="md:block mr-2">
        <Formik initialValues={initialValues} onSubmit={handleSearch}>
          {({ values, handleSubmit, setFieldValue, handleChange }) => (
            <form onSubmit={handleSubmit}>
              <div className="relative flex items-center !text-gray-400 focus-within:!text-vino-500">
                <span className="absolute left-4 h-6 flex items-center pr-3 border-r border-gray-300">
                  {loading ? <Spinner className="!opacity-50" /> : <CiSearch />}
                </span>
                <input
                  type="search"
                  name="search"
                  id="products-search"
                  placeholder="Buscar producto"
                  className="w-full pl-14 pr-4 py-2.5 rounded-xl text-sm text-gray-600 outline-none border border-gray-300 focus:border-vino-500 transition"
                  value={values.search}
                  onChange={handleChange}
                  // defaultValue={values.search}
                  onKeyUp={handleKeyUpSearch}
                  onKeyDown={handleKeyDownSearch}
                  onBlur={handleBlurSearch}
                  onFocus={handleFocusSearch}
                />
              </div>
              <div hidden className={`bg-white mt-3 fixed ${showPreviewer && ' block'}`}>
                <ul
                  id="products-previewer"
                  className={`flex flex-col justify-stretch w-fit py-2 text-sm text-gray-700 shadow-md rounded divide-y divide-double`}
                >
                  {products.map((product: ProductoDto, index: number) => (
                    <li
                      key={index}
                      tabIndex={index}
                      // className="border active:border-vino-500 focus-within:border-vino-500 focus-visible:border-vino-500"
                    >
                      <button
                        id={`product-preview-${product.idProducto}`}
                        type="button"
                        className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-slate-100 focus:bg-slate-100"
                        role="menuitem"
                        onClick={(e: MouseEvent<HTMLButtonElement>) =>
                          handleProductPreviewClick(e.currentTarget.value, { setFieldValue })
                        }
                        onKeyDown={handleProductPreviewKeyDown}
                        onBlur={handleBlurSearch}
                        value={product.idProducto}
                      >
                        <div className="w-full flex justify-start content-between items-center">
                          <Image
                            className="w-[40px] h-[40px] rounded-full"
                            width={0}
                            height={0}
                            src={product?.imagen || '/images/no-image-found.jpg'}
                            alt="product image"
                          />
                          <div className="w-full flex justify-between ml-2 gap-4">
                            <div className="flex flex-col justify-start">
                              <div className="flex">
                                <div className="self-center">{product.nombre}</div>
                              </div>
                              <div className="self-start">${product.precio.toLocaleString()}</div>
                            </div>
                            <div className="text-left content-center">
                              <div className="text-xs font-extralight">{product.tipo}</div>
                              <div className="text-xs font-extralight">{product.marca}</div>
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};
