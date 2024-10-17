import { render, screen, waitFor } from '@testing-library/react';
import { useGetProductById } from '@/hooks/useGetProductById';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/hooks/store';
import { User as UserSession } from 'next-auth';
import { ProductDetail } from './ProductDetail';

// Mock de las dependencias
jest.mock('@/hooks/useGetProductById', () => ({
  useGetProductById: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/store', () => ({
  useProductStore: jest.fn(),
}));

describe('ProductDetail Component', () => {
  const mockPush = jest.fn();
  const mockSetLoadingSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValueOnce({
      push: mockPush,
    });

    (useProductStore as jest.Mock).mockReturnValueOnce({
      setLoadingSearch: mockSetLoadingSearch,
    });
  });

  const product = {
    nombre: 'Producto de prueba',
    estado: 'ACTIVO',
    imagen: '/images/sample.jpg',
    precio: 1500,
    cantidad: 10,
    tipo: 'Electrónico',
    marca: 'Marca Famosa',
    descripcion: 'Descripción del producto de prueba',
  };

  it('debería mostrar el spinner mientras el producto se está cargando', () => {
    (useGetProductById as jest.Mock).mockReturnValueOnce({
      product: null,
      isLoading: true,
      error: null,
    });

    render(<ProductDetail productId={1} />);

    expect(screen.getByTestId('simbolo-carga-detalle-producto')).toBeInTheDocument(); // Spinner
  });

  it('debería mostrar un mensaje de error si ocurre un error al cargar el producto', async () => {
    (useGetProductById as jest.Mock).mockReturnValueOnce({
      product: null,
      isLoading: false,
      error: 'Error al cargar el producto',
    });

    render(<ProductDetail productId={1} user={{ role: 'ADMIN' } as UserSession} />);

    expect(screen.getByText('Un error inesperado ha occurido')).toBeInTheDocument();
  });

  it('debería redirigir a la página de productos si el producto no está activo y el usuario no es admin', () => {
    (useGetProductById as jest.Mock).mockReturnValueOnce({
      product: { ...product, estado: 'INACTIVO' },
      isLoading: false,
      error: null,
    });

    render(<ProductDetail productId={1} user={{ role: 'USER' } as UserSession} />);

    expect(mockPush).toHaveBeenCalledWith('/products');
  });

  it('debería mostrar los detalles del producto cuando se carga correctamente', async () => {
    (useGetProductById as jest.Mock).mockReturnValueOnce({
      product,
      isLoading: false,
      error: null,
    });

    render(<ProductDetail productId={1} user={{ role: 'USER' } as UserSession} />);

    expect(screen.getByText('Producto de prueba')).toBeInTheDocument();
    expect(screen.getByText('$1.500')).toBeInTheDocument();
    expect(screen.getByText('Descripción del producto de prueba')).toBeInTheDocument();
    expect(screen.getByAltText('product image')).toBeInTheDocument();
  });

  it('debería mostrar el estado del producto si el usuario es admin', async () => {
    (useGetProductById as jest.Mock).mockReturnValueOnce({
      product: { ...product, imagen: undefined },
      isLoading: false,
      error: null,
    });

    render(<ProductDetail productId={1} user={{ role: 'ADMIN' } as UserSession} />);

    expect(screen.getByText('Producto de prueba')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument(); // Verificamos el estado del producto
  });

  it('debería deshabilitar la búsqueda una vez que el producto ha sido cargado', async () => {
    (useGetProductById as jest.Mock).mockReturnValueOnce({
      product: { ...product, estado: 'INACTIVO' },
      isLoading: false,
      error: null,
    });

    render(<ProductDetail productId={1} user={{ role: 'ADMIN' } as UserSession} />);

    await waitFor(() => {
      expect(mockSetLoadingSearch).toHaveBeenCalledWith(false);
    });
  });
});
