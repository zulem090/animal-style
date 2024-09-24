import { prismaMock } from '@/test/mocks/prismaMock';
import { getAllMarcas } from './marcaModel';
import { Marca } from '@prisma/client';

describe('getAllMarcas', () => {
  const marcasMock: Marca[] = [
    { idMarca: 1, nombre: 'Marca 1' },
    { idMarca: 2, nombre: 'Marca 2' },
  ] as unknown as Marca[];

  it('debería retornar un array de MarcaDto con las propiedades correctas', async () => {
    prismaMock.marca.findMany.mockResolvedValueOnce(marcasMock);
    const result = await getAllMarcas();

    expect(prismaMock.marca.findMany).toHaveBeenCalled();
    expect(result).toEqual(marcasMock);
  });

  it('debería retornar un array vacío si no hay marcas en la base de datos', async () => {
    prismaMock.marca.findMany.mockResolvedValueOnce([]);

    const result = await getAllMarcas();

    expect(prismaMock.marca.findMany).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
