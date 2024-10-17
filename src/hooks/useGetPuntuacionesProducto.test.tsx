import { renderHook, waitFor } from '@testing-library/react';
import { useGetResenasProducto } from './useGetResenasProduct';
import { ResenaDto } from '@/dto/resena/resenaDto';

const controllerMock = {
  getResenasProducto: jest.fn(),
};

jest.mock('@/controllers/resenaController', () => ({
  ResenaController: jest.fn().mockImplementation(() => controllerMock),
}));

const resenaMock1: ResenaDto = {
  idResena: 1,
  comentario: 'Comentario 1',
  puntuacion: 2.5,
  fechaResena: new Date(),
} as unknown as ResenaDto;

describe('useGetResenasProducto', () => {
  describe('cuando es exitoso', () => {
    it('debe de ejecutar exitosamente el hook', async () => {
      controllerMock.getResenasProducto.mockResolvedValue(resenaMock1);

      const { result } = renderHook(() => useGetResenasProducto(1));

      expect(result.current.isLoading).toEqual(true);

      await waitFor(() => {
        expect(controllerMock.getResenasProducto).toHaveBeenCalledWith(1);
        expect(result.current.resenas).toEqual(resenaMock1);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(null);
      });
    });
  });

  describe('cuando es fallido', () => {
    it('debe de manejar correctamente un error', async () => {
      const error = 'Error inesperado en el sistema;';
      controllerMock.getResenasProducto.mockRejectedValue(error);

      const { result } = renderHook(() => useGetResenasProducto(1));

      expect(result.current.isLoading).toEqual(true);

      await waitFor(() => {
        expect(controllerMock.getResenasProducto).toHaveBeenCalledWith(1);
        expect(result.current.resenas).toEqual(undefined);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(error);
      });
    });
  });
});
