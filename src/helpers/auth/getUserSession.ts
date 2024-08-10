import { getServerSession, User as UserSession } from 'next-auth';
import { getAuthOptions } from '@/helpers/auth/authOptions';

export const getUserSession = async (): Promise<UserSession | undefined> => {
  return getServerSession(getAuthOptions()).then((session) => session?.user);
};
