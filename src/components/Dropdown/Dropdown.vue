<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, provide } from 'vue'

const props = defineProps<{
  theme?: string
}>()

const visible = ref(false)
const cm = useCssModule()
let timer: any = null

const handleMouseEnter = () => {
  if (timer) clearTimeout(timer)
  visible.value = true
}

const handleMouseLeave = () => {
  timer = setTimeout(() => {
    visible.value = false
  }, 100)
}

const handleItemClick = () => {
  visible.value = false
}

provide('dropdown', {
  handleItemClick
})

const render = () => {
  return (
    <div 
      class={cm.dropdown} 
      data-theme={props.theme}
      onMouseenter={handleMouseEnter}
      onMouseleave={handleMouseLeave}
    >
      <div class={cm.trigger}>
        {slots.default?.()}
      </div>
      <Transition name="fade">
        {visible.value && (
          <div class={cm.content}>
            {slots.content?.()}
          </div>
        )}
      </Transition>
    </div>
  )
}

import { useSlots, Transition } from 'vue'
const slots = useSlots()
</script>

<style module>
.dropdown {
  position: relative;
  display: inline-block;
}

.trigger {
  display: inline-block;
}

.content {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 10px;
  background-color: var(--bg-component);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  z-index: 10;
  min-width: 100px;
  padding: 5px 0;
}
</style>