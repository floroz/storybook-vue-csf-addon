import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import unpluginVueCsf from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    unpluginVueCsf(),
  ],
})
