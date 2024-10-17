import { Prisma, Producto } from '@prisma/client';
import { ProductController } from './productController';
import { CreateProductoDto } from '@/dto/producto/createProductoDto';
import { UpdateProductoDto } from '@/dto/producto/editProductoDto';

const productMock1: Producto = {
  idProducto: 1 as unknown as BigInt,
  nombre: 'Producto 1',
  descripcion: 'Producto 1',
  cantidad: 1,
  precio: 100 as unknown as Prisma.Decimal,
  idMarca: 1 as unknown as BigInt,
  idTipo: 1 as unknown as BigInt,
  estado: 'ACTIVO',
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

const modelMock = {
  getProductById: jest.fn().mockResolvedValue(productMock1),
  getAllProducts: jest.fn().mockResolvedValue(productsMock),
  createProduct: jest.fn().mockResolvedValue(undefined),
  deleteProductById: jest.fn().mockResolvedValue(undefined),
  updateProduct: jest.fn().mockResolvedValue(undefined),
  activeProduct: jest.fn().mockResolvedValue(undefined),
  inactiveProduct: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@/models/productModel', () => ({
  getAllProducts: (...args: unknown[]) => modelMock.getAllProducts(...args),
  createProduct: (...args: unknown[]) => modelMock.createProduct(...args),
  getProductById: (...args: unknown[]) => modelMock.getProductById(...args),
  deleteProductById: (...args: unknown[]) => modelMock.deleteProductById(...args),
  updateProduct: (...args: unknown[]) => modelMock.updateProduct(...args),
  activeProduct: (...args: unknown[]) => modelMock.activeProduct(...args),
  inactiveProduct: (...args: unknown[]) => modelMock.inactiveProduct(...args),
}));

describe('ProductController', () => {
  const controller = new ProductController();
  const idProducto: number = Number(productMock1.idProducto);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe obtener un producto por el id', async () => {
    const response = await controller.getById(idProducto);

    expect(modelMock.getProductById).toHaveBeenCalled();
    expect(modelMock.getProductById).toHaveBeenCalledWith(idProducto);
    expect(response).toEqual(productMock1);
  });

  it('debe obtener todos los productos', async () => {
    const response = await controller.getAll(0, 10);

    expect(modelMock.getAllProducts).toHaveBeenCalled();
    expect(modelMock.getAllProducts).toHaveBeenCalledWith(0, 10, undefined);
    expect(response).toEqual(productsMock);
  });

  it('debe crear un producto', async () => {
    const createProductDto: CreateProductoDto = {
      ...productMock1,
      idProducto: undefined,
    } as unknown as CreateProductoDto;

    const response = await controller.create(createProductDto);

    expect(modelMock.createProduct).toHaveBeenCalled();
    expect(modelMock.createProduct).toHaveBeenCalledWith(createProductDto);
    expect(response).toEqual(undefined);
  });

  it('debe actualizar un producto', async () => {
    const updateProductDto: UpdateProductoDto = { ...productMock1 } as unknown as UpdateProductoDto;

    const response = await controller.update(updateProductDto);

    expect(modelMock.updateProduct).toHaveBeenCalled();
    expect(modelMock.updateProduct).toHaveBeenCalledWith(updateProductDto);
    expect(response).toEqual(undefined);
  });

  it('debe obtener todos los productos por nombre', async () => {
    const response = await controller.getAll(0, 10, 'nombreProducto');

    expect(modelMock.getAllProducts).toHaveBeenCalled();
    expect(modelMock.getAllProducts).toHaveBeenCalledWith(0, 10, 'nombreProducto');
    expect(response).toEqual(productsMock);
  });

  it('debe activar un producto por el id', async () => {
    const response = await controller.activeById(idProducto);

    expect(modelMock.activeProduct).toHaveBeenCalled();
    expect(modelMock.activeProduct).toHaveBeenCalledWith(idProducto);
    expect(response).toEqual(undefined);
  });

  it('debe inactivar un producto por el id', async () => {
    const response = await controller.inactiveById(idProducto);

    expect(modelMock.inactiveProduct).toHaveBeenCalled();
    expect(modelMock.inactiveProduct).toHaveBeenCalledWith(idProducto);
    expect(response).toEqual(undefined);
  });

  it('debe eliminar un producto por el id', async () => {
    const response = await controller.deleteById(idProducto);

    expect(modelMock.deleteProductById).toHaveBeenCalled();
    expect(modelMock.deleteProductById).toHaveBeenCalledWith(idProducto);
    expect(response).toEqual(undefined);
  });
});
