import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import tsConfig   from './tsconfig.json';

const jestConfig: JestConfigWithTsJest = {

  'preset': 'ts-jest',
  'testEnvironment': 'node',
  'transform': {
    'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest'
  },
  'transformIgnorePatterns': [
    'node_modules/(?!variables/.*)'
  ],

  testMatch: ['<rootDir>/**/*Test.ts'],

  //passing the tsconfig-paths/register paths 
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths),
  modulePaths: [`<rootDir>/${tsConfig.compilerOptions.baseUrl}`],  


};

export default jestConfig;