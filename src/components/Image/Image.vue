<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  width?: string
  height?: string
  theme?: string
}>()

const cm = useCssModule()

const render = () => {
  const style = {
    width: props.width,
    height: props.height,
    objectFit: props.fit || 'fill'
  } as any

  return (
    <div class={cm.image} style={{ width: props.width, height: props.height }} data-theme={props.theme}>
      <img src={props.src} alt={props.alt} class={cm.img} style={style} />
    </div>
  )
}
</script>

<style module>
.image {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
