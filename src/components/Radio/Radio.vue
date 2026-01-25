<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, computed } from 'vue'

const props = defineProps<{
  modelValue?: string | number | boolean
  value?: string | number | boolean
  label?: string
  disabled?: boolean
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const cm = useCssModule()

const isChecked = computed(() => props.modelValue === props.value)

const handleChange = () => {
  if (props.disabled) return
  emit('update:modelValue', props.value)
  emit('change', props.value)
}

const render = () => {
  return (
    <label 
      class={[cm.radio, props.disabled && cm.disabled, isChecked.value && cm.checked]} 
      data-theme={props.theme}
    >
      <span class={cm.inputWrapper}>
        <input
          type="radio"
          class={cm.original}
          checked={isChecked.value}
          disabled={props.disabled}
          onChange={handleChange}
        />
        <span class={cm.inner}></span>
      </span>
      <span class={cm.label}>
        {props.label || props.value}
      </span>
    </label>
  )
}
</script>

<style module>
.radio {
  color: var(--text-regular);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  margin-right: 20px;
}

.radio.disabled {
  cursor: not-allowed;
  color: var(--text-secondary);
}

.inputWrapper {
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-flex;
  position: relative;
  line-height: 1;
  vertical-align: middle;
}

.original {
  opacity: 0;
  outline: none;
  position: absolute;
  z-index: -1;
  margin: 0;
  width: 0;
  height: 0;
}

.inner {
  border: 1px solid var(--border-base);
  border-radius: 100%;
  width: 16px;
  height: 16px;
  background-color: var(--bg-component);
  position: relative;
  cursor: pointer;
  display: inline-block;
  box-sizing: border-box;
  transition: border-color .25s, background-color .25s;
}

.inner::after {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background-color: var(--c-white);
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform .15s ease-in;
}

.radio:hover .inner {
  border-color: var(--color-primary);
}

.checked .inner {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
}

.checked .inner::after {
  transform: translate(-50%, -50%) scale(1);
}

.disabled .inner {
  background-color: var(--bg-component-active);
  border-color: var(--border-base);
}

.disabled.checked .inner {
  background-color: var(--border-base); 
  border-color: var(--border-base);
}

.disabled .inner::after {
  background-color: var(--text-secondary);
}

.label {
  padding-left: 8px;
  line-height: 1;
}
</style>
