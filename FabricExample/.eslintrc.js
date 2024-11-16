module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: [
    'babel.config.js',
    '.eslintrc.js',
    'jest.config.js',
    'metro.config.js',
  ],
};
