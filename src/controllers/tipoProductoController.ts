import { TipoProductoDto } from '@/dto/tipoProducto/tipoProductoDto';
import { getAllTipoProductos } from '@/models/tipoProductoModel';

export class TipoProductController {
  async getAll(): Promise<TipoProductoDto[]> {
    return getAllTipoProductos();
  }
}
