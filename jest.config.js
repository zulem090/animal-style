const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './src',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: ['<rootDir>'],
  testEnvironment: 'jest-environment-jsdom',
  coverageReporters: ['json', 'cobertura', 'lcov', 'text'],
  testMatch: ['<rootDir>/src/**/*.spec.ts?(x)', '<rootDir>/src/**/*.test.tsx?(x)'],
  coverageDirectory: 'coverage/summary',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@auth/prisma-adapter$': '<rootDir>/node_modules/@auth/prisma-adapter/$1',
    uuid: require.resolve('uuid'),
    'image-type': require.resolve('image-type'),
    'file-type': require.resolve('file-type'),
    'token-types': require.resolve('token-types'),
    'peek-readable': require.resolve('peek-readable'),
    strtok3: require.resolve('peek-readable'),
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  clearMocks: true,
  testTimeout: 20000,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
async function jestConfig() {
  const nextJestConfig = await createJestConfig(customJestConfig)();

  // See https://github.com/vercel/next.js/issues/35634 for why we update transformIgnorePatterns this way.
  // /node_modules/ is the first pattern
  // nextJestConfig.transformIgnorePatterns[0] = `<rootDir>/node_modules/(?!(date-fns/|uuid/))`;
  nextJestConfig.transformIgnorePatterns[0] = `<rootDir>/node_modules/(?!(date-fns/|uuid/|openid-client/|next-auth/|@panva/|preact-render-to-string/|preact/|@auth/prisma-adapter/|image-type/|file-type/|token-types/|peek-readable/|strtok3/))`;
  // nextJestConfig.transformIgnorePatterns[0] = `<rootDir>/node_modules/(?!(date-fns/|uuid/|openid-client/|next-auth/|@panva/|preact-render-to-string/|preact/|image-type/))`;

  return nextJestConfig;
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// {/* module.exports = createJestConfig(customJestConfig); */}
module.exports = jestConfig;
