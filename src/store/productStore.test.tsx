import { ProductoDto } from '@/dto/producto/productoDto';
import { createProductStore, defaultInitState, initProductStore, ProductStore } from './productStore';
import { StoreApi } from 'zustand';

describe('Product Store', () => {
  let store: StoreApi<ProductStore>;

  beforeEach(async () => {
    // Se crea una nueva instancia de la tienda antes de cada prueba
    store = createProductStore(defaultInitState);
  });

  it('debería inicializar el estado correctamente', () => {
    const initialState = initProductStore();
    expect(store.getState().productsPreview).toEqual(initialState.productsPreview);
    expect(store.getState().loadingSearch).toBe(initialState.loadingSearch);
  });

  it('debería actualizar correctamente los productos en productsPreview', async () => {
    const mockProducts: ProductoDto[] = [
      {
        idProducto: 1,
        nombre: 'Producto 1',
        cantidad: 10,
        descripcion: 'Descripción 1',
        estado: 'activo',
        precio: 100,
      },
      { idProducto: 2, nombre: 'Producto 2', cantidad: 5, descripcion: 'Descripción 2', estado: 'activo', precio: 200 },
    ];

    store.getState().setProductPreview(mockProducts);

    expect(store.getState().productsPreview).toEqual(mockProducts);
  });

  it('debería actualizar correctamente el estado de loadingSearch', () => {
    store.getState().setLoadingSearch(true);
    expect(store.getState().loadingSearch).toBe(true);

    store.getState().setLoadingSearch(false);
    expect(store.getState().loadingSearch).toBe(false);
  });

  it('debería tener un estado por defecto correcto', () => {
    expect(store.getState().productsPreview).toEqual([]);
    expect(store.getState().loadingSearch).toBe(false);
  });

  it('debería mantener la inmutabilidad al actualizar productsPreview', () => {
    const mockProducts: ProductoDto[] = [
      {
        idProducto: 1,
        nombre: 'Producto 1',
        cantidad: 10,
        descripcion: 'Descripción 1',
        estado: 'activo',
        precio: 100,
      },
    ];

    const previousState = store.getState().productsPreview;

    store.getState().setProductPreview(mockProducts);

    expect(store.getState().productsPreview).not.toBe(previousState); // Comprobamos que se ha creado un nuevo array
  });

  it('debería actualizar correctamente cuando se pasa un estado inicial diferente', () => {
    const customInitState = { productsPreview: [], loadingSearch: true };
    const customStore = createProductStore(customInitState).getState();

    expect(customStore.loadingSearch).toBe(true);
    expect(customStore.productsPreview).toEqual([]);
  });

  it('debería inicializar el estado correctamente si no se provee un init state', () => {
    const customStore = createProductStore().getState();

    expect(customStore.productsPreview).toEqual(defaultInitState.productsPreview);
    expect(customStore.loadingSearch).toBe(defaultInitState.loadingSearch);
  });
});
