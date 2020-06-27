module.exports = {
  extends: [
    '@side/base',
    '@side/prettier',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:jsdoc/recommended',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-console': 0,
    'jsdoc/require-returns-type': 0,
    'jsdoc/require-param-type': 0,
  },
};
