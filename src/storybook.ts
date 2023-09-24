import type { StorybookConfig } from '@storybook/vue3-vite'
import type { Indexer } from '@storybook/types'
import vueCsfVitePlugin from './vite'
import { index } from './indexer'

/**
 * Vite Config with ehnanched Vue CSF plugin
 * @param config the Vite config of the project
 * @returns an ehnanched Vite config including the Vue CSF plugin
 */
export const viteFinal: StorybookConfig['viteFinal'] = (config) => {
  config.plugins = config.plugins || []
  config.plugins.unshift(vueCsfVitePlugin({}))
  return config
}

const vueSFCIndexer: Indexer = {
  test: /\.stories\.vue$/,
  index,
}

export const experimental_indexers: StorybookConfig['experimental_indexers'] = existingIndexers => [
  vueSFCIndexer,
].concat(existingIndexers || [])
