import { render, screen, waitFor } from '@testing-library/react';
import ProductsPage from '../pages/products'; // Ajusta la ruta según tu estructura
import { getUserSession } from '@/helpers/auth/getUserSession';
import { ProductController } from '@/controllers/productController';
import { ProductoDto } from '@/dto/producto/productoDto';

// Mock de getUserSession
jest.mock('@/helpers/auth/getUserSession');
const mockGetUserSession = getUserSession as jest.MockedFunction<typeof getUserSession>;

// Mock de ProductController
jest.mock('@/controllers/productController');
const mockProductController = ProductController as jest.Mock;
const mockGetAll = jest.fn();

beforeEach(() => {
  mockProductController.mockClear();
  mockGetAll.mockClear();
  mockProductController.mockImplementation(() => ({
    getAll: mockGetAll,
  }));
});

describe('ProductsPage', () => {
  it('muestra el loader mientras carga los productos', () => {
    mockGetUserSession.mockResolvedValue({} as any); // Mock del usuario
    mockGetAll.mockResolvedValue([]); // Mock de productos vacíos

    render(<ProductsPage searchParams={{}} />);

    // Verifica que el loader se muestre
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('muestra la lista de productos una vez que cargan', async () => {
    const mockUser = { name: 'John Doe' };
    const mockProducts: ProductoDto[] = [
      { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', precio: 10 },
      { id: 2, nombre: 'Producto 2', descripcion: 'Descripción 2', precio: 20 },
    ];

    mockGetUserSession.mockResolvedValue(mockUser);
    mockGetAll.mockResolvedValue(mockProducts);

    render(<ProductsPage searchParams={{}} />);

    // Espera a que se carguen los productos
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    // Verifica que la lista de productos se muestre
    expect(screen.getByText('Producto 1')).toBeInTheDocument();
    expect(screen.getByText('Producto 2')).toBeInTheDocument();
  });

  it('llama a productController.getAll con los parámetros correctos', async () => {
    const searchParams = { nombre: 'test' };
    mockGetUserSession.mockResolvedValue({} as any);
    mockGetAll.mockResolvedValue([]);

    render(<ProductsPage searchParams={searchParams} />);

    // Espera a que se resuelva la promesa
    await waitFor(() => expect(mockGetAll).toHaveBeenCalledTimes(1));

    // Verifica que se llame a getAll con los parámetros correctos
    expect(mockGetAll).toHaveBeenCalledWith(0, 100, searchParams.nombre);
  });

  it('muestra un mensaje si no hay productos', async () => {
    mockGetUserSession.mockResolvedValue({} as any);
    mockGetAll.mockResolvedValue([]);

    render(<ProductsPage searchParams={{}} />);

    // Espera a que se carguen los productos
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    // Verifica que se muestre un mensaje de "no hay productos"
    // (Asumiendo que ProductsList muestra un mensaje cuando products está vacío)
    expect(screen.getByText('No hay productos')).toBeInTheDocument(); 
  });
});