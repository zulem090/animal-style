import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import prisma from '@/orm/prisma';

jest.mock('@auth/prisma-adapter', () => ({
  __esModule: true,
  ...jest.requireActual('@auth/prisma-adapter'),
}));

// jest.mock('@auth/prisma-adapter');
// jest.mock('@auth/prisma-adapter', () => ({
//   PrismaAdapter: jest.fn(),
// }));

// (PrismaAdapter as jest.Mock).mockReturnValue({});

jest.mock('@/orm/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
