import { render, screen } from '@testing-library/react';
import { ProductoDto } from '@/dto/producto/productoDto';
import { User as UserSession } from 'next-auth';
import { ProductsList } from './ProductsList';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/components/products', () => ({
  ...jest.requireActual('@/components/products'),
  ProductCard: jest.fn(() => <div>Un Producto</div>),
}));

describe('ProductsList', () => {
  const mockProducts: ProductoDto[] = [
    {
      idProducto: 1,
      nombre: 'Producto 1',
      descripcion: 'Descripción del producto 1',
      precio: 1000,
      cantidad: 10,
      imagen: 'image1.jpg',
      idTipo: 1,
      idMarca: 1,
      estado: 'ACTIVO',
    },
    {
      idProducto: 2,
      nombre: 'Producto 2',
      descripcion: 'Descripción del producto 2',
      precio: 1500,
      cantidad: 5,
      imagen: 'image2.jpg',
      idTipo: 2,
      idMarca: 2,
      estado: 'ACTIVO',
    },
  ];

  const mockUserAdmin: UserSession = {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  } as UserSession;

  const mockUserNonAdmin: UserSession = {
    name: 'Regular User',
    email: 'user@example.com',
    role: 'USER',
  } as UserSession;

  it('renderiza un botón de crear un producto si el usuario es un admin', () => {
    render(<ProductsList user={mockUserAdmin} products={mockProducts} />);

    const createButton = screen.getByRole('button', { name: /crear producto/i });
    expect(createButton).toBeInTheDocument();
  });

  it('no renderiza el boton de crear si el usuario no s un admin', () => {
    render(<ProductsList user={mockUserNonAdmin} products={mockProducts} />);

    const createButton = screen.queryByRole('button', { name: /crear producto/i });
    expect(createButton).toBeNull();
  });

  it('renderiza un producto cuando los productos estan disponible', () => {
    render(<ProductsList user={mockUserNonAdmin} products={mockProducts} />);

    const productCards = screen.getAllByText(/Un Producto/i);
    expect(productCards.length).toBe(2); // Dado que hay dos productos en la lista
  });

  it('renderiza un mensaje cuando no hay productos disponibles', () => {
    render(<ProductsList user={mockUserNonAdmin} products={[]} />);

    const noProductsMessage = screen.getByText(/no hay o no se encontró productos/i);
    expect(noProductsMessage).toBeInTheDocument();
  });
});
