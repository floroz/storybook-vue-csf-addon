import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { transform } from './transformer/transform'

export const unpluginFactory: UnpluginFactory<Options | undefined> = _options => ({
  name: 'storybook-vue-csf-addon',
  transformInclude(id) {
    return id.endsWith('.stories.vue')
  },
  transform(code) {
    return transform(code)
  },
})

export const vueCsfUnplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default vueCsfUnplugin
