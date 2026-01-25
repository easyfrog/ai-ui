<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, inject } from 'vue'

const props = defineProps<{
  disabled?: boolean
  divided?: boolean
  theme?: string
}>()

const emit = defineEmits(['click'])
const cm = useCssModule()
const dropdown = inject<any>('dropdown', {})

const handleClick = (e: MouseEvent) => {
  if (props.disabled) return
  emit('click', e)
  dropdown.handleItemClick?.()
}

const render = () => {
  return (
    <div 
      class={[
        cm.item, 
        props.disabled && cm.disabled,
        props.divided && cm.divided
      ]}
      onClick={handleClick}
    >
      {slots.default?.()}
    </div>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.item {
  list-style: none;
  line-height: 36px;
  padding: 0 20px;
  margin: 0;
  font-size: 14px;
  color: var(--text-regular);
  cursor: pointer;
  outline: none;
  white-space: nowrap;
}

.item:hover {
  background-color: var(--bg-component-hover);
  color: var(--color-primary);
}

.disabled {
  cursor: not-allowed;
  color: var(--text-secondary);
  pointer-events: none;
}

.divided {
  border-top: 1px solid var(--border-base);
  margin-top: 6px;
}
</style>