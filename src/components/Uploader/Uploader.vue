<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, useSlots } from 'vue'

const props = defineProps<{
  action?: string
  theme?: string
}>()

const cm = useCssModule()
const slots = useSlots()
const fileInput = ref<HTMLInputElement>()

const handleClick = () => {
  fileInput.value?.click()
}

const render = () => {
  return (
    <div class={cm.uploader} onClick={handleClick} data-theme={props.theme}>
      <input type="file" ref={fileInput} class={cm.input} />
      <div class={cm.content}>
        {slots.default ? slots.default() : <span>+ Upload</span>}
      </div>
    </div>
  )
}
</script>

<style module>
.uploader {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  border: 1px dashed var(--border-base);
  border-radius: 6px;
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.uploader:hover {
  border-color: var(--color-primary);
}

.input {
  display: none;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: var(--text-secondary);
}
</style>
