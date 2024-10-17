import { render, screen } from '@testing-library/react';
import { ProductRating } from './ProductRating';
import { useGetResenasProducto } from '@/hooks/useGetResenasProduct';

// Mock del hook
jest.mock('@/hooks/useGetResenasProduct');

const mockUseGetResenasProducto = useGetResenasProducto as jest.Mock;

describe('ProductRating', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('muestra un spinner cuando está cargando', () => {
    mockUseGetResenasProducto.mockReturnValueOnce({
      resenas: null,
      isLoading: true,
      error: null,
    });

    render(<ProductRating productId={1} />);
    expect(screen.getByTestId('simbolo-carga-producto-rating')).toBeInTheDocument();
  });

  it('muestra un mensaje de error cuando hay un error', () => {
    mockUseGetResenasProducto.mockReturnValueOnce({
      resenas: null,
      isLoading: false,
      error: 'Error al cargar las reseñas',
    });

    render(<ProductRating productId={1} />);
    expect(screen.getByText(/error al cargar la calificación/i)).toBeInTheDocument();
  });

  it('muestra las estrellas correctamente', () => {
    mockUseGetResenasProducto.mockReturnValueOnce({
      resenas: { puntuacionPromedio: 4.5, numeroResenas: 10 },
      isLoading: false,
      error: null,
    });

    render(<ProductRating productId={1} />);
    const stars = screen.getAllByRole('img'); // asumiendo que el componente Star tiene un rol de img
    expect(stars.length).toBe(5); // Solo se redondea a la parte entera
  });

  it('muestra el promedio si showPromedio es true', () => {
    mockUseGetResenasProducto.mockReturnValueOnce({
      resenas: { puntuacionPromedio: 4.5, numeroResenas: 10 },
      isLoading: false,
      error: null,
    });

    render(<ProductRating productId={1} showPromedio />);
    expect(screen.getByText(/4.50/i)).toBeInTheDocument();
  });

  it('no muestra el promedio si showPromedio es false', () => {
    mockUseGetResenasProducto.mockReturnValueOnce({
      resenas: { puntuacionPromedio: 4.5, numeroResenas: 10 },
      isLoading: false,
      error: null,
    });

    render(<ProductRating productId={1} showPromedio={false} />);
    expect(screen.queryByText(/4.50/i)).not.toBeInTheDocument();
  });

  it('muestra el total de reseñas si showTotalResenas es true', () => {
    mockUseGetResenasProducto.mockReturnValueOnce({
      resenas: { puntuacionPromedio: 4.5, numeroResenas: 10 },
      isLoading: false,
      error: null,
    });

    render(<ProductRating productId={1} showTotalResenas />);
    expect(screen.getByText(/10 reseñas/i)).toBeInTheDocument();
  });

  it('no muestra el total de reseñas si showTotalResenas es false', () => {
    mockUseGetResenasProducto.mockReturnValueOnce({
      resenas: { puntuacionPromedio: 4.5, numeroResenas: 10 },
      isLoading: false,
      error: null,
    });

    render(<ProductRating productId={1} showTotalResenas={false} />);
    expect(screen.queryByText(/10 reseñas/i)).not.toBeInTheDocument();
  });

  it('muestra 0 reseñas por defecto si no hay reseñas', () => {
    mockUseGetResenasProducto.mockReturnValueOnce({
      resenas: null,
      isLoading: false,
      error: null,
    });

    render(<ProductRating productId={1} showTotalResenas showPromedio />);
    expect(screen.queryByText(/0 reseñas/i)).toBeInTheDocument();
  });

  it('muestra la puntuacion promedio', () => {
    mockUseGetResenasProducto.mockReturnValueOnce({
      resenas: { puntuacionPromedio: 3.5, numeroResenas: 5 },
      isLoading: false,
      error: null,
    });

    render(<ProductRating productId={1} showTotalResenas showPromedio />);
    expect(screen.queryByText(/5 reseñas/i)).toBeInTheDocument();
    expect(screen.getByTestId('puntuacion-promedio')).toBeInTheDocument();
    expect(screen.getByTestId('puntuacion-promedio')).toHaveTextContent('3.50');
  });

  it('muestra la puntuacion promedio por defecto si aun no hay una puntuación promedio', () => {
    mockUseGetResenasProducto.mockReturnValueOnce({
      resenas: { puntuacionPromedio: undefined, numeroResenas: 1 },
      isLoading: false,
      error: null,
    });

    render(<ProductRating productId={1} showTotalResenas showPromedio />);
    expect(screen.queryByText(/1 reseñas/i)).toBeInTheDocument();
    expect(screen.getByTestId('puntuacion-promedio')).toBeInTheDocument();
    expect(screen.getByTestId('puntuacion-promedio')).toHaveTextContent('0.00');
  });
});
