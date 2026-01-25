<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref } from 'vue'

const props = defineProps<{
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const cm = useCssModule()
const sliderRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const getPercentage = (value: number) => {
  const min = props.min ?? 0
  const max = props.max ?? 100
  return ((value - min) / (max - min)) * 100
}

const updateValue = (clientX: number) => {
  if (props.disabled || !sliderRef.value) return
  const rect = sliderRef.value.getBoundingClientRect()
  const min = props.min ?? 0
  const max = props.max ?? 100
  const step = props.step ?? 1
  
  let percentage = (clientX - rect.left) / rect.width
  if (percentage < 0) percentage = 0
  if (percentage > 1) percentage = 1
  
  let value = min + percentage * (max - min)
  value = Math.round(value / step) * step
  
  if (value < min) value = min
  if (value > max) value = max
  
  emit('update:modelValue', value)
  emit('change', value)
}

const onMouseDown = (e: MouseEvent) => {
  if (props.disabled) return
  isDragging.value = true
  updateValue(e.clientX)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e: MouseEvent) => {
  if (isDragging.value) {
    updateValue(e.clientX)
  }
}

const onMouseUp = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

const render = () => {
  const percentage = getPercentage(props.modelValue ?? 0)
  return (
    <div class={[cm.slider, props.disabled && cm.disabled]} data-theme={props.theme}>
      <div class={cm.runway} ref={sliderRef} onMousedown={onMouseDown}>
        <div class={cm.bar} style={{ width: `${percentage}%` }}></div>
        <div 
          class={cm.buttonWrapper} 
          style={{ left: `${percentage}%` }}
        >
          <div class={[cm.button, isDragging.value && cm.dragging]}></div>
        </div>
      </div>
    </div>
  )
}
</script>

<style module>
.slider {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  user-select: none;
}

.runway {
  width: 100%;
  height: 6px;
  background-color: var(--border-base);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
  vertical-align: middle;
}

.bar {
  height: 6px;
  background-color: var(--color-primary);
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  position: absolute;
}

.buttonWrapper {
  height: 36px;
  width: 36px;
  position: absolute;
  z-index: 1001;
  top: -15px;
  transform: translateX(-50%);
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  line-height: normal;
}

.button {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-primary);
  background-color: var(--c-white);
  border-radius: 50%;
  transition: .2s;
  user-select: none;
}

.button:hover, .dragging {
  transform: scale(1.2);
  cursor: grab;
}

.dragging {
  cursor: grabbing;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.disabled .runway {
  cursor: not-allowed;
}

.disabled .button {
  border-color: var(--text-secondary);
  cursor: not-allowed;
}

.disabled .bar {
  background-color: var(--text-secondary);
}
</style>
