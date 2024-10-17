import { renderHook, waitFor } from '@testing-library/react';
import { useSearchProducts } from './useSearchProducts';
import { ProductoDto } from '@/dto/producto/productoDto';

const controllerMock = {
  getAll: jest.fn(),
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

describe('useSearchProducts', () => {
  describe('cuando es exitoso', () => {
    it('debe de ejecutar exitosamente el hook cuando término de busqueda tiene 3 letras o más', async () => {
      controllerMock.getAll.mockResolvedValue([productMock1]);

      const { result } = renderHook(() => useSearchProducts('terminoABuscar'));

      expect(result.current.isLoading).toEqual(true);

      await waitFor(() => {
        expect(controllerMock.getAll).toHaveBeenCalledWith(0, 100, 'terminoABuscar');
        expect(result.current.products).toEqual([productMock1]);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(null);
      });
    });
    it('debe de ejecutar exitosamente el hook cuando término de busqueda tiene menos de 3 letras', async () => {
      controllerMock.getAll.mockResolvedValue([productMock1]);

      const { result } = renderHook(() => useSearchProducts('ab'));

      expect(result.current.isLoading).toEqual(false);

      await waitFor(() => {
        expect(controllerMock.getAll).not.toHaveBeenCalled();
        expect(result.current.products).toEqual(undefined);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(null);
      });
    });
    it('debe de ejecutar exitosamente el hook cuando término no es pasado por parámetros', async () => {
      controllerMock.getAll.mockResolvedValue([productMock1]);

      const { result } = renderHook(() => useSearchProducts());

      expect(result.current.isLoading).toEqual(false);

      await waitFor(() => {
        expect(controllerMock.getAll).not.toHaveBeenCalled();
        expect(result.current.products).toEqual(undefined);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(null);
      });
    });
  });

  describe('cuando es fallido', () => {
    it('debe de manejar correctamente un error', async () => {
      const error = 'Error inesperado en el sistema;';
      controllerMock.getAll.mockRejectedValue(error);

      const { result } = renderHook(() => useSearchProducts('terminoABuscar'));

      expect(result.current.isLoading).toEqual(true);

      await waitFor(() => {
        expect(controllerMock.getAll).toHaveBeenCalledWith(0, 100, 'terminoABuscar');
        expect(result.current.products).toEqual(undefined);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(error);
      });
    });
  });
});
