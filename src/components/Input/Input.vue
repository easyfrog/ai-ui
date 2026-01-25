<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'

const props = defineProps<{
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['update:modelValue', 'change', 'input', 'focus', 'blur'])

const cm = useCssModule()

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', e)
}

const render = () => {
  return (
    <div class={[cm.wrapper, props.disabled && cm.disabled]} data-theme={props.theme}>
      <input
        class={cm.input}
        type={props.type || 'text'}
        value={props.modelValue}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onInput={handleInput}
        onChange={(e) => emit('change', e)}
        onFocus={(e) => emit('focus', e)}
        onBlur={(e) => emit('blur', e)}
      />
    </div>
  )
}
</script>

<style module>
.wrapper {
  display: inline-block;
  width: 100%;
  position: relative;
  font-size: 14px;
}

.input {
  background-color: var(--bg-component);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  color: var(--text-primary);
  display: block;
  width: 100%;
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.3s, color 0.3s;
  box-sizing: border-box;
}

.input::placeholder {
  color: var(--text-placeholder);
}

.input:hover:not(:disabled) {
  border-color: var(--border-hover);
}

.input:focus:not(:disabled) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); /* Adjust opacity for theme? using CSS var for ring might be better */
}

.disabled .input {
  background-color: var(--bg-component-active); /* Slightly darker/different bg */
  color: var(--text-secondary);
  cursor: not-allowed;
  border-color: var(--border-base);
}
</style>
