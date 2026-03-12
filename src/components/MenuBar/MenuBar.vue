<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, useSlots } from 'vue'

const props = defineProps<{
  theme?: string
}>()

const cm = useCssModule()
const slots = useSlots()

const render = () => {
  return (
    <div class={cm.menubar} data-theme={props.theme}>
      <div class={cm.left}>
        {slots.left?.()}
      </div>
      <div class={cm.right}>
        {slots.right?.()}
      </div>
    </div>
  )
}
</script>

<style module>
.menubar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: var(--bg-component);
  border-bottom: 1px solid var(--border-base);
  padding: 0 20px;
  box-sizing: border-box;
}

.left {
  flex: 1;
}

.right {
  display: flex;
  align-items: center;
}
</style>
