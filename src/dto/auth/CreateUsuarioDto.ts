import { UsuarioDto } from './UsuarioDto';

export interface CreateUsuarioDto extends Omit<UsuarioDto, 'id'> {}
