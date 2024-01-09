import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'gql-pdss-surveys-web-client',
      fileName: 'gql-pdss-surveys-web-client'
    }
  },
  plugins: [dts()],
  test: {}
});
