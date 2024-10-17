import { useContext } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { createProductStore, initProductStore } from '@/store';
import { ProductStoreContext, ProductStoreProvider } from './productStoreProvider';

// Mock de createProductStore y initProductStore
jest.mock('@/store', () => ({
  createProductStore: jest.fn(),
  initProductStore: jest.fn(),
}));

describe('ProductStoreProvider', () => {
  const createProductStoreMock = createProductStore as jest.Mock;
  const initProductStoreMock = initProductStore as jest.Mock;

  beforeEach(() => {
    // Mock de initProductStore para que devuelva un valor inicial
    initProductStoreMock.mockReturnValue({
      products: [],
      setProducts: jest.fn(),
    });

    createProductStoreMock.mockReturnValue({
      getState: jest.fn(),
      setState: jest.fn(),
      subscribe: jest.fn(),
      destroy: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar los hijos correctamente', () => {
    const TestComponent = () => (
      <ProductStoreProvider>
        <div>Child Component</div>
      </ProductStoreProvider>
    );

    render(<TestComponent />);

    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('debería crear el store utilizando createProductStore y initProductStore', () => {
    const TestComponent = () => (
      <ProductStoreProvider>
        <div>Test Store</div>
      </ProductStoreProvider>
    );

    render(<TestComponent />);

    // Verificar que initProductStore se llama para inicializar el estado
    expect(initProductStoreMock).toHaveBeenCalledTimes(1);

    // Verificar que createProductStore se llama para crear el store
    expect(createProductStoreMock).toHaveBeenCalledWith(initProductStoreMock());
  });

  it('debería proveer el store a los componentes hijos', async () => {
    const TestChild = () => {
      const store = useContext(ProductStoreContext);
      return <div>{store ? 'Store Provided' : 'No Store'}</div>;
    };

    render(
      <ProductStoreProvider>
        <TestChild />
      </ProductStoreProvider>,
    );

    // Usamos waitFor para esperar que el store esté disponible
    await waitFor(() => expect(screen.getByText('Store Provided')).toBeInTheDocument());
  });
});
