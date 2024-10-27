import { updatePersonalInfo } from '@/models/userModel';
import { User } from '@prisma/client';

export class UserController {
  async changePersonalInfo(infoData: Pick<User, 'direccion' | 'telefono'>): Promise<void> {
    await updatePersonalInfo(infoData);
  }
}
