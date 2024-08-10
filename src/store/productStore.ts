import { ProductoDto } from '@/dto/producto/productoDto';
import { createStore } from 'zustand/vanilla';

export type ProductState = {
  productsPreview: ProductoDto[];
  loadingSearch: boolean;
};

export type ProductActions = {
  setProductPreview: (products: ProductoDto[]) => void;
  setLoadingSearch: (loadingSearch: boolean) => void;
};

export type ProductStore = ProductState & ProductActions;

export const initProductStore = (): ProductState => {
  return { productsPreview: [], loadingSearch: false };
};

export const defaultInitState: ProductState = {
  productsPreview: [],
  loadingSearch: false,
};

export const createProductStore = (initState: ProductState = defaultInitState) => {
  return createStore<ProductStore>()((set) => ({
    ...initState,
    setProductPreview: (productsPreview: ProductoDto[]) => set(() => ({ productsPreview: [...productsPreview] })),
    setLoadingSearch: (loadingSearch: boolean) => set(() => ({ loadingSearch })),
  }));
};
