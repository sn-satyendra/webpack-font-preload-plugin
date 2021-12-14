module.exports = {
  testEnvironment: "node",
  testRegex: ".*.test\\.(js)$",
  collectCoverage: true,
  collectCoverageFrom: ["**/src/*.js", "!**/node_modules/**"],
  coverageDirectory: "./coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  coverageReporters: ["cobertura", "html", "lcov"],
  moduleFileExtensions: ["js"],
  bail: true,
};
