<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, provide } from 'vue'

const props = defineProps<{
  separator?: string
  theme?: string
}>()

const cm = useCssModule()

provide('breadcrumb', {
  separator: props.separator || '/'
})

const render = () => {
  return (
    <div class={cm.breadcrumb} data-theme={props.theme}>
      {slots.default?.()}
    </div>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.breadcrumb {
  display: flex;
  font-size: 14px;
  line-height: 1;
}
</style>