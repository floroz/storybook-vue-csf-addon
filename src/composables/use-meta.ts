import type { Meta } from '@storybook/vue3'
import { inject, provide } from 'vue'
import { getMetaInjectionToken } from '../constants/meta-token'

/**
 *  Defines the meta object for the current SFC.
 * @param meta The meta object to define
 */
export function defineMeta<TComponent>(meta: Meta<TComponent>): void {
  if (!meta.title)
    throw new Error('Meta title is required')

  provide(getMetaInjectionToken<TComponent>(), meta)
}

/**
 * Gets the meta object for the current SFC within a single Story.
 * @returns {Meta<TComponent>} The meta object
 */
export function useMeta<TComponent>() {
  const meta = inject(getMetaInjectionToken<TComponent>())
  if (!meta)
    throw new Error('Meta is not defined')

  return meta
}
