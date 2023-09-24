import type { Meta } from '@storybook/vue3'

export interface Options {
  // define your plugin options here
}

export interface ParsedStory {
  id: string
  title: string
  args: Record<string, unknown>
  template: string
}

export type ParsedMeta<TComponent = unknown> = Pick<Meta<TComponent>, 'title' | 'args' | 'component' >
