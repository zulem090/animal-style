import { ProductoDto } from '@/dto/producto/productoDto';
import { useStore } from './useStore';

jest.mock('zustand', () => {
  const actualZustand = jest.requireActual('zustand');
  return {
    ...actualZustand,
    create: (state: any) => actualZustand.create(state),
  };
});

const productMock1: ProductoDto = {
  idProducto: 1,
  nombre: 'Producto 1',
  descripcion: 'Producto 1',
  cantidad: 1,
  precio: 100,
  idMarca: 1,
  idTipo: 1,
  estado: 'ACTIVO',
} as ProductoDto;

const productsMock: ProductoDto[] = [productMock1];

describe('useStore', () => {
  describe('useStore Zustand Store', () => {
    it('debería inicializarse con un array vacío de products', () => {
      const state = useStore.getState();
      expect(state.products).toEqual([]);
    });

    it('debería actualizar el estado de products cuando se llama setProducts', () => {
      const { setProducts } = useStore.getState();

      setProducts(productsMock);

      const state = useStore.getState();
      expect(state.products).toEqual(productsMock);
    });
  });
});
