// @ts-check
import nestjsTyped from '@darraghor/eslint-plugin-nestjs-typed'
import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier/recommended'
import sonarjs from 'eslint-plugin-sonarjs'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'eslint.config.mjs'],
  },

  js.configs.recommended,

  ...tseslint.configs.strictTypeChecked,

  prettier,

  {
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
      sonarjs,
      '@darraghor/nestjs-typed': nestjsTyped,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      'import/resolver': {
        typescript: true,
      },
    },

    rules: {
      // TypeScript safety
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      // Imports
      'import/order': 'off',

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off',

      // Code quality
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/no-identical-functions': 'error',

      // NestJS safety
      '@darraghor/nestjs-typed/injectable-should-be-provided': 'error',
      // '@darraghor/nestjs-typed/module-boundaries': 'error',

      // Node style
      'no-console': 0,
      'prettier/prettier': 0,
    },
  },
)
