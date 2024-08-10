import { ProductoDto } from '@/dto/producto/productoDto';
import { create } from 'zustand';

type State = {
  products: ProductoDto[];
};

type Actions = {
  setProducts: (products: ProductoDto[]) => void;
};

export const useStore = create<State & Actions>()((set) => ({
  products: [],
  setProducts: (products: ProductoDto[]) => set((state) => ({ products: [...products] })),
}));
