import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { transform } from './transformer'
import { logger } from './logger'

const STORIES_INTERNAL_SUFFIX = '?vue&type=stories'
const STORIES_PUBLIC_SUFFIX = '.stories.vue'

export const unpluginFactory: UnpluginFactory<Options | undefined> = _options => ({
  name: 'storybook-vue-csf-addon',
  enforce: 'pre',
  async resolveId(source, importer, options) {
    // logger.debug('resolveId', source)
    if (source.endsWith(STORIES_PUBLIC_SUFFIX)) {
      // Determine what the actual entry would have been. We need "skipSelf" to avoid an infinite loop.
      // @ts-expect-error: not yet exposed -- https://github.com/unjs/unplugin/issues/47

      const resolution = (await this.resolve(source, importer, {
        skipSelf: true,
        ...options,
      })) as { id: string; external: boolean }

      // If it cannot be resolved or is external, just return it so that Rollup can display an error
      if (!resolution || resolution.external)
        return resolution

      // We append a custom "type" so that the vue plugin is not handling the import
      resolution.id = resolution.id + STORIES_INTERNAL_SUFFIX

      logger.debug(`Resolving ${source} to ${resolution.id}`)
      return resolution
    }
  },
  transformInclude(id) {
    // logger.debug('transformInclude', id)
    return id.endsWith(STORIES_INTERNAL_SUFFIX)
  },
  transform(code, id) {
    logger.debug('transform', id)
    return transform(code)
  },
})

export const vueCsfUnplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export { defineMeta } from './composables/use-meta'

export default vueCsfUnplugin
