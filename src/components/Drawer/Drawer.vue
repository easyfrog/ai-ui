<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, Teleport, Transition } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
  direction?: 'ltr' | 'rtl' | 'ttb' | 'btt'
  size?: string
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['update:modelValue', 'close'])

const cm = useCssModule()

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const render = () => {
  const direction = props.direction || 'rtl'
  const size = props.size || '30%'

  const style: any = {}
  if (direction === 'rtl' || direction === 'ltr') {
    style.width = size
  } else {
    style.height = size
  }
  
  // Determine transition name based on direction
  const transitionName = `drawer-slide-${direction}`

  return (
    <Teleport to="body">
      <Transition name="drawer-fade">
        {props.modelValue && (
          <div class={cm.overlay} data-theme={props.theme} onClick={handleClose}>
            <Transition name={transitionName} appear>
               <div 
                class={[cm.drawer, cm[direction], 'drawer-content']} 
                style={style}
                onClick={(e) => e.stopPropagation()}
              >
                 <header class={cm.header}>
                   <span class={cm.title}>{props.title}</span>
                   <button class={cm.closeBtn} onClick={handleClose}>×</button>
                 </header>
                 <section class={cm.body}>
                   {slots.default?.()}
                 </section>
              </div>
            </Transition>
          </div>
        )}
      </Transition>
    </Teleport>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.drawer {
  position: absolute;
  background-color: var(--bg-overlay);
  box-shadow: 0 8px 10px -5px rgba(0,0,0,.2), 0 16px 24px 2px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12);
  transition: all .3s;
  display: flex;
  flex-direction: column;
}

.rtl {
  right: 0;
  top: 0;
  bottom: 0;
}

.ltr {
  left: 0;
  top: 0;
  bottom: 0;
}

.ttb {
  top: 0;
  left: 0;
  right: 0;
}

.btt {
  bottom: 0;
  left: 0;
  right: 0;
}

.header {
  align-items: center;
  color: var(--text-primary);
  display: flex;
  margin-bottom: 32px;
  padding: 20px 20px 0;
}

.title {
  margin: 0;
  flex: 1;
  line-height: inherit;
  font-size: 1rem;
}

.closeBtn {
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 20px;
  color: var(--text-secondary);
}

.body {
  flex: 1;
  padding: 20px;
  overflow: auto;
  color: var(--text-regular);
}
</style>
