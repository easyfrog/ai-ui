<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, useSlots } from 'vue'

const props = defineProps<{
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const cm = useCssModule()
const slots = useSlots()

const render = () => {
  return (
    <div class={cm.buttonGroup} data-theme={props.theme}>
      {slots.default?.()}
    </div>
  )
}
</script>

<style module>
.buttonGroup {
  display: inline-flex;
  vertical-align: middle;
}

.buttonGroup > button {
  float: left;
  position: relative;
  margin-right: 0 !important; /* Override Button margin */
}

.buttonGroup > button:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.buttonGroup > button:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.buttonGroup > button:not(:first-child):not(:last-child) {
  border-radius: 0;
}

.buttonGroup > button:not(:last-child) {
  margin-right: -1px; /* Collapse borders */
}

.buttonGroup > button:hover,
.buttonGroup > button:focus,
.buttonGroup > button:active {
  z-index: 1;
}
</style>
