import type { InjectionKey } from 'vue'
import type { Meta } from '@storybook/vue3'

/**
 *  Generates a Symbol used as a key for the meta injection
 * @returns {InjectionKey<Meta<T>>} A Symbol used as a key for the meta injection
 */
export const getMetaInjectionToken: <T>() => InjectionKey<Meta<T>> = () => Symbol.for('meta')
