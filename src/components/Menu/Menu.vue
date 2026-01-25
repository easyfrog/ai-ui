<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, provide, ref, computed } from 'vue'

const props = defineProps<{
  defaultActive?: string
  mode?: 'horizontal' | 'vertical'
  collapse?: boolean
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['select'])
const cm = useCssModule()
const activeIndex = ref(props.defaultActive)

const handleSelect = (index: string) => {
  activeIndex.value = index
  emit('select', index)
}

provide('menu', {
  activeIndex,
  handleSelect,
  mode: props.mode || 'vertical',
  collapse: computed(() => props.collapse)
})

const render = () => {
  return (
    <ul 
      class={[
        cm.menu, 
        cm[props.mode || 'vertical'],
        props.collapse && cm.collapsed
      ]} 
      data-theme={props.theme}
    >
      {slots.default?.()}
    </ul>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.menu {
  list-style: none;
  position: relative;
  margin: 0;
  padding-left: 0;
  background-color: var(--bg-component);
  box-sizing: border-box;
  color: var(--text-regular);
  border-right: 1px solid var(--border-base);
}

.horizontal {
  display: flex;
  border-right: none;
  border-bottom: 1px solid var(--border-base);
  height: 60px;
}

.vertical {
  width: 240px; /* Default width */
  transition: width 0.3s;
}

.collapsed {
  width: 64px;
}
</style>
