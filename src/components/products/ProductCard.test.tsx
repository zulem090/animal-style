import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ProductoDto } from '@/dto/producto/productoDto';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ProductCard } from './ProductCard';
import { User as UserSession } from 'next-auth';

const productControllerMock = {
  deleteById: jest.fn(),
  activeById: jest.fn(),
  inactiveById: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  loading: jest.fn(),
  success: jest.fn(),
  error: jest.fn(),
  remove: jest.fn(),
}));

jest.mock('@/controllers/productController', () => ({
  ProductController: jest.fn().mockImplementation(() => productControllerMock),
}));

describe('ProductCard Component', () => {
  const productoMock: ProductoDto = {
    idProducto: 1,
    nombre: 'Producto Test',
    descripcion: 'Descripción del producto Test',
    imagen: '/test-image.jpg',
    estado: 'ACTIVO',
    tipo: 'Tipo Test',
    marca: 'Marca Test',
    precio: 1000,
    cantidad: 10,
  };

  const userMock: UserSession = {
    id: '1',
    role: 'ADMIN',
  };

  const routerPushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValueOnce({ push: routerPushMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar correctamente con un producto', () => {
    render(<ProductCard producto={productoMock} user={userMock} />);

    expect(screen.getByText('Producto Test')).toBeInTheDocument();
    expect(screen.getByText('Descripción del producto Test')).toBeInTheDocument();
    expect(screen.getByText('Tipo Test')).toBeInTheDocument();
    expect(screen.getByText('Marca Test')).toBeInTheDocument();
    expect(screen.getByText('En stock: 10')).toBeInTheDocument();
  });

  it('debería navegar a la página de edición cuando se hace clic en el botón de editar', async () => {
    render(<ProductCard producto={productoMock} user={userMock} />);

    const editButton = screen.getByTestId('boton-editar');
    await act(() => fireEvent.click(editButton));

    expect(routerPushMock).toHaveBeenCalledWith(`/products/${productoMock.idProducto}/edit`);
  });

  it('debería llamar a la función deleteById y mostrar un mensaje de éxito al eliminar un producto', async () => {
    render(<ProductCard producto={productoMock} user={userMock} />);

    const deleteButton = screen.getByTestId('boton-eliminar');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(productControllerMock.deleteById).toHaveBeenCalledWith(productoMock.idProducto);
      expect(toast.success).toHaveBeenCalledWith(`${productoMock.nombre} ha sido eliminado!`, { duration: 4000 });
    });
  });

  it('debería manejar el cambio de estado del producto a inactivo', async () => {
    render(<ProductCard producto={productoMock} user={userMock} />);

    const statusButton = screen.getByTestId('boton-cambiar-estado');
    fireEvent.click(statusButton);

    await waitFor(() => {
      expect(productControllerMock.inactiveById).toHaveBeenCalledWith(productoMock.idProducto);
      expect(toast.success).toHaveBeenCalledWith(`${productoMock.nombre} ha sido inactivado!`, { duration: 3000 });
    });
  });

  it('debería manejar el cambio de estado del producto a activo', async () => {
    const inactiveProduct = { ...productoMock, estado: 'INACTIVO' };
    render(<ProductCard producto={inactiveProduct} user={userMock} />);

    const statusButton = screen.getByTestId('boton-cambiar-estado');
    fireEvent.click(statusButton);

    await waitFor(() => {
      expect(productControllerMock.activeById).toHaveBeenCalledWith(inactiveProduct.idProducto);
      expect(toast.success).toHaveBeenCalledWith(`${inactiveProduct.nombre} ha sido activado!`, { duration: 3000 });
    });
  });

  it('debería deshabilitar los botones de acción mientras se ejecutan', async () => {
    render(<ProductCard producto={productoMock} user={userMock} />);

    const deleteButton = screen.getByTestId('boton-eliminar');
    const statusButton = screen.getByTestId('boton-cambiar-estado');

    fireEvent.click(deleteButton);
    fireEvent.click(statusButton);

    waitFor(() => {
      expect(deleteButton).toBeDisabled();
      expect(statusButton).toBeDisabled();
    });
  });
});
