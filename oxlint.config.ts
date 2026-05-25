import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['react', 'react-perf', 'jsx-a11y', 'import', 'node', 'promise', 'vitest'],
  options: {
    typeAware: true,
    typeCheck: true,
  },
  rules: {
    'typescript/no-unused-vars': 'off',
  },
})
