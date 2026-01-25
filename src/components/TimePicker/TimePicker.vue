<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
  placeholder?: string
  theme?: string
}>()

const emit = defineEmits(['update:modelValue'])
const cm = useCssModule()

const render = () => {
  return (
    <div class={cm.wrapper} data-theme={props.theme}>
      <input 
        type="time" 
        class={cm.input} 
        value={props.modelValue} 
        disabled={props.disabled}
        placeholder={props.placeholder}
        onInput={(e: any) => emit('update:modelValue', e.target.value)}
      />
    </div>
  )
}
</script>

<style module>
.wrapper {
  display: inline-block;
  position: relative;
  width: 100%;
}

.input {
  -webkit-appearance: none;
  background-color: var(--bg-component);
  border-radius: 4px;
  border: 1px solid var(--border-base);
  box-sizing: border-box;
  color: var(--text-regular);
  display: inline-block;
  font-size: inherit;
  height: 32px;
  line-height: 32px;
  outline: none;
  padding: 0 11px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
}

.input:focus {
  border-color: var(--color-primary);
}

.input:disabled {
  background-color: var(--bg-component-active);
  cursor: not-allowed;
  color: var(--text-secondary);
}

.wrapper[data-theme='dark'] .input::-webkit-calendar-picker-indicator,
.wrapper[data-theme='deep-blue'] .input::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>
