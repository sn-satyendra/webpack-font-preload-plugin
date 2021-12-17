module.exports = {
  testEnvironment: "node",
  testRegex: ".*.test\\.(js)$",
  collectCoverage: true,
  collectCoverageFrom: ["**/src/*.js", "!**/node_modules/**"],
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
};
