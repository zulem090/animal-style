import { CreateUsuarioDto } from '@/dto/auth/CreateUsuarioDto';
import { CreateUsuarioResponse } from '@/dto/auth/CreateUsuarioResponse';
import { UsuarioDto } from '@/dto/auth/UsuarioDto';
import { signInEmailPassword, signInEmailUserPassword, signUpUser } from '@/models/authModel';

export class AuthController {
  async createUser(usuario: CreateUsuarioDto, redirection?: boolean): Promise<CreateUsuarioResponse> {
    return (await signUpUser(usuario, redirection)) as CreateUsuarioResponse;
  }

  async login(email?: string, password?: string): Promise<UsuarioDto | null> {
    return await signInEmailPassword(email, password);
  }

  async loginEmailUser(emailOrUsername?: string, password?: string): Promise<UsuarioDto | null> {
    return await signInEmailUserPassword(emailOrUsername, password);
  }
}
