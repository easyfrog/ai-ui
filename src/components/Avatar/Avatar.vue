<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, useSlots } from 'vue'

const props = defineProps<{
  size?: number | 'large' | 'default' | 'small'
  shape?: 'circle' | 'square'
  src?: string
  alt?: string
  theme?: string
}>()

const cm = useCssModule()
const slots = useSlots()

const render = () => {
  const sizeClass = typeof props.size === 'string' ? cm[props.size] : ''
  const style = typeof props.size === 'number' ? { width: `${props.size}px`, height: `${props.size}px`, lineHeight: `${props.size}px` } : {}
  
  return (
    <span class={[cm.avatar, cm[props.shape || 'circle'], sizeClass]} style={style} data-theme={props.theme}>
      {props.src ? <img src={props.src} alt={props.alt} /> : slots.default?.()}
    </span>
  )
}
</script>

<style module>
.avatar {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: #ccc;
  color: #fff;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  font-size: 14px;
}

.square {
  border-radius: 4px;
}

.large { width: 56px; height: 56px; line-height: 56px; font-size: 18px; }
.small { width: 24px; height: 24px; line-height: 24px; font-size: 12px; }

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
