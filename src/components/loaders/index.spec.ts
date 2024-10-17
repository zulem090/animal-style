import * as components from './index';

describe('index', () => {
  it('debe exportar ProductsListLoader', () => {
    expect(components.ProductsListLoader).toBeDefined();
  });

  it('debe exportar ProductDetailLoader', () => {
    expect(components.ProductDetailLoader).toBeDefined();
  });

  it('debe exportar Spinner', () => {
    expect(components.Spinner).toBeDefined();
  });
});
