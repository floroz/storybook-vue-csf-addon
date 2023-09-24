<script setup lang="ts">
import { defineComponent } from 'vue'
import { defineMeta } from '../../composables/use-meta'
import Story from '../../components/story.vue'
import { click } from './mock-helpers'

const Button = defineComponent({
  name: 'BButton',
  props: ['label', 'items'],
  events: ['click'],
  template: '<button>{{$props.label}}</button>',
})

defineMeta<typeof Button>({
  title: 'Components/Button',
  // currently not used, necessary for the future to infer component type with
  // additional Volar support
  component: Button,
  args: {
    label: 'Click',
    items: ['a', 1, true, [], {}], // testing different data structures
    onClick: click, // to test using an imported function in args
  },
})

function sum(a: number, b: number) {
  return a + b
}
</script>

<template>
  <Story title="Primary" :component="Button" :args="{ label: 'Custom' }">
    <template #default="{ args }">
      <Button v-bind="args" />
    </template>
  </Story>
  <Story title="Sum">
    <div>
      <p>Sum: {{ sum(1, 2) }}</p>
    </div>
  </Story>
</template>
