import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import inspect from 'vite-plugin-inspect'
import vuePluginCsf from '../src/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [inspect(), vuePluginCsf(), vue()],
})
