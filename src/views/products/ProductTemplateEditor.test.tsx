import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductTemplateEditor } from './ProductTemplateEditor';
import { useGetMarcas } from '@/hooks/useGetMarcas';
import { useGetTipoProductos } from '@/hooks/useGetTipoProductos';
import { ProductController } from '@/controllers/productController';
import Dinero from 'dinero.js';
import toast from 'react-hot-toast';

jest.mock('@/hooks/useGetMarcas');
jest.mock('@/hooks/useGetTipoProductos');
jest.mock('@/controllers/productController');
jest.mock('react-hot-toast');
jest.mock('next/image', () => ({
  __esModule: true,
  default: (params: { src: string; alt: string; width: number; height: number }) => (
    <img src={params.src} alt={params.alt} width={params.width} height={params.height} />
  ),
}));

global.URL.createObjectURL = jest.fn();

describe('ProductTemplateEditor Component', () => {
  const mockedUseGetMarcas = useGetMarcas as jest.Mock;
  const mockedUseGetTipoProductos = useGetTipoProductos as jest.Mock;
  const mockedProductController = ProductController as jest.Mock;

  const productoMock = {
    nombre: 'Producto 1',
    descripcion: 'Descripción del producto',
    cantidad: 20,
    precio: 1000,
    idTipo: 1,
    idMarca: 1,
  };

  beforeEach(() => {
    mockedUseGetMarcas.mockReturnValue({ marcas: [], isLoading: false });
    mockedUseGetTipoProductos.mockReturnValue({ tipoProductos: [], isLoading: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner when data is loading', () => {
    mockedProductController.prototype.getById = jest.fn().mockResolvedValue(productoMock);

    render(<ProductTemplateEditor productId={1} />);
    expect(screen.getByTestId('simbolo-carga-producto-editor')).not.toBeNull();
  });

  it('renders form fields when loading is complete', async () => {
    render(<ProductTemplateEditor productId={undefined} />);

    await waitFor(() => {
      expect(screen.getByText('Creación del Producto')).not.toBeNull();
    });

    expect(screen.getByText('Nombre del producto')).not.toBeNull();
    expect(screen.getByLabelText('Descripción')).not.toBeNull();
    expect(screen.getByText('Precio')).not.toBeNull();
    expect(screen.getByText('Unidades')).not.toBeNull();
    expect(screen.getByLabelText('Subir Imagen')).not.toBeNull();
  });

  it('displays validation errors when required fields are empty', async () => {
    render(<ProductTemplateEditor productId={undefined} />);

    const submitButton = screen.getByRole('button', { name: /Guardar Producto/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('este campo es requerido')).toHaveLength(3);
    });
  });

  it('displays toast success message after successful product creation', async () => {
    mockedProductController.prototype.create = jest.fn().mockResolvedValue({});
    render(<ProductTemplateEditor productId={undefined} />);

    fireEvent.change(screen.getByTestId('nombre-input'), { target: { value: 'Nuevo Producto' } });
    fireEvent.change(screen.getByTestId('precio-input'), {
      target: { value: Dinero({ amount: 5000 }).toFormat('$0,0') },
    });
    fireEvent.change(screen.getByTestId('cantidad-input'), { target: { value: 10 } });

    const submitButton = screen.getByRole('button', { name: /Guardar Producto/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Nuevo Producto guardado correctamente!', { duration: 4000 });
    });
  });

  it('updates the product successfully', async () => {
    mockedProductController.prototype.getById = jest.fn().mockResolvedValue(productoMock);
    mockedProductController.prototype.update = jest.fn().mockResolvedValue({});

    render(<ProductTemplateEditor productId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId('nombre-input').getAttribute('value')).toBe(productoMock.nombre);
    });

    fireEvent.change(screen.getByTestId('nombre-input'), { target: { value: 'Producto Modificado' } });

    const submitButton = screen.getByRole('button', { name: /Actualizar Producto/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Producto Modificado actualizado!', { duration: 4000 });
    });
  });

  it('changes the image preview when a new image is selected', async () => {
    render(<ProductTemplateEditor productId={undefined} />);

    const imageInput = screen.getByLabelText('Subir Imagen');
    const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(imageInput, { target: { files: [file] } });

    await waitFor(() => {
      const img = screen.getByAltText('product image') as HTMLImageElement;
      expect(img.src).toContain('http://localhost/images/');
    });
  });
});
