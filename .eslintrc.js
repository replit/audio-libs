module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint'],
  plugins: ['@typescript-eslint', 'prettier'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: false, peerDependencies: true },
    ],
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      {
        ts: 'never',
      },
    ],
    indent: 'off',
    'max-len': ['error', { code: 120 }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^ignore',
      },
    ],
    'operator-linebreak': 'off',
    'no-param-reassign': ['error', { props: false }],
    'object-curly-newline': 'off',
    'no-plusplus': 'off',
    'newline-before-return': 'error',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
  },
  globals: {
    BigInt: true,
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.+(ts|tsx|js)'],
      env: {
        'jest/globals': true,
      },
      plugins: ['jest'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true, peerDependencies: true },
        ],
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      },
    },
  ],
};
