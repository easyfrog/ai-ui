<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, useSlots } from 'vue'

const props = defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'large' | 'default' | 'small'
  truncated?: boolean
  bold?: boolean
  theme?: string
}>()

const cm = useCssModule()
const slots = useSlots()

const render = () => {
  return (
    <span class={[
      cm.text, 
      cm[props.type || 'default'], 
      cm[props.size || 'default'],
      props.truncated && cm.truncated
    ]} data-theme={props.theme}>
      {slots.default?.()}
    </span>
  )
}
</script>

<style module>
.text {
  font-size: 14px;
  color: var(--text-regular);
  display: inline-block;
}

.truncated {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.large { font-size: 16px; }
.small { font-size: 12px; }

.bold { font-weight: bold; }

.primary { color: var(--color-primary); }
.success { color: var(--color-success); }
.warning { color: var(--color-warning); }
.danger { color: var(--color-danger); }
.info { color: var(--text-secondary); }
</style>
