import { ResenaDto } from '@/dto/resena/resenaDto';
import { getProductoResenas } from '@/models/resenaModel';

export class ResenaController {
  async getResenasProducto(idProducto: number): Promise<ResenaDto> {
    return getProductoResenas(idProducto);
  }
}
