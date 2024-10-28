import { Marca } from '@prisma/client';

export interface MarcaDto extends Omit<Marca, 'idMarca'> {
  idMarca: number;
}
