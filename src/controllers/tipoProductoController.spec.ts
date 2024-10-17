import { TipoProducto } from '@prisma/client';
import { TipoProductController } from './tipoProductoController';

const tipoProductoMock: TipoProducto[] = [
  { idTipoProducto: 1, nombre: 'Tipo Producto 1' },
  { idTipoProducto: 2, nombre: 'Tipo Producto 2' },
] as unknown as TipoProducto[];

const modelMock = {
  getAllTipoProductos: jest.fn().mockResolvedValue(tipoProductoMock),
};

jest.mock('@/models/tipoProductoModel', () => ({
  getAllTipoProductos: (...args: unknown[]) => modelMock.getAllTipoProductos(...args),
}));

describe('TipoProductController', () => {
  const controller = new TipoProductController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe obtener todos los tipos de productos', async () => {
    const response = await controller.getAll();

    expect(modelMock.getAllTipoProductos).toHaveBeenCalled();
    expect(response).toEqual(tipoProductoMock);
  });
});
