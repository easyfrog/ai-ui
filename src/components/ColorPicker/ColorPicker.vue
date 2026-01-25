<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'

const props = defineProps<{
  modelValue?: string
  disabled?: boolean
  theme?: string
}>()

const emit = defineEmits(['update:modelValue'])
const cm = useCssModule()

const render = () => {
  return (
    <div class={cm.wrapper} data-theme={props.theme}>
      <input 
        type="color" 
        class={cm.input} 
        value={props.modelValue} 
        disabled={props.disabled}
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
}

.input {
  -webkit-appearance: none;
  background-color: var(--bg-component);
  border-radius: 4px;
  border: 1px solid var(--border-base);
  box-sizing: border-box;
  padding: 2px;
  width: 32px;
  height: 32px;
  outline: none;
  cursor: pointer;
}

.input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
