<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, inject } from 'vue'

const props = defineProps<{
  to?: string
}>()

const cm = useCssModule()
const breadcrumb = inject<any>('breadcrumb')

const render = () => {
  return (
    <span class={cm.item}>
      <span class={[cm.link, props.to && cm.isLink]}>
        {slots.default?.()}
      </span>
      <span class={cm.separator}>{breadcrumb.separator}</span>
    </span>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.item {
  display: flex;
  align-items: center;
}

.item:last-child .separator {
  display: none;
}

.link {
  font-weight: 700;
  text-decoration: none;
  transition: color .2s cubic-bezier(.645,.045,.355,1);
  color: var(--text-regular);
}

.isLink:hover {
  color: var(--color-primary);
  cursor: pointer;
}

.separator {
  margin: 0 9px;
  font-weight: 700;
  color: var(--text-placeholder);
}
</style>