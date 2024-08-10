import { MarcaDto } from '@/dto/marca/marcaDto';
import { getAllMarcas } from '@/models/marcaModel';

export class MarcaController {
  async getAll(): Promise<MarcaDto[]> {
    return getAllMarcas();
  }
}
