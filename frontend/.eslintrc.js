// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
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
  // Ensures that Prettier is run automatically with the --fix option
  overrides: [
    {
      files: ['*.js', '*.ts', '*.tsx'],
      rules: {
        'prettier/prettier': [
          'error',
          { useTabs: false, semi: true, singleQuote: true },
        ],
      },
    },
  ],
};
