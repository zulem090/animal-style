'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';
import { type ProductStore } from '@/store';
import { ProductStoreContext } from '@/components/store/productStoreProvider';

export const useProductStore = <T>(selector: (store: ProductStore) => T): T => {
  const productStoreContext = useContext(ProductStoreContext);

  if (!productStoreContext) {
    throw new Error(`useProductStore must be use within ProductStoreProvider`);
  }

  return useStore(productStoreContext, selector);
};
