import { renderHook, waitFor } from '@testing-library/react';
import { useGetMarcas } from './useGetMarcas';
import { Marca } from '@prisma/client';

const controllerMock = {
  getAll: jest.fn(),
};

jest.mock('@/controllers/marcaController', () => ({
  MarcaController: jest.fn().mockImplementation(() => controllerMock),
}));

const marcasMock: Marca[] = [
  { idMarca: 1, nombre: 'Marca 1' },
  { idMarca: 2, nombre: 'Marca 2' },
] as unknown as Marca[];

describe('useGetMarcas', () => {
  describe('cuando es exitoso', () => {
    it('debe de ejecutar exitosamente el hook', async () => {
      controllerMock.getAll.mockResolvedValue(marcasMock);

      const { result } = renderHook(() => useGetMarcas());

      expect(result.current.isLoading).toEqual(true);

      await waitFor(() => {
        expect(controllerMock.getAll).toHaveBeenCalled();
        expect(result.current.marcas).toEqual(marcasMock);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(null);
      });
    });
  });

  describe('cuando es fallido', () => {
    it('debe de manejar correctamente un error', async () => {
      const error = 'Error inesperado en el sistema;';
      controllerMock.getAll.mockRejectedValue(error);

      const { result } = renderHook(() => useGetMarcas());

      expect(result.current.isLoading).toEqual(true);

      await waitFor(() => {
        expect(result.current.marcas).toEqual(undefined);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(error);
      });
    });
  });
});
