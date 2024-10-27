'use server';

import { getUserSession } from '@/helpers/auth/getUserSession';
import prisma from '@/orm/prisma';
import { Prisma, User } from '@prisma/client';
import { User as UserSession } from 'next-auth';

const verifyUser = async (userId?: string): Promise<User> => {
  const user: User | null = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error(`No user with id ${userId} found`);

  return user;
};

export async function updatePersonalInfo({ direccion, telefono }: Pick<User, 'direccion' | 'telefono'>): Promise<void> {
  try {
    const session: UserSession | undefined = await getUserSession();

    const currentUserInfo = await verifyUser(session?.id);

    if (currentUserInfo.direccion === direccion && Number(currentUserInfo.telefono) === Number(telefono)) {
      return;
    }

    const data: Prisma.UserUpdateInput = { direccion, telefono };

    await prisma.user.update({ data, where: { id: session!.id } });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
