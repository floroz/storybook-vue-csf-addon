import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// create _dirname in ESM

const __dirname = dirname(fileURLToPath(import.meta.url))

const storyPath = path.join(__dirname, './src/components/story.vue')

export default defineConfig({
  plugins: [vue(), dts({
    tsconfigPath: './tsconfig.json',
    include: './src/components/story.vue',
  })],
  build: {
    minify: true,
    outDir: 'dist-vue',
    lib: {
      entry: storyPath,
      formats: ['es', 'cjs'],
      fileName: 'story',
    },
  },
})
