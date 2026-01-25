<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, Teleport, Transition } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
  width?: string
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['update:modelValue', 'close'])

const cm = useCssModule()

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const render = () => {
  return (
    <Teleport to="body">
      <Transition name="dialog-fade">
        {props.modelValue && (
          <div class={cm.overlay} data-theme={props.theme} onClick={handleClose}>
            <div 
              class={[cm.dialog, 'dialog-content']}
              style={{ width: props.width || '50%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div class={cm.header}>
                <span class={cm.title}>{props.title}</span>
                <button class={cm.closeBtn} onClick={handleClose}>×</button>
              </div>
              <div class={cm.body}>
                {slots.default?.()}
              </div>
              {slots.footer && (
                <div class={cm.footer}>
                  {slots.footer()}
                </div>
              )}
            </div>
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  position: relative;
  margin: 0 auto;
  background: var(--bg-overlay);
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  width: 50%;
  color: var(--text-primary);
}

.header {
  padding: 20px 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  line-height: 24px;
  font-size: 18px;
  color: var(--text-primary);
}

.closeBtn {
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 20px;
  color: var(--text-secondary);
}

.closeBtn:hover {
  color: var(--color-primary);
}

.body {
  padding: 30px 20px;
  color: var(--text-regular);
  font-size: 14px;
  word-break: break-all;
}

.footer {
  padding: 10px 20px 20px;
  text-align: right;
  box-sizing: border-box;
}
</style>
