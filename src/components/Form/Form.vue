<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, provide } from 'vue'

const props = defineProps<{
  model: Record<string, any>
  rules?: Record<string, any>
  labelWidth?: string
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const cm = useCssModule()

provide('form', {
  labelWidth: props.labelWidth
})

const render = () => {
  return (
    <form class={cm.form} data-theme={props.theme}>
      {slots.default?.()}
    </form>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.form {
  display: block;
}
</style>
