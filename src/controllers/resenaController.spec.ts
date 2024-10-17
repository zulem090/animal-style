import { Resena } from '@prisma/client';
import { ResenaController } from './resenaController';

const resenaMock: Resena = {
  idResena: 1,
  comentario: 'Comentario 1',
  puntuacion: 2.5,
  fechaResena: new Date(),
} as unknown as Resena;

const modelMock = {
  getProductoResenas: jest.fn().mockResolvedValue(resenaMock),
};

jest.mock('@/models/resenaModel', () => ({
  getProductoResenas: (...args: unknown[]) => modelMock.getProductoResenas(...args),
}));

describe('ResenaController', () => {
  const controller = new ResenaController();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe obtener todas las reseñas de un producto', async () => {
    const idProducto = 1;
    const response = await controller.getResenasProducto(idProducto);

    expect(modelMock.getProductoResenas).toHaveBeenCalled();
    expect(modelMock.getProductoResenas).toHaveBeenCalledWith(idProducto);
    expect(response).toEqual(resenaMock);
  });
});
