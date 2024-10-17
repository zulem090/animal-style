import { ProductoDto } from '@/dto/producto/productoDto';
import { Producto } from '@prisma/client';
import imageType from 'image-type';
import { toProductoDto } from './toProductoDto';

// Mock de la función imageType
jest.mock('image-type', () => jest.fn());

describe('toProductoDto', () => {
  const mockProducto: Producto = {
    idProducto: BigInt(1),
    nombre: 'Producto de prueba',
    precio: 100.5 as any, // Si usas Prisma.Decimal, lo puedes mockear como sea necesario
    cantidad: 10,
    descripcion: 'Descripción del producto',
    estado: 'disponible',
    imagen: Buffer.from('imagen de prueba'),
    idTipo: BigInt(1),
    idMarca: BigInt(2),
  };

  const mockTipo = { nombre: 'Tipo de prueba' };
  const mockMarca = { nombre: 'Marca de prueba' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toProductoDto', () => {
    it('debería convertir Producto a ProductoDto con todos los campos', async () => {
      // Mockeamos imageType para devolver un mime válido
      (imageType as jest.Mock).mockResolvedValue({ mime: 'image/jpeg' });

      const result: ProductoDto = await toProductoDto({
        ...mockProducto,
        tipo: mockTipo,
        marca: mockMarca,
      });

      expect(result).toEqual({
        idProducto: Number(mockProducto.idProducto),
        cantidad: mockProducto.cantidad,
        descripcion: mockProducto.descripcion,
        nombre: mockProducto.nombre,
        precio: Number(mockProducto.precio),
        imagen: `data:image/jpeg;base64,${mockProducto.imagen?.toString('base64')}`,
        estado: mockProducto.estado,
        idMarca: Number(mockProducto.idMarca),
        idTipo: Number(mockProducto.idTipo),
        tipo: mockTipo.nombre,
        marca: mockMarca.nombre,
      });
    });

    it('debería manejar campos opcionales como undefined si no están presentes', async () => {
      (imageType as jest.Mock).mockResolvedValue(undefined);

      const result: ProductoDto = await toProductoDto({
        ...mockProducto,
        idMarca: null,
        idTipo: null,
        imagen: null,
        tipo: null,
        marca: null,
      });

      expect(result).toEqual({
        idProducto: Number(mockProducto.idProducto),
        cantidad: mockProducto.cantidad,
        descripcion: mockProducto.descripcion,
        nombre: mockProducto.nombre,
        precio: Number(mockProducto.precio),
        imagen: undefined,
        estado: mockProducto.estado,
        idMarca: Number(null),
        idTipo: Number(null),
        tipo: undefined,
        marca: undefined,
      });
    });
  });
});
