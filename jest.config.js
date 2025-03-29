/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      diagnostics: {
        ignoreCodes: [151001]
      }
    }]
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.spec.ts',
    '!src/**/test-helpers/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'clover',
    'html'
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    },
    './src/lib/config/index.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/lib/errors/index.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/lib/formatters/index.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  verbose: false,
  bail: 1,
  maxWorkers: '50%', // Limite le nombre de workers pour des exécutions plus rapides
  cache: true,
  cacheDirectory: '.jest-cache',
  testTimeout: 10000
} 