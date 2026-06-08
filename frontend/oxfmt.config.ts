import { defineConfig } from 'oxfmt'

export default defineConfig({
  semi: false,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  arrowParens: 'always',
  bracketSpacing: true,
  bracketSameLine: false,
  quoteProps: 'as-needed',
  endOfLine: 'lf',
  sortImports: true,
  sortTailwindcss: true,
  sortPackageJson: true,
  ignorePatterns: ['src/app/routeTree.gen.ts'],
})
