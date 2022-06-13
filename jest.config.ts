import path from 'path'
import type { Config } from '@jest/types'
import { defaults } from 'jest-config'

const config: Config.InitialOptions = {
  testEnvironment: "node",
  testRegex: ".*.test\\.(ts)$",
  collectCoverage: true,
  collectCoverageFrom: ["**/src/*.ts", "!**/node_modules/**"],
  coverageDirectory: "./coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageReporters: ["cobertura", "html", "lcov"],
  bail: true,
  verbose: true,
  rootDir: path.resolve(__dirname, './'),
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'js'],
  preset: '<rootDir>/node_modules/ts-jest'
}

export default config