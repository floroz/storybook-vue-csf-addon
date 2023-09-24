<script setup lang="ts" generic="TComponent = unknown">
import type { Meta } from '@storybook/vue3'
import { useMeta } from '../composables/use-meta'

defineProps<{
  // This is required to obtain the type information on a single story
  // in the future, we can hopefully find a way for Volar to infer this from the `defineMeta` call?
  component?: TComponent
  title: string
  argTypes?: Meta<TComponent>['argTypes']
  args?: Meta<TComponent>['args']
  parameters?: Meta<TComponent>['parameters']
  // TODO: consider how the API for `play` should look like in a SFC
  // play?: Meta<TComponent>['play']
}>()

defineSlots<{
  default: (props: {
    args: Meta<TComponent>['args']
  }) => any
}>()

const meta = useMeta<TComponent>()
</script>

<template>
  <slot :args="meta.args" />
</template>
