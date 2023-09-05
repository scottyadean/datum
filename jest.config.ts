import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  projects: ['<rootDir>/src/tests/*'],
  collectCoverage: false,
  testEnvironment: 'node',
  testPathIgnorePatterns: [ '/node_modules/' ]
};

export default config;