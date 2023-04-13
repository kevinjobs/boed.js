import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  input: './src/index.ts',
  plugins: [
    typescript(),
  ],
  output: [
    {
      name: 'Boed',
      file: 'dist/index.js',
      format: 'umd',
    },
  ]
})