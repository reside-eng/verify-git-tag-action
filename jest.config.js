module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ['lcov', 'json-summary'],
  verbose: true,
  modulePathIgnorePatterns: ['<rootDir>/aut/'],
};
