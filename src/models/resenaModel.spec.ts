import { prismaMock } from '@/test/mocks/prismaMock';
import { getProductoResenas, getPuntuacionProductByUser } from './resenaModel';
import { Resena } from '@prisma/client';

describe('Resena Model', () => {
  const resenaMock1: Resena = {
    idResena: 1,
    comentario: 'Comentario 1',
    puntuacion: 2.5,
    fechaResena: new Date(),
  } as unknown as Resena;

  const resenaMock2: Resena = {
    idResena: 2,
    comentario: 'Comentario 2',
    puntuacion: 4.5,
    fechaResena: new Date(),
  } as unknown as Resena;

  const resenasMock: Resena[] = [resenaMock1, resenaMock2];

  describe('getProductoResenas', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.resena.findMany.mockResolvedValueOnce(resenasMock);
      });

      it('debería retornar el promedio de puntuaciones de un producto', async () => {
        const result = await getProductoResenas(1);

        expect(prismaMock.resena.findMany).toHaveBeenCalledWith({
          where: {
            idProducto: 1,
          },
          select: { puntuacion: true },
        });
        expect(result).toEqual({
          numeroResenas: resenasMock.length,
          puntuacionPromedio: (Number(resenaMock1.puntuacion) + Number(resenaMock2.puntuacion)) / 2,
        });
      });
    });
  });

  describe('getPuntuacionProductByUser', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('debería retornar la puntuacion de un producto de un usuario', async () => {
        prismaMock.resena.findFirst.mockResolvedValueOnce(resenaMock1);
        const result = await getPuntuacionProductByUser(1, 'id-usuario');

        expect(prismaMock.resena.findFirst).toHaveBeenCalledWith({
          where: {
            idProducto: 1,
            idUsuario: 'id-usuario',
          },
          select: { puntuacion: true },
        });
        expect(result).toEqual(resenaMock1.puntuacion);
      });

      it('debería retornar undefined si la reseña no es encontrada', async () => {
        prismaMock.resena.findFirst.mockResolvedValueOnce(null);
        const result = await getPuntuacionProductByUser(1, 'id-usuario');

        expect(prismaMock.resena.findFirst).toHaveBeenCalledWith({
          where: {
            idProducto: 1,
            idUsuario: 'id-usuario',
          },
          select: { puntuacion: true },
        });
        expect(result).toEqual(undefined);
      });
    });
  });
});
