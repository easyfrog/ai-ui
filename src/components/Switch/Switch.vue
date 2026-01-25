<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'

const props = defineProps<{
  modelValue?: boolean
  disabled?: boolean
  activeText?: string
  inactiveText?: string
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const cm = useCssModule()

const toggle = () => {
  if (props.disabled) return
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const render = () => {
  return (
    <div 
      class={[cm.switch, props.modelValue && cm.checked, props.disabled && cm.disabled]} 
      onClick={toggle}
      data-theme={props.theme}
    >
      {props.inactiveText && (
        <span class={[cm.text, cm.inactiveText, !props.modelValue && cm.activeTextClass]}>
          {props.inactiveText}
        </span>
      )}
      <div class={cm.core}>
        <div class={cm.action}></div>
      </div>
      {props.activeText && (
        <span class={[cm.text, cm.activeText, props.modelValue && cm.activeTextClass]}>
          {props.activeText}
        </span>
      )}
    </div>
  )
}
</script>

<style module>
.switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 20px;
  height: 32px;
  vertical-align: middle;
  cursor: pointer;
}

.core {
  margin: 0;
  display: inline-block;
  position: relative;
  width: 40px;
  height: 20px;
  border: 1px solid var(--border-base);
  outline: none;
  border-radius: 10px;
  box-sizing: border-box;
  background: var(--bg-component-active);
  cursor: pointer;
  transition: border-color .3s, background-color .3s;
  vertical-align: middle;
}

.action {
  position: absolute;
  top: 1px;
  left: 1px;
  border-radius: 100%;
  transition: all .3s;
  width: 16px;
  height: 16px;
  background-color: var(--c-white);
}

.checked .core {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
}

.checked .action {
  left: 100%;
  margin-left: -17px;
}

.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.disabled .core {
  cursor: not-allowed;
}

.text {
  transition: .2s;
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 10px;
}

.activeTextClass {
  color: var(--color-primary);
}
</style>
