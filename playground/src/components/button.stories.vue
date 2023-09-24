<script setup lang="ts">
import Story from '../../../src/components/story.vue'
import { defineMeta } from '../../../src/composables/use-meta'
import Button from './button.vue'

defineMeta<typeof Button>({
  title: 'Button',
})
</script>

<template>
  <Story title="Primary">
    <Button>Click</Button>
  </Story>
</template>
