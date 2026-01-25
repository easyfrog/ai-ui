<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, useSlots } from 'vue'

const props = defineProps<{
  theme?: 'light' | 'dark' | 'deep-blue'
  header?: string
  shadow?: 'always' | 'hover' | 'never'
}>()

const cm = useCssModule()
const slots = useSlots()

const render = () => {
  return (
    <div 
      class={[cm.card, props.shadow ? cm[`shadow-${props.shadow}`] : cm['shadow-always']]}
      data-theme={props.theme}
    >
      {props.header && <div class={cm.header}>{props.header}</div>}
      <div class={cm.body}>
        {slots.default?.()}
      </div>
    </div>
  )
}
</script>

<style module>
.card {
  background-color: var(--bg-component);
  color: var(--text-regular);
  border: 1px solid var(--border-base);
  border-radius: 8px;
  overflow: hidden;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

.shadow-always {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.shadow-hover:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.shadow-never {
  box-shadow: none;
}

.header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-base);
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
}

.body {
  padding: 20px;
}
</style>
