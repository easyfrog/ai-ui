<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, onMounted, onUnmounted, Teleport, nextTick } from 'vue'

const props = defineProps<{
  content?: string
  trigger?: 'click' | 'hover'
  placement?: 'top' | 'bottom' | 'left' | 'right'
  theme?: 'light' | 'dark' | 'deep-blue'
  mouseLeaveDelay?: number
}>()

const cm = useCssModule()
const visible = ref(false)
const referenceRef = ref<HTMLElement | null>(null)
const popperRef = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

const toggle = () => {
  visible.value = !visible.value
  if (visible.value) {
    nextTick(updatePosition)
  }
}

const show = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  visible.value = true
  nextTick(updatePosition)
}

const hide = () => {
  if (props.trigger === 'hover' && props.mouseLeaveDelay) {
    timer = setTimeout(() => {
      visible.value = false
    }, props.mouseLeaveDelay)
  } else {
    visible.value = false
  }
}

const handlePopperMouseEnter = () => {
  if (props.trigger === 'hover' && timer) {
    clearTimeout(timer)
    timer = null
  }
}

const handlePopperMouseLeave = () => {
  if (props.trigger === 'hover') {
    hide()
  }
}

const updatePosition = () => {
  if (!referenceRef.value || !popperRef.value) return
  const rect = referenceRef.value.getBoundingClientRect()
  const popperRect = popperRef.value.getBoundingClientRect()
  
  let top = 0
  let left = 0
  
  // Simplified positioning
  switch (props.placement) {
    case 'top':
      top = rect.top - popperRect.height - 10
      left = rect.left + (rect.width - popperRect.width) / 2
      break
    case 'bottom':
      top = rect.bottom + 10
      left = rect.left + (rect.width - popperRect.width) / 2
      break
    case 'right':
      top = rect.top
      left = rect.right + 10
      break
    default: // bottom
      top = rect.bottom + 10
      left = rect.left + (rect.width - popperRect.width) / 2
  }
  
  popperRef.value.style.top = `${top + window.scrollY}px`
  popperRef.value.style.left = `${left + window.scrollX}px`
}

const handleClickOutside = (e: MouseEvent) => {
  if (referenceRef.value && referenceRef.value.contains(e.target as Node)) return
  if (popperRef.value && popperRef.value.contains(e.target as Node)) return
  hide()
}

onMounted(() => {
  if (props.trigger === 'click') {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const render = () => {
  const events = props.trigger === 'hover' 
    ? { onMouseenter: show, onMouseleave: hide }
    : { onClick: toggle }

  return (
    <>
      <span ref={referenceRef} {...events} class={cm.reference}>
        {slots.default?.()}
      </span>
      {visible.value && (
        <Teleport to="body">
          <div 
            ref={popperRef} 
            class={cm.popper} 
            data-theme={props.theme}
            onMouseenter={handlePopperMouseEnter}
            onMouseleave={handlePopperMouseLeave}
          >
            {props.content || slots.content?.()}
            <div class={cm.arrow}></div>
          </div>
        </Teleport>
      )}
    </>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.reference {
  display: inline-block;
}

.popper {
  position: absolute;
  background: var(--bg-overlay);
  min-width: 150px;
  border-radius: 4px;
  border: 1px solid var(--border-base);
  padding: 12px;
  z-index: 2000;
  color: var(--text-regular);
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.arrow {
  position: absolute;
  /* simplified arrow implementation */
}
</style>
