// module.exports = {
//   // preset: 'ts-jest',
//   moduleFileExtensions: ['js', 'ts'],
//   testEnvironment: 'node',
//   testRunner: 'jest-circus/runner',
//   transform: {
//     '^.+\\.ts$': 'ts-jest',
//   },
//   verbose: true,
// };
module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
};
