<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'

const props = defineProps<{
  modelValue?: string | number
  placeholder?: string
  rows?: number
  disabled?: boolean
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur'])

const cm = useCssModule()

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', e)
}

const render = () => {
  return (
    <div class={[cm.wrapper, props.disabled && cm.disabled]} data-theme={props.theme}>
      <textarea
        class={cm.textarea}
        value={props.modelValue}
        rows={props.rows || 3}
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
  vertical-align: bottom;
  font-size: 14px;
}

.textarea {
  display: block;
  resize: vertical;
  padding: 8px 12px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  font-family: inherit;
  color: var(--text-primary);
  background-color: var(--bg-component);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  transition: border-color 0.2s, background-color 0.3s, color 0.3s;
  outline: none;
}

.textarea::placeholder {
  color: var(--text-placeholder);
}

.textarea:hover:not(:disabled) {
  border-color: var(--border-hover);
}

.textarea:focus:not(:disabled) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.disabled .textarea {
  background-color: var(--bg-component-active);
  color: var(--text-secondary);
  cursor: not-allowed;
  border-color: var(--border-base);
}
</style>
