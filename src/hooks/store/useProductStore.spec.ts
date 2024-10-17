import { useStore } from 'zustand';
import React from 'react';
import { useProductStore } from './useProductStore';
import { renderHook } from '@testing-library/react';
import { ProductoDto } from '@/dto/producto/productoDto';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

jest.mock('zustand');

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

describe('useProductStore', () => {
  const mockUseContext = jest.fn();
  const mockUseStore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (React.useContext as jest.Mock).mockImplementation(mockUseContext);

    (useStore as jest.Mock).mockImplementation(mockUseStore);
  });

  it('debería lanzar un error si el contexto es nulo', () => {
    mockUseContext.mockReturnValue(null);

    expect(() => renderHook(() => useProductStore((store) => store))).toThrow(
      new Error('useProductStore must be use within ProductStoreProvider'),
    );
  });

  it('debería devolver el estado del store correctamente usando el selector', () => {
    const mockState = { productsPreview: [productMock1] };

    // Mockeamos el contexto para devolver un store
    mockUseContext.mockReturnValue(mockState);

    // Simulamos que useStore retorna el estado esperado
    mockUseStore.mockImplementation((store, selector) => selector(mockState));

    const { result } = renderHook(() => useProductStore((store) => store.productsPreview));

    expect(result.current).toEqual([productMock1]);
  });
});
