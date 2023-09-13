# storybook-vue-csf-addon

[![NPM version](https://img.shields.io/npm/v/storybook-vue-csf-addon?color=a1b858&label=)](https://www.npmjs.com/package/storybook-vue-csf-addon)

Starter template for [unplugin](https://github.com/unjs/unplugin).

## Template Usage

To use this template, clone it down using:

```bash
npx degit unplugin/storybook-vue-csf-addon my-unplugin
```

And do a global replacement of `storybook-vue-csf-addon` with your plugin name.

Then you can start developing your unplugin 🔥

To test your plugin, run: `pnpm run dev`
To release a new version, run: `pnpm run release`

## Install

```bash
npm i storybook-vue-csf-addon
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Starter from 'storybook-vue-csf-addon/vite'

export default defineConfig({
  plugins: [
    Starter({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Starter from 'storybook-vue-csf-addon/rollup'

export default {
  plugins: [
    Starter({ /* options */ }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('storybook-vue-csf-addon/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['storybook-vue-csf-addon/nuxt', { /* options */ }],
  ],
})
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('storybook-vue-csf-addon/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import Starter from 'storybook-vue-csf-addon/esbuild'

build({
  plugins: [Starter()],
})
```

<br></details>
