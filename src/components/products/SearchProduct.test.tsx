import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchProduct } from './SearchProduct';
import { ProductoDto } from '@/dto/producto/productoDto';

const paramMock = jest.fn();

const controllerMock = {
  getAll: jest.fn(),
};

const routerMock = {
  push: jest.fn(),
};

const mockSetProductPreview = jest.fn();
const mockSetLoadingSearch = jest.fn();
const mockProductStore = {
  productsPreview: [] as ProductoDto[],
  setProductPreview: mockSetProductPreview,
  loadingSearch: false,
  setLoadingSearch: mockSetLoadingSearch,
};

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => routerMock),
  useSearchParams: jest.fn(() => ({
    get: paramMock,
  })),
}));

jest.mock('@/controllers/productController', () => ({
  ProductController: jest.fn().mockImplementation(() => controllerMock),
}));

jest.mock('@/hooks/store', () => ({
  useProductStore: jest.fn(() => mockProductStore),
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

const productMock2: ProductoDto = {
  idProducto: 2,
  nombre: 'Producto 2',
  descripcion: 'Producto 2',
  cantidad: 1,
  precio: 300,
  idMarca: 1,
  idTipo: 1,
  estado: 'ACTIVO',
} as ProductoDto;

const productosMock = [productMock1, productMock2];

beforeEach(() => {
  controllerMock.getAll.mockResolvedValueOnce(productosMock);
  paramMock.mockReturnValueOnce('Producto');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('SearchProduct', () => {
  it('muestra el spinner cuando está cargando', async () => {
    mockProductStore.loadingSearch = true;

    render(<SearchProduct />);
    expect(screen.getByTestId('products-search')).toBeInTheDocument();

    expect(screen.getByTestId('simbolo-carga-busqueda-producto')).toBeInTheDocument();
  });
  it('no muestra el spinner cuando ya se cargó todo', async () => {
    mockProductStore.loadingSearch = false;

    render(<SearchProduct />);
    expect(screen.getByTestId('products-search')).toBeInTheDocument();

    expect(screen.findByTestId('simbolo-carga-busqueda-producto')).resolves.toEqual({});
  });

  it('realiza una búsqueda cuando se ingresa un término', async () => {
    mockProductStore.productsPreview = productosMock;
    render(<SearchProduct />);

    const input = screen.getByTestId('products-search');
    fireEvent.change(input, { target: { value: 'Producto' } });

    fireEvent.keyUp(input); // Simula la liberación de una tecla

    await waitFor(() => {
      expect(mockSetLoadingSearch).toHaveBeenCalledTimes(2);

      expect(mockSetLoadingSearch).toHaveBeenNthCalledWith(1, true);
      expect(mockSetProductPreview).toHaveBeenCalledWith(productosMock);
      expect(mockSetLoadingSearch).toHaveBeenNthCalledWith(2, false);
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
      expect(screen.getByText('Producto 2')).toBeInTheDocument();
    });
  });

  it('cierra el previewer al hacer clic fuera del input', async () => {
    mockProductStore.productsPreview = productosMock;

    render(<SearchProduct />);

    const input = screen.getByTestId('products-search');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '' } });

    // Simula la búsqueda
    await waitFor(() => fireEvent.keyUp(input));

    // Verifica que el previsualizador se muestra
    expect(screen.getByText('Producto 1')).toBeInTheDocument();

    // Simula clic fuera
    fireEvent.blur(input);

    // Verifica que el previsualizador se cierra
    await waitFor(() => expect(mockSetProductPreview).toHaveBeenCalledWith([]));
  });

  it('navega a la página del producto al hacer clic en un producto de la previsualización', async () => {
    mockProductStore.productsPreview = productosMock;

    render(<SearchProduct />);

    const input = screen.getByPlaceholderText('Buscar producto');
    fireEvent.keyUp(input);

    await waitFor(() => {
      const productButton = screen.getByTestId(`product-preview-${productMock1.idProducto}`);
      fireEvent.click(productButton);
    });

    expect(routerMock.push).toHaveBeenCalledWith(`/products/${productMock1.idProducto}`);
    expect(mockSetLoadingSearch).toHaveBeenCalledWith(true);
    expect(mockSetProductPreview).toHaveBeenCalledWith([]);
  });

  it('navega a la página del producto al hundir flecha abajo y hacer clic en un producto de la previsualización', async () => {
    mockProductStore.productsPreview = productosMock;

    render(<SearchProduct />);

    const input = screen.getByPlaceholderText('Buscar producto');

    fireEvent.focus(input);
    fireEvent.keyDown(input, { code: 'ArrowDown', preventDefault: () => {} });

    await waitFor(() => {
      const productButton = screen.getByTestId(`product-preview-${productMock1.idProducto}`);
      fireEvent.keyDown(productButton, { code: 'ArrowDown', preventDefault: () => {} });
      fireEvent.click(productButton);
    });

    expect(routerMock.push).toHaveBeenCalledWith(`/products/${productMock1.idProducto}`);
    expect(mockSetLoadingSearch).toHaveBeenCalledWith(true);
    expect(mockSetProductPreview).toHaveBeenCalledWith([]);
  });

  it('navega a la página del producto hacer tab y hacer clic en un producto de la previsualización', async () => {
    mockProductStore.productsPreview = productosMock;

    render(<SearchProduct />);

    const input = screen.getByPlaceholderText('Buscar producto');

    fireEvent.focus(input);
    fireEvent.keyDown(input, { shiftKey: true, code: 'Tab', preventDefault: () => {} });

    await waitFor(() => {
      const productButton = screen.getByTestId(`product-preview-${productMock1.idProducto}`);
      fireEvent.keyDown(productButton, { code: 'ArrowDown', preventDefault: () => {} });
      fireEvent.click(productButton);
    });

    expect(routerMock.push).toHaveBeenCalledWith(`/products/${productMock1.idProducto}`);
    expect(mockSetLoadingSearch).toHaveBeenCalledWith(true);
    expect(mockSetProductPreview).toHaveBeenCalledWith([]);
  });

  it('mantiene el foco en el campo de busqueda cuando se hunde flecha abajo y si no encuentra un producto hermano en la previsualización', async () => {
    mockProductStore.productsPreview = [productMock1];

    render(<SearchProduct />);

    const input = screen.getByPlaceholderText('Buscar producto');

    fireEvent.focus(input);
    fireEvent.keyDown(input, { code: 'ArrowDown', preventDefault: () => {} });

    await waitFor(() => {
      const productButton = screen.getByTestId(`product-preview-${productMock1.idProducto}`);
      fireEvent.keyDown(productButton, { code: 'ArrowDown', preventDefault: () => {} });
      fireEvent.click(productButton);
    });

    expect(routerMock.push).toHaveBeenCalledWith(`/products/${productMock1.idProducto}`);
    expect(mockSetLoadingSearch).toHaveBeenCalledWith(true);
    expect(mockSetProductPreview).toHaveBeenCalledWith([]);
  });

  it('navega a la página del producto al hundir flecha arriba y hacer clic en un producto de la previsualización', async () => {
    mockProductStore.productsPreview = productosMock;

    render(<SearchProduct />);

    const input = screen.getByPlaceholderText('Buscar producto');

    fireEvent.focus(input);
    fireEvent.keyDown(input, { code: 'ArrowUp', preventDefault: () => {} });

    await waitFor(() => {
      const productButton = screen.getByTestId(`product-preview-${productMock1.idProducto}`);
      fireEvent.keyDown(productButton, { code: 'ArrowUp', preventDefault: () => {} });

      fireEvent.click(productButton);
    });

    expect(routerMock.push).toHaveBeenCalledWith(`/products/${productMock1.idProducto}`);
    expect(mockSetLoadingSearch).toHaveBeenCalledWith(true);
    expect(mockSetProductPreview).toHaveBeenCalledWith([]);
  });

  it('mantiene el foco en el campo de busqueda cuando se hunde flecha arriba y si no encuentra un producto hermano en la previsualización', async () => {
    mockProductStore.productsPreview = [productMock1];

    render(<SearchProduct />);

    const input = screen.getByPlaceholderText('Buscar producto');

    fireEvent.focus(input);
    fireEvent.keyDown(input, { code: 'ArrowDown', preventDefault: () => {} });

    await waitFor(() => {
      const productButton = screen.getByTestId(`product-preview-${productMock1.idProducto}`);
      fireEvent.keyDown(productButton, { code: 'ArrowUp', preventDefault: () => {} });
      fireEvent.click(productButton);
    });

    expect(routerMock.push).toHaveBeenCalledWith(`/products/${productMock1.idProducto}`);
    expect(mockSetLoadingSearch).toHaveBeenCalledWith(true);
    expect(mockSetProductPreview).toHaveBeenCalledWith([]);
  });

  it('mantiene el foco en el campo de busqueda cuando se hunde flecha arriba y si encuentra un producto hermano en la previsualización', async () => {
    mockProductStore.productsPreview = productosMock;

    render(<SearchProduct />);

    const input = screen.getByPlaceholderText('Buscar producto');

    fireEvent.focus(input);
    fireEvent.keyDown(input, { code: 'ArrowDown', preventDefault: () => {} });

    await waitFor(() => {
      const productButton = screen.getByTestId(`product-preview-${productMock2.idProducto}`);
      fireEvent.keyDown(productButton, { code: 'ArrowUp', preventDefault: () => {} });
      fireEvent.click(productButton);
    });

    expect(routerMock.push).toHaveBeenCalledWith(`/products/${productMock2.idProducto}`);
    expect(mockSetLoadingSearch).toHaveBeenCalledWith(true);
    expect(mockSetProductPreview).toHaveBeenCalledWith([]);
  });

  it('navega a la página del producto al presionar enter sobre una busqueda correctamente realizada', async () => {
    paramMock.mockReset().mockClear().mockReturnValueOnce('');

    mockProductStore.productsPreview = productosMock;

    render(<SearchProduct />);

    const input = screen.getByPlaceholderText('Buscar producto');
    await userEvent.type(input, `${productMock1.nombre}[Enter]`);

    expect(routerMock.push).toHaveBeenCalledWith(`/products?nombre=${productMock1.nombre}`);
    expect(mockSetLoadingSearch).toHaveBeenCalledWith(true);
    expect(mockSetProductPreview).toHaveBeenCalledWith(productosMock);
  });

  it('navega a la pagina de productos al presionar enter sobre una busqueda vacía', async () => {
    paramMock.mockReset().mockClear().mockReturnValueOnce('');

    mockProductStore.productsPreview = productosMock;

    render(<SearchProduct />);

    const input = screen.getByPlaceholderText('Buscar producto');
    await userEvent.type(input, '[Enter]');

    expect(routerMock.push).toHaveBeenCalledWith('/products');
    expect(mockSetLoadingSearch).toHaveBeenCalledWith(true);
    expect(mockSetProductPreview).not.toHaveBeenCalledWith();
  });

  it('no muestra previsualización si la búsqueda es menor a 2 caracteres', async () => {
    render(<SearchProduct />);

    const input = screen.getByPlaceholderText('Buscar producto');
    fireEvent.change(input, { target: { value: 'P' } });

    await waitFor(() => {
      expect(controllerMock.getAll).not.toHaveBeenCalled();
      expect(mockSetProductPreview).not.toHaveBeenCalled();
    });
  });
});
