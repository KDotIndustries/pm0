import { defineConfig } from 'oxfmt'

export default defineConfig({
  arrowParens: 'avoid',
  jsxSingleQuote: true,
  semi: false,
  singleAttributePerLine: true,
  singleQuote: true,
  sortImports: {
    groups: [
      'builtin',
      'external',
      ['internal', 'subpath'],
      ['parent', 'sibling', 'index'],
      'style',
    ],
    ignoreCase: true,
    internalPattern: ['@/'],
    newlinesBetween: true,
    order: 'asc',
  },
  sortTailwindcss: {
    stylesheet: 'src/styles/global.css',
    functions: ['clsx', 'cn', 'cva', 'tw'],
  },
})
