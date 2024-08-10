import { CreateProductoDto } from '@/dto/producto/createProductoDto';
import { UpdateProductoDto } from '@/dto/producto/editProductoDto';
import { ProductoDto } from '@/dto/producto/productoDto';
import {
  getAllProducts,
  createProduct,
  getProductById,
  deleteProductById,
  updateProduct,
  activeProduct,
  inactiveProduct,
} from '@/models/productModel';

export class ProductController {
  async getById(productId: number): Promise<ProductoDto> {
    return getProductById(productId);
  }

  async getAll(offset: number, limit: number, nombre?: string): Promise<ProductoDto[]> {
    return getAllProducts(offset, limit, nombre);
  }

  async create(product: CreateProductoDto): Promise<void> {
    await createProduct(product);
  }

  async update(product: UpdateProductoDto): Promise<void> {
    await updateProduct(product);
  }

  async activeById(productId: number): Promise<void> {
    await activeProduct(productId);
  }

  async inactiveById(productId: number): Promise<void> {
    await inactiveProduct(productId);
  }

  async deleteById(productId: number): Promise<void> {
    await deleteProductById(productId);
  }
}
