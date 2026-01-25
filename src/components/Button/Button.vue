<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, useSlots } from 'vue'

const props = defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  theme?: 'light' | 'dark' | 'deep-blue'
  disabled?: boolean
  size?: 'large' | 'small' | 'default'
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const cm = useCssModule()
const slots = useSlots()

const render = () => {
  const btnType = props.type || 'default'
  // Avoid using 'default' class for size to prevent conflict with 'default' type
  const btnSize = props.size === 'default' ? undefined : props.size
  
  return (
    <button 
      class={[cm.button, cm[btnType], btnSize && cm[btnSize], props.disabled && cm.disabled]}
      data-theme={props.theme}
      disabled={props.disabled}
      onClick={(e) => !props.disabled && emit('click', e)}
    >
      {slots.default?.()}
    </button>
  )
}
</script>

<style module>
.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: 32px;
  white-space: nowrap;
  cursor: pointer;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: .1s;
  font-weight: 500;
  user-select: none;
  padding: 8px 15px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid transparent;
  margin-right: 8px;
}

.button:active {
  transform: scale(0.96);
}

.large {
  height: 40px;
  padding: 12px 20px;
  font-size: 16px;
}

.small {
  height: 24px;
  padding: 5px 10px;
  font-size: 12px;
}

.default {
  background-color: var(--bg-component);
  border-color: var(--border-base);
  color: var(--text-regular);
}
.default:hover {
  background-color: var(--bg-component-hover);
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.default:active {
  background-color: var(--bg-component-active);
}

.primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--c-white);
}

.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.primary:hover,
.success:hover,
.warning:hover,
.danger:hover,
.info:hover {
  opacity: 0.9;
}

.primary:active,
.success:active,
.warning:active,
.danger:active,
.info:active {
  filter: brightness(0.9);
}

.success {
  background-color: var(--color-success);
  border-color: var(--color-success);
  color: var(--c-white);
}
.warning {
  background-color: var(--color-warning);
  border-color: var(--color-warning);
  color: var(--c-white);
}
.danger {
  background-color: var(--color-danger);
  border-color: var(--color-danger);
  color: var(--c-white);
}
.info {
  background-color: var(--color-info);
  border-color: var(--color-info);
  color: var(--c-white);
}
</style>
