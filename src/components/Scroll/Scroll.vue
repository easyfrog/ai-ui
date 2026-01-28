<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, computed, useSlots, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps<{
  theme?: 'light' | 'dark' | 'deep-blue'
  height?: string | number
  maxHeight?: string | number
  width?: string | number
  maxWidth?: string | number
  x?: boolean
  y?: boolean
}>()

const cm = useCssModule()
const slots = useSlots()

const containerRef = ref<HTMLElement | null>(null)
const viewRef = ref<HTMLElement | null>(null)
const hasScrollX = ref(false)
const hasScrollY = ref(false)
let ro: ResizeObserver | null = null

const normalizeSize = (v?: string | number) => {
  if (v === undefined) return undefined
  return typeof v === 'number' ? `${v}px` : v
}

const updateOverflow = () => {
  const el = containerRef.value
  if (!el) return
  hasScrollX.value = el.scrollWidth > el.clientWidth + 1
  hasScrollY.value = el.scrollHeight > el.clientHeight + 1
}

onMounted(() => {
  nextTick(updateOverflow)

  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => updateOverflow())
    if (containerRef.value) ro.observe(containerRef.value)
    if (viewRef.value) ro.observe(viewRef.value)
  }

  window.addEventListener('resize', updateOverflow)
})

onBeforeUnmount(() => {
  ro?.disconnect()
  ro = null
  window.removeEventListener('resize', updateOverflow)
})

const style = computed(() => {
  const s: Record<string, string> = {}
  const height = normalizeSize(props.height)
  const maxHeight = normalizeSize(props.maxHeight)
  const width = normalizeSize(props.width)
  const maxWidth = normalizeSize(props.maxWidth)
  if (height) s.height = height
  if (maxHeight) s.maxHeight = maxHeight
  if (width) s.width = width
  if (maxWidth) s.maxWidth = maxWidth
  return s
})

const render = () => {
  const x = props.x ?? false
  const y = props.y ?? true

  return (
    <div
      ref={containerRef}
      class={[
        cm.scroll,
        x && cm.scrollX,
        y && cm.scrollY,
        hasScrollX.value && cm.hasScrollX,
        hasScrollY.value && cm.hasScrollY
      ]}
      style={style.value}
      data-theme={props.theme}
    >
      <div ref={viewRef} class={cm.view}>
        {slots.default?.()}
      </div>
    </div>
  )
}
</script>

<style module>
.scroll {
  overflow: auto;
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  
  --scrollbar-track: transparent;
  --scrollbar-thumb: var(--border-hover);
  --scrollbar-thumb-hover: var(--text-secondary);
  --scrollbar-thumb-current: transparent;
  --scrollbar-size: 10px;
  
  transition: scrollbar-color 0.3s ease;
}

.hasScrollX,
.hasScrollY {
  /* Ensure scrollbar space is reserved but invisible */
}

.scroll:hover {
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  --scrollbar-thumb-current: var(--scrollbar-thumb);
}

.scrollX {
  overflow-x: auto;
}

.scrollY {
  overflow-y: auto;
}

.view {
  min-width: 100%;
}

/* Webkit */
.scroll::-webkit-scrollbar {
  width: var(--scrollbar-size);
  height: var(--scrollbar-size);
}

.scroll::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

.scroll::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-current);
  border-radius: 999px;
  border: 3px solid transparent;
  background-clip: content-box;
  /* Note: transition on pseudo-elements is limited, 
     but changing the variable on the parent can sometimes trigger it 
     if supported, or we just rely on the parent's hover state */
  transition: background-color 0.3s ease;
}

.scroll::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover) !important;
}
</style>
