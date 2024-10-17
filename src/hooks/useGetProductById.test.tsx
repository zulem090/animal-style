import { renderHook, waitFor } from '@testing-library/react';
import { useGetProductById } from './useGetProductById';
import { ProductoDto } from '@/dto/producto/productoDto';

const controllerMock = {
  getById: jest.fn(),
};

jest.mock('@/controllers/productController', () => ({
  ProductController: jest.fn().mockImplementation(() => controllerMock),
}));

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

describe('useGetProductById', () => {
  describe('cuando es exitoso', () => {
    it('debe de ejecutar exitosamente el hook', async () => {
      controllerMock.getById.mockResolvedValue(productMock1);

      const { result } = renderHook(() => useGetProductById(1));

      expect(result.current.isLoading).toEqual(true);

      await waitFor(() => {
        expect(controllerMock.getById).toHaveBeenCalledWith(1);
        expect(result.current.product).toEqual(productMock1);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(null);
      });
    });
  });

  describe('cuando es fallido', () => {
    it('debe de manejar correctamente un error', async () => {
      const error = 'Error inesperado en el sistema;';
      controllerMock.getById.mockRejectedValue(error);

      const { result } = renderHook(() => useGetProductById(1));

      expect(result.current.isLoading).toEqual(true);

      await waitFor(() => {
        expect(controllerMock.getById).toHaveBeenCalledWith(1);
        expect(result.current.product).toEqual(undefined);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(error);
      });
    });
  });
});
