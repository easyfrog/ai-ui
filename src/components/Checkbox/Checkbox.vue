<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'

const props = defineProps<{
  modelValue?: boolean
  label?: string
  disabled?: boolean
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const cm = useCssModule()

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('change', target.checked)
}

const render = () => {
  return (
    <label class={[cm.checkbox, props.disabled && cm.disabled, props.modelValue && cm.checked]} data-theme={props.theme}>
      <span class={cm.inputWrapper}>
        <input
          type="checkbox"
          class={cm.original}
          checked={props.modelValue}
          disabled={props.disabled}
          onChange={handleChange}
        />
        <span class={cm.inner}></span>
      </span>
      {props.label && <span class={cm.label}>{props.label}</span>}
    </label>
  )
}
</script>

<style module>
.checkbox {
  color: var(--text-regular);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  margin-right: 20px;
}

.checkbox.disabled {
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
  display: inline-block;
  position: relative;
  border: 1px solid var(--border-base);
  border-radius: 2px;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  background-color: var(--bg-component);
  transition: border-color 0.25s, background-color 0.25s;
}

.inner::after {
  box-sizing: content-box;
  content: "";
  border: 1px solid var(--c-white);
  border-left: 0;
  border-top: 0;
  height: 8px;
  left: 5px;
  position: absolute;
  top: 1px;
  transform: rotate(45deg) scaleY(0);
  width: 4px;
  transition: transform .15s ease-in .05s;
  transform-origin: center;
}

.checkbox:hover .inner {
  border-color: var(--color-primary);
}

.checked .inner {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.checked .inner::after {
  transform: rotate(45deg) scaleY(1);
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
  border-color: var(--text-secondary);
}

.label {
  padding-left: 8px;
  line-height: 1;
}
</style>
