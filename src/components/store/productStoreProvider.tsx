'use client';

import { type ReactNode, createContext, useRef } from 'react';
import { type StoreApi } from 'zustand';

import { type ProductStore, createProductStore, initProductStore } from '@/store';

export const ProductStoreContext = createContext<StoreApi<ProductStore> | null>(null);

export interface ProductStoreProviderProps {
  children: ReactNode;
}

export const ProductStoreProvider = ({ children }: ProductStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ProductStore>>();
  if (!storeRef.current) {
    storeRef.current = createProductStore(initProductStore());
  }

  return <ProductStoreContext.Provider value={storeRef.current}>{children}</ProductStoreContext.Provider>;
};
