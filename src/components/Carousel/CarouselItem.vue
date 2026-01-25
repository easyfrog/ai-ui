<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, inject, computed, onMounted } from 'vue'

const props = defineProps<{
  name?: string
}>()

const cm = useCssModule()
const carousel = inject<any>('carousel')
const active = computed(() => carousel.items.value[carousel.activeIndex.value] === instance)

const instance = {
  uid: Math.random()
}

onMounted(() => {
  carousel.addItem(instance)
})

const render = () => {
  const type = carousel.type
  
  return (
    <div 
      class={[
        cm.item, 
        type === 'fade' && active.value && cm.active,
        type === 'fade' && cm.fade,
        type === 'slide' && cm.slide
      ]}
    >
      {slots.default?.()}
    </div>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.item {
  width: 100%;
  height: 100%;
}

.fade {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  z-index: 0;
}

.fade.active {
  opacity: 1;
  z-index: 1;
}

.slide {
  flex-shrink: 0;
  width: 100%;
}
</style>