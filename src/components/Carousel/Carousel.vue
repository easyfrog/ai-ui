<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, provide, onMounted, onUnmounted, watch } from 'vue'
import Icon from '../Icon/Icon.vue'

const props = defineProps<{
  interval?: number
  height?: string
  theme?: string
  type?: 'fade' | 'slide'
  arrow?: 'always' | 'hover' | 'never'
}>()

const cm = useCssModule()
const activeIndex = ref(0)
const items = ref<any[]>([])
let timer: any = null

const addItem = (item: any) => {
  items.value.push(item)
}

const setActiveItem = (index: number) => {
  activeIndex.value = index
}

const prev = () => {
  let index = activeIndex.value - 1
  if (index < 0) index = items.value.length - 1
  setActiveItem(index)
}

const next = () => {
  let index = activeIndex.value + 1
  if (index >= items.value.length) index = 0
  setActiveItem(index)
}

provide('carousel', {
  addItem,
  activeIndex,
  items,
  type: props.type || 'fade'
})

const startTimer = () => {
  if (props.interval === 0) return
  stopTimer()
  timer = setInterval(() => {
    next()
  }, props.interval || 3000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(() => props.type, () => {
  // Reset when type changes
  activeIndex.value = 0
})

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})

const render = () => {
  const arrowMode = props.arrow || 'hover'
  const type = props.type || 'fade'
  
  return (
    <div 
      class={[cm.carousel, cm[arrowMode]]} 
      data-theme={props.theme}
      onMouseenter={stopTimer}
      onMouseleave={startTimer}
    >
      <div class={cm.container} style={{ height: props.height || '300px' }}>
        {type === 'slide' ? (
          <div 
            class={cm.track} 
            style={{ 
              transform: `translateX(-${activeIndex.value * 100}%)`,
              width: `${items.value.length * 100}%`
            }}
          >
            {slots.default?.()}
          </div>
        ) : (
          slots.default?.()
        )}
      </div>

      <button class={[cm.arrow, cm.left]} onClick={prev}>
        <Icon name="arrow-left" />
      </button>
      <button class={[cm.arrow, cm.right]} onClick={next}>
        <Icon name="arrow-right" />
      </button>

      <ul class={cm.indicators}>
        {items.value.map((_, index) => (
          <li 
            class={[cm.indicator, index === activeIndex.value && cm.active]}
            onClick={() => setActiveItem(index)}
          >
            <button class={cm.button}></button>
          </li>
        ))}
      </ul>
    </div>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.carousel {
  position: relative;
  overflow: hidden;
}

.container {
  position: relative;
  overflow: hidden;
}

.track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  z-index: 2;
}

.indicator {
  margin: 0 4px;
  cursor: pointer;
}

.button {
  display: block;
  width: 30px;
  height: 2px;
  padding: 0;
  border: 0;
  outline: none;
  background-color: var(--text-placeholder);
  opacity: 0.5;
  transition: opacity 0.3s;
}

.indicator.active .button {
  background-color: var(--color-primary);
  opacity: 1;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(31, 45, 61, 0.11);
  border: none;
  outline: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background-color 0.3s, opacity 0.3s;
  opacity: 0;
}

.arrow:hover {
  background-color: rgba(31, 45, 61, 0.22);
}

.left {
  left: 16px;
}

.right {
  right: 16px;
}

/* Arrow Visibility Modes */
.always .arrow {
  opacity: 1;
}

.hover:hover .arrow {
  opacity: 1;
}

.never .arrow {
  display: none;
}
</style>