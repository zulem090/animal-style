import '@testing-library/jest-dom';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { loadEnvConfig } from '@next/env';
import crypto from 'crypto';
import { createContext } from 'react';
import { TextEncoder, TextDecoder } from 'util';
import nextRouterMock, * as allNextRouterMock from 'next-router-mock';

loadEnvConfig(process.cwd());

Object.assign(global, { TextDecoder, TextEncoder, PrismaAdapter });

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: []) => crypto.randomBytes(arr.length),
  },
});

class MockIntersectionObserver {
  disconnect() {
    return this;
  }

  observe() {
    return this;
  }

  unobserve() {
    return this;
  }
}

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}

// Begin - Mocking Next router
jest.mock('next/router', () => allNextRouterMock);
jest.mock('next/dist/client/router', () => allNextRouterMock);
jest.mock('next/dist/shared/lib/router-context.shared-runtime', () => {
  const RouterContext = createContext(nextRouterMock);

  return { RouterContext };
});

global.beforeEach(() => {
  nextRouterMock.setCurrentUrl('');
});
