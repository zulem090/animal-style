import { prismaMock } from '@/test/mocks/prismaMock';
import { getAllTipoProductos } from './tipoProductoModel';
import { TipoProducto } from '@prisma/client';

describe('TipoProducto Model', () => {
  describe('getAllTipoProductos', () => {
    const tipoProductoMock: TipoProducto[] = [
      { idTipoProducto: 1, nombre: 'Tipo Producto 1' },
      { idTipoProducto: 2, nombre: 'Tipo Producto 2' },
    ] as unknown as TipoProducto[];

    it('debería retornar un array de TipoProductoDto con las propiedades correctas', async () => {
      prismaMock.tipoProducto.findMany.mockResolvedValueOnce(tipoProductoMock);
      const result = await getAllTipoProductos();

      expect(prismaMock.tipoProducto.findMany).toHaveBeenCalled();
      expect(result).toEqual(tipoProductoMock);
    });

    it('debería retornar un array vacío si no hay tipo productos en la base de datos', async () => {
      prismaMock.tipoProducto.findMany.mockResolvedValueOnce([]);

      const result = await getAllTipoProductos();

      expect(prismaMock.tipoProducto.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
