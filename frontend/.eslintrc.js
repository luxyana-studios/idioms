// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    'expo',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint'],
  root: true,
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        semi: true,
        printWidth: 80,
        arrowParens: 'always',
      },
    ],
  },
  overrides: [
    // Ensures that Prettier is run automatically with the --fix option
    {
      files: ['*.js', '*.ts', '*.tsx'],
      rules: {
        'prettier/prettier': [
          'error',
          { useTabs: false, semi: true, singleQuote: true },
        ],
      },
    },
    // Allows `require` imports in expo files
    {
      files: ['metro.config.js', 'tailwind.config.js'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ],
};
