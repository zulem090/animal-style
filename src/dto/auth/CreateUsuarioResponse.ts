import { Error } from '../error/error';
import { CreateUsuarioDto } from './CreateUsuarioDto';

export interface CreateUsuarioResponse {
  data?: CreateUsuarioDto;
  error?: Error;
}
