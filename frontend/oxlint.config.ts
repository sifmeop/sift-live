import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['react', 'typescript', 'import', 'jsx-a11y', 'oxc', 'vitest'],

  categories: {
    correctness: 'error',
    suspicious: 'warn',
    perf: 'warn',
    pedantic: 'off',
    style: 'off',
    restriction: 'off',
    nursery: 'off',
  },

  rules: {
    'react/jsx-pascal-case': 'error',
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
    'react/no-children-prop': 'error',
    'react/no-danger': 'warn',
    'react/no-danger-with-children': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-string-refs': 'error',
    'react/no-unsafe': 'error',
    'react/no-unstable-nested-components': 'warn',
    'react/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off',

    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/interactive-supports-focus': 'warn',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/media-has-caption': 'warn',
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/no-redundant-roles': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',

    'import/no-duplicates': 'error',
    'import/no-cycle': 'warn',
    'import/no-self-import': 'error',
    'import/no-unassigned-import': 'off',

    'typescript/no-floating-promises': 'error',
    'typescript/no-explicit-any': 'warn',
    'typescript/no-unnecessary-condition': 'warn',
    'typescript/no-unsafe-assignment': 'error',
    'typescript/no-unsafe-argument': 'warn',
    'typescript/no-unsafe-call': 'error',
    'typescript/no-unsafe-member-access': 'error',
    'typescript/no-unsafe-return': 'error',

    'oxc/no-accumulating-spread': 'warn',

    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
  env: {
    browser: true,
  },
  ignorePatterns: ['dist', 'node_modules', 'src/app/routeTree.gen.ts'],
})
