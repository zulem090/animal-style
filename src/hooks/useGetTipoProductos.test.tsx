import { renderHook, waitFor } from '@testing-library/react';
import { useGetTipoProductos } from './useGetTipoProductos';
import { Marca } from '@prisma/client';
import { TipoProductoDto } from '@/dto/tipoProducto/tipoProductoDto';

const controllerMock = {
  getAll: jest.fn(),
};

jest.mock('@/controllers/tipoProductoController', () => ({
  TipoProductController: jest.fn().mockImplementation(() => controllerMock),
}));

const tipoProductoMock: TipoProductoDto[] = [
  { idTipoProducto: 1, nombre: 'Tipo Producto 1' },
  { idTipoProducto: 2, nombre: 'Tipo Producto 2' },
] as unknown as TipoProductoDto[];

describe('useGetTipoProductos', () => {
  describe('cuando es exitoso', () => {
    it('debe de ejecutar exitosamente el hook', async () => {
      controllerMock.getAll.mockResolvedValue(tipoProductoMock);

      const { result } = renderHook(() => useGetTipoProductos());

      expect(result.current.isLoading).toEqual(true);

      await waitFor(() => {
        expect(controllerMock.getAll).toHaveBeenCalled();
        expect(result.current.tipoProductos).toEqual(tipoProductoMock);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(null);
      });
    });
  });

  describe('cuando es fallido', () => {
    it('debe de manejar correctamente un error', async () => {
      const error = 'Error inesperado en el sistema;';
      controllerMock.getAll.mockRejectedValue(error);

      const { result } = renderHook(() => useGetTipoProductos());

      expect(result.current.isLoading).toEqual(true);

      await waitFor(() => {
        expect(result.current.tipoProductos).toEqual(undefined);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(error);
      });
    });
  });
});
