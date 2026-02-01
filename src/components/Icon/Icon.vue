<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, useSlots, computed } from 'vue'
import { icons } from './icons'

const props = defineProps<{
  size?: string | number
  color?: string
  name?: string
  spin?: boolean
  theme?: string
}>()

const cm = useCssModule()
const slots = useSlots()

const path = computed(() => {
  return props.name && icons[props.name] ? icons[props.name] : null
})

const render = () => {
  const style: any = {}
  if (props.size) {
    style.fontSize = typeof props.size === 'number' ? `${props.size}px` : props.size
  }
  if (props.color) {
    style.color = props.color
  }

  const classes = [cm.icon]
  if (props.spin) {
    classes.push(cm.spin)
  }
  if (props.name && !path.value) {
    classes.push(`ai-icon-${props.name}`)
  }

  return (
    <i class={classes.join(' ')} style={style} data-theme={props.theme}>
      {path.value ? (
        <svg viewBox="0 0 24 24" innerHTML={path.value} style={{ width: '1em', height: '1em', fill: 'currentColor' }} />
      ) : (
        slots.default?.()
      )}
    </i>
  )
}
</script>

<style module>
.icon {
  height: 1em;
  width: 1em;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  fill: currentColor;
  color: inherit;
  /* font-size: inherit; */
  font-size: 1.2rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
