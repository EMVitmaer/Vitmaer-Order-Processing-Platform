// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import * as eslintPluginImport from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'indent': ['error', 2, { SwitchCase: 1 }],
      'max-len': ['error', { 'code': 100, 'tabWidth': 2, 'ignoreUrls': true }],
      'quotes': ['error', 'single', { 'avoidEscape': true }],
      'operator-linebreak': ['error', 'before'],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1, 'maxBOF': 0 }],
      'space-infix-ops': ['error'],
      'semi': ['error', 'always'],
      'import/first': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/order': ['error', {
        groups: [['builtin', 'external'], ['internal'], 'parent', 'sibling'],
        'newlines-between': 'always',
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
      }],
      'space-in-parens': ['error', 'never'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-blocks': ['error', 'always'],
      'keyword-spacing': ['error', { before: true, after: true }],
      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      }],
      'object-curly-spacing': ['error', 'always', { objectsInObjects: false }],
      'eol-last': ['error', 'always'],
    },
  },
  {
    plugins: {
      'import': eslintPluginImport,
    },
  }, 
);
