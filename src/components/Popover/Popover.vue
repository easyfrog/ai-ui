<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, onMounted, onUnmounted, onBeforeUnmount, Teleport, nextTick, provide, inject, computed } from 'vue'

let popoverIdSeed = 0

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
const isHoveringReference = ref(false)
const isHoveringPopper = ref(false)
const deferredHide = ref(false)
const activeChildIds = new Set<number>()

const parentSetChildVisible = inject<((childId: number, childVisible: boolean) => void) | null>('popover-set-child-visible', null)
const popoverId = ++popoverIdSeed

provide('popover-set-child-visible', (childId: number, childVisible: boolean) => {
  if (childVisible) {
    activeChildIds.add(childId)
    return
  }

  activeChildIds.delete(childId)
  if (deferredHide.value && activeChildIds.size === 0 && !isHoveringReference.value && !isHoveringPopper.value) {
    deferredHide.value = false
    setVisible(false)
  }
})

const setVisible = (nextVisible: boolean) => {
  const prev = visible.value
  visible.value = nextVisible
  if (prev !== nextVisible) {
    parentSetChildVisible?.(popoverId, nextVisible)
  }
}

const isGroupHovering = computed(() => isHoveringReference.value || isHoveringPopper.value)

const toggle = () => {
  setVisible(!visible.value)
  if (visible.value) {
    nextTick(updatePosition)
  }
}

const show = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  setVisible(true)
  nextTick(updatePosition)
}

const hide = () => {
  if (props.trigger === 'hover' && props.mouseLeaveDelay) {
    timer = setTimeout(() => {
      if (isGroupHovering.value || activeChildIds.size > 0) {
        deferredHide.value = true
        return
      }
      deferredHide.value = false
      setVisible(false)
    }, props.mouseLeaveDelay)
  } else {
    if (isGroupHovering.value || activeChildIds.size > 0) {
      deferredHide.value = true
      return
    }
    deferredHide.value = false
    setVisible(false)
  }
}

const handlePopperMouseEnter = () => {
  isHoveringPopper.value = true
  if (props.trigger === 'hover' && timer) {
    clearTimeout(timer)
    timer = null
  }
}

const handlePopperMouseLeave = () => {
  isHoveringPopper.value = false
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
  deferredHide.value = false
  setVisible(false)
}

onMounted(() => {
  if (props.trigger === 'click') {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  if (visible.value) {
    parentSetChildVisible?.(popoverId, false)
  }
})

const render = () => {
  const events = props.trigger === 'hover' 
    ? { 
        onMouseenter: () => {
          isHoveringReference.value = true
          show()
        }, 
        onMouseleave: () => {
          isHoveringReference.value = false
          hide()
        } 
      }
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
