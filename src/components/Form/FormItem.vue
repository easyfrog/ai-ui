<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, inject } from 'vue'

const props = defineProps<{
  label?: string
  prop?: string
}>()

const cm = useCssModule()
const form = inject<any>('form', {})

const render = () => {
  return (
    <div class={cm.item}>
      {props.label && (
        <label 
          class={cm.label} 
          style={{ width: form.labelWidth || '80px' }}
        >
          {props.label}
        </label>
      )}
      <div class={cm.content}>
        {slots.default?.()}
      </div>
    </div>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.item {
  margin-bottom: 18px;
  display: flex;
  align-items: center;
}

.label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: var(--text-regular);
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}

.content {
  line-height: 32px;
  position: relative;
  font-size: 14px;
  flex: 1;
}
</style>
