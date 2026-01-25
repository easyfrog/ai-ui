<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, provide, useSlots } from 'vue'

const cm = useCssModule()
const slots = useSlots()

// Provide isPopup to children so they know they are in a popup
provide('isPopup', true)

const render = () => {
  return (
    <div class={cm.popupMenu}>
      <ul class={cm.popupList}>
         {slots.default?.()}
      </ul>
    </div>
  )
}
</script>

<style module>
.popupMenu {
  /* Box styles removed, handled by Popover */
}

.popupList {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
