<template>
  <Transition
    name="collapse-transition"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot />
  </Transition>
</template>

<script lang="ts" setup>
const beforeEnter = (el: Element) => {
  const element = el as HTMLElement
  element.dataset.oldPaddingTop = element.style.paddingTop
  element.dataset.oldPaddingBottom = element.style.paddingBottom
  element.dataset.oldOverflow = element.style.overflow

  element.style.height = '0'
  element.style.paddingTop = '0'
  element.style.paddingBottom = '0'
  element.style.transition = 'height 0.3s ease-in-out, padding-top 0.3s ease-in-out, padding-bottom 0.3s ease-in-out'
}

const enter = (el: Element) => {
  const element = el as HTMLElement
  element.dataset.oldOverflow = element.style.overflow
  if (element.scrollHeight !== 0) {
    element.style.height = `${element.scrollHeight}px`
    element.style.paddingTop = element.dataset.oldPaddingTop || ''
    element.style.paddingBottom = element.dataset.oldPaddingBottom || ''
  } else {
    element.style.height = ''
    element.style.paddingTop = element.dataset.oldPaddingTop || ''
    element.style.paddingBottom = element.dataset.oldPaddingBottom || ''
  }
  element.style.overflow = 'hidden'
}

const afterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = ''
  element.style.overflow = element.dataset.oldOverflow || ''
  element.style.transition = ''
}

const beforeLeave = (el: Element) => {
  const element = el as HTMLElement
  element.dataset.oldPaddingTop = element.style.paddingTop
  element.dataset.oldPaddingBottom = element.style.paddingBottom
  element.dataset.oldOverflow = element.style.overflow

  element.style.height = `${element.scrollHeight}px`
  element.style.overflow = 'hidden'
  element.style.transition = 'height 0.3s ease-in-out, padding-top 0.3s ease-in-out, padding-bottom 0.3s ease-in-out'
}

const leave = (el: Element) => {
  const element = el as HTMLElement
  if (element.scrollHeight !== 0) {
    element.style.height = '0'
    element.style.paddingTop = '0'
    element.style.paddingBottom = '0'
  }
}

const afterLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = ''
  element.style.overflow = element.dataset.oldOverflow || ''
  element.style.paddingTop = element.dataset.oldPaddingTop || ''
  element.style.paddingBottom = element.dataset.oldPaddingBottom || ''
  element.style.transition = ''
}
</script>
