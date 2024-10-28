import { prismaMock } from '@/test/mocks/prismaMock';
import {
  activeProduct,
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  inactiveProduct,
  updateProduct,
} from './productModel';
import { Prisma, Producto } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { CreateProductoDto } from '@/dto/producto/createProductoDto';
import { omit } from 'lodash';
import { fakerES_MX as faker } from '@faker-js/faker';
import { UpdateProductoDto } from '@/dto/producto/editProductoDto';
import { ProductoDto } from '@/dto/producto/productoDto';
import { toProductoDto } from '@/mappers/toProductoDto';

jest.mock('image-type');
jest.mock('next/navigation');
jest.mock('next/cache');
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
  User: {},
}));
jest.mock('yup', () => ({
  ...jest.requireActual('yup'),
  object: jest.fn().mockReturnValue({
    validate: () => mockYup(),
  }),
}));

const mockYup = jest.fn();

describe('Product Model', () => {
  let productosDtoMock: ProductoDto[];

  const mockSession = getServerSession as jest.Mock;

  const productMock1: Producto = {
    idProducto: 1 as unknown as BigInt,
    nombre: 'Producto 1',
    descripcion: 'Producto 1',
    cantidad: 1,
    precio: 100 as unknown as Prisma.Decimal,
    idMarca: 1 as unknown as BigInt,
    idTipo: 1 as unknown as BigInt,
    estado: 'ACTIVO',
    imagen: Buffer.from(
      faker.image
        .dataUri({ width: 1, height: 1, type: 'svg-base64', color: faker.color.rgb() })
        .replace(/^data:image\/.*?;base64,/, ''),
      'base64',
    ),
  } as Producto;
  const productMock2: Producto = {
    idProducto: 1 as unknown as BigInt,
    nombre: 'Producto 2',
    descripcion: 'Producto 2',
    cantidad: 1,
    precio: 100 as unknown as Prisma.Decimal,
    idMarca: 1 as unknown as BigInt,
    idTipo: 1 as unknown as BigInt,
    estado: 'ACTIVO',
  } as Producto;
  const productsMock: Producto[] = [productMock1, productMock2];

  const generarProductsDtoMock = async (productos: Producto[]) => {
    const productosARetornar: Array<Promise<ProductoDto>> = [];
    productos.forEach((producto) => {
      productosARetornar.push(toProductoDto(producto));
    });

    return Promise.all(productosARetornar);
  };

  beforeAll(async () => {
    productosDtoMock = await generarProductsDtoMock(productsMock);
  });

  describe('getAllProducts', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockSession.mockResolvedValueOnce({ user: { role: 'USER' } });
      prismaMock.producto.findMany.mockResolvedValueOnce(productsMock);
    });

    describe('cuando es exitoso', () => {
      it('debería retornar un array de Productos', async () => {
        const result = await getAllProducts(0, 10);

        expect(prismaMock.producto.findMany).toHaveBeenCalledWith({
          skip: 0,
          take: 10,
          where: {
            estado: 'ACTIVO',
          },
          include: { tipo: true, marca: true },
        });
        expect(result).toEqual(productosDtoMock);
      });

      it('debería retornar un array de Productos por el nombre', async () => {
        const nombre = 'Producto';
        const result = await getAllProducts(0, 10, nombre);

        expect(prismaMock.producto.findMany).toHaveBeenCalledWith({
          skip: 0,
          take: 10,
          where: {
            estado: 'ACTIVO',
            OR: [
              {
                nombre: { contains: nombre },
              },
              {
                tipo: { nombre: { contains: nombre } },
              },
              {
                marca: { nombre: { contains: nombre } },
              },
            ],
          },
          include: { tipo: true, marca: true },
        });
        expect(result).toEqual(productosDtoMock);
      });

      it('debería retornar un array de Productos como ADMIN (sin filtrar estado)', async () => {
        mockSession
          .mockReset()
          .mockClear()
          .mockResolvedValueOnce({ user: { role: 'ADMIN' } });

        const result = await getAllProducts(0, 10);

        expect(prismaMock.producto.findMany).toHaveBeenCalledWith({
          skip: 0,
          take: 10,
          where: {
            estado: undefined,
          },
          include: { tipo: true, marca: true },
        });
        expect(result).toEqual(productosDtoMock);
      });
    });

    describe('cuando es fallido', () => {
      it('debería lanzar un error si el offset no es proveido', () => {
        expect(() => getAllProducts(undefined!, 10)).rejects.toThrow(new Error('offset must be a number'));
      });
      it('debería lanzar un error si el limit no es proveido', () => {
        expect(() => getAllProducts(0, undefined!)).rejects.toThrow(new Error('limit must be a number'));
      });
    });
  });

  describe('getProductById', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.producto.findUnique.mockResolvedValueOnce(productMock1);
      });

      it('debería retornar un array de Productos', async () => {
        const result = await getProductById(1);

        expect(prismaMock.producto.findUnique).toHaveBeenCalledWith({
          where: {
            idProducto: 1,
          },
          include: { tipo: true, marca: true },
        });
        expect(result).toEqual(productosDtoMock[0]);
      });
    });

    describe('cuando es fallido', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.producto.findUnique.mockResolvedValueOnce(null);
      });

      it('debería lanzar un error si el offset no es proveido', () => {
        expect(() => getProductById(3)).rejects.toThrow(new Error('No product with id 3 found'));
      });
    });
  });

  describe('createProduct', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockYup.mockReturnValueOnce(productMock1);
        prismaMock.producto.findFirst.mockResolvedValueOnce(null);
        prismaMock.producto.create.mockResolvedValueOnce(productMock1);
      });

      it('debería crear un producto', async () => {
        const result = await createProduct(productMock1 as unknown as CreateProductoDto);
        expect(prismaMock.producto.create).toHaveBeenCalledWith({
          data: {
            ...omit(productMock1, ['idProducto', 'estado', 'idTipo', 'idMarca']),
            marca: { connect: { idMarca: productMock1.idMarca } },
            tipo: { connect: { idTipoProducto: productMock1.idTipo } },
          },
        });
        expect(result).toEqual(undefined);
      });

      it('debería guardar sin atributos foraneos tipo y marca', async () => {
        mockYup
          .mockReset()
          .mockClear()
          .mockReturnValueOnce(omit(productMock2, ['idTipo', 'idMarca']));

        const result = await createProduct(productMock2 as unknown as CreateProductoDto);
        expect(prismaMock.producto.create).toHaveBeenCalledWith({
          data: {
            ...omit(productMock2, ['idProducto', 'estado', 'idTipo', 'idMarca']),
            marca: undefined,
            tipo: undefined,
          },
        });
        expect(result).toEqual(undefined);
      });
    });

    describe('cuando es fallido', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockYup.mockReturnValueOnce(productMock1);
      });

      it('debería lanzar un error al guardar un producto con nombre existente', () => {
        prismaMock.producto.findFirst.mockResolvedValueOnce(productMock1);
        expect(() => createProduct(productMock1 as unknown as CreateProductoDto)).rejects.toThrow(
          new Error('No se puede crear un producto con un nombre existente'),
        );
      });

      it('debería lanzar un error general si intentar guardar un producto', () => {
        prismaMock.producto.findFirst.mockResolvedValueOnce(null);
        prismaMock.producto.create.mockRejectedValueOnce({ message: 'Error al intentar guardar' });
        expect(() => createProduct(productMock1 as unknown as CreateProductoDto)).rejects.toThrow(
          new Error('Error al intentar guardar'),
        );
      });
    });
  });

  describe('updateProduct', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockYup.mockReturnValueOnce(productMock1);
        prismaMock.producto.update.mockResolvedValueOnce(productMock1);
      });

      it('debería actualizar un producto', async () => {
        const result = await updateProduct(productMock1 as unknown as UpdateProductoDto);
        expect(prismaMock.producto.update).toHaveBeenCalledWith({
          data: {
            ...omit(productMock1, ['idProducto', 'estado', 'idTipo', 'idMarca']),
            marca: { connect: { idMarca: productMock1.idMarca } },
            tipo: { connect: { idTipoProducto: productMock1.idTipo } },
          },
          where: {
            idProducto: productMock1.idProducto,
          },
        });
        expect(result).toEqual(undefined);
      });

      it('debería guardar sin atributos foraneos tipo y marca', async () => {
        mockYup
          .mockReset()
          .mockClear()
          .mockReturnValueOnce(omit(productMock2, ['idTipo', 'idMarca']));

        const result = await updateProduct(productMock2 as unknown as UpdateProductoDto);
        expect(prismaMock.producto.update).toHaveBeenCalledWith({
          data: {
            ...omit(productMock2, ['idProducto', 'estado', 'idTipo', 'idMarca']),
            marca: undefined,
            tipo: undefined,
          },
          where: {
            idProducto: productMock1.idProducto,
          },
        });
        expect(result).toEqual(undefined);
      });
    });

    describe('cuando es fallido', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockYup.mockReturnValueOnce(productMock1);
        prismaMock.producto.update.mockRejectedValueOnce({ message: 'Error al intentar actualizar' });
      });

      it('debería lanzar un error al intentar actualizar', () => {
        expect(() => updateProduct(productMock1 as unknown as UpdateProductoDto)).rejects.toThrow(
          new Error('Error al intentar actualizar'),
        );
      });
    });
  });

  describe('activeProduct', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.producto.findUnique.mockResolvedValueOnce(productMock1);
        prismaMock.producto.update.mockResolvedValueOnce(productMock1);
      });

      it('debería actualizar el estado de un producto a activo', async () => {
        const result = await activeProduct(productMock1.idProducto as unknown as number);
        expect(prismaMock.producto.update).toHaveBeenCalledWith({
          data: {
            estado: 'ACTIVO',
          },
          where: {
            idProducto: productMock1.idProducto,
          },
        });
        expect(result).toEqual(undefined);
      });
    });

    describe('cuando es fallido', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.producto.findUnique.mockResolvedValueOnce(productMock1);
        prismaMock.producto.update.mockRejectedValueOnce({ message: 'Error al intentar actualizar' });
      });

      it('debería lanzar un error al intentar actualizar el estado', () => {
        expect(() => activeProduct(productMock1.idProducto as unknown as number)).rejects.toThrow(
          new Error('Error al intentar actualizar'),
        );
      });
    });
  });

  describe('inactiveProduct', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.producto.findUnique.mockResolvedValueOnce(productMock1);
        prismaMock.producto.update.mockResolvedValueOnce(productMock1);
      });

      it('debería actualizar el estado de un producto a inactivo', async () => {
        const result = await inactiveProduct(productMock1.idProducto as unknown as number);
        expect(prismaMock.producto.update).toHaveBeenCalledWith({
          data: {
            estado: 'INACTIVO',
          },
          where: {
            idProducto: productMock1.idProducto,
          },
        });
        expect(result).toEqual(undefined);
      });
    });

    describe('cuando es fallido', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.producto.findUnique.mockResolvedValueOnce(productMock1);
        prismaMock.producto.update.mockRejectedValueOnce({ message: 'Error al intentar actualizar' });
      });

      it('debería lanzar un error al intentar actualizar el estado', () => {
        expect(() => inactiveProduct(productMock1.idProducto as unknown as number)).rejects.toThrow(
          new Error('Error al intentar actualizar'),
        );
      });
    });
  });

  describe('deleteProductById', () => {
    describe('cuando es exitoso', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.producto.findUnique.mockResolvedValueOnce(productMock1);
        prismaMock.producto.delete.mockResolvedValueOnce(productMock1);
      });

      it('debería eliminar un producto por su id', async () => {
        const result = await deleteProductById(1);

        expect(prismaMock.producto.findUnique).toHaveBeenCalledWith({
          where: {
            idProducto: 1,
          },
          include: { tipo: true, marca: true },
        });

        expect(prismaMock.producto.delete).toHaveBeenCalledWith({
          where: {
            idProducto: 1,
          },
        });
        expect(result).toEqual(undefined);
      });
    });

    describe('cuando es fallido', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        prismaMock.producto.findUnique.mockResolvedValueOnce(null);
      });

      it('debería lanzar un error al intentar eliminar un producto', () => {
        expect(() => deleteProductById(3)).rejects.toThrow(new Error('No product with id 3 found'));
      });
    });
  });
});
