import { Marca } from '@prisma/client';
import { MarcaController } from './marcaController';

const marcasMock: Marca[] = [
  { idMarca: 1, nombre: 'Marca 1' },
  { idMarca: 2, nombre: 'Marca 2' },
] as unknown as Marca[];

const modelMock = {
  getAllMarcas: jest.fn().mockResolvedValue(marcasMock),
};

jest.mock('@/models/marcaModel', () => ({
  getAllMarcas: (...args: unknown[]) => modelMock.getAllMarcas(...args),
}));

describe('MarcaController', () => {
  const controller = new MarcaController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe obtener todas las marcas', async () => {
    const response = await controller.getAll();

    expect(modelMock.getAllMarcas).toHaveBeenCalled();
    expect(response).toEqual(marcasMock);
  });
});
