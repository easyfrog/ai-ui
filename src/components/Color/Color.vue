<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'

const props = defineProps<{
  color: string
  size?: string | number
  showValue?: boolean
  theme?: string
}>()

const cm = useCssModule()

const render = () => {
  const sizeVal = typeof props.size === 'number' ? `${props.size}px` : (props.size || '20px')
  
  return (
    <div class={cm.wrapper} data-theme={props.theme}>
      <div 
        class={cm.swatch} 
        style={{ backgroundColor: props.color, width: sizeVal, height: sizeVal }}
      ></div>
      {props.showValue && <span class={cm.value}>{props.color}</span>}
    </div>
  )
}
</script>

<style module>
.wrapper {
  display: inline-flex;
  align-items: center;
}

.swatch {
  border-radius: 4px;
  border: 1px solid var(--border-base);
  box-sizing: border-box;
}

.value {
  margin-left: 8px;
  font-size: 14px;
  color: var(--text-regular);
}
</style>
