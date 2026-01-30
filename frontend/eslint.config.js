import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
  eslint.configs.recommended,
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json', // ONLY for TS files
      },
    },
    plugins: {
      prettier,
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript compiler handles these; disable base rules for TS files
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
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
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // NOTE: No `project` here — avoids the babel.config.js error
      },
    },
  },
  {
    files: ['metro.config.cjs', 'tailwind.config.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['*.config.js'],
    languageOptions: {
      globals: {
        module: true,
        require: true,
        __dirname: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script', // CommonJS-style
      },
    },
  },
];
