<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'
import Icon from '../Icon/Icon.vue'

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
      <span class={cm.iconWrapper}>
        <Icon name="time" />
      </span>
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
  padding: 0 30px 0 11px;
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

.input::-webkit-calendar-picker-indicator {
  opacity: 0;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 30px;
  padding: 0;
  margin: 0;
}

.iconWrapper {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-regular);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}
</style>
