<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'

const props = defineProps<{
  text?: string
  loading?: boolean
  theme?: string
}>()

const cm = useCssModule()

const render = () => {
  if (props.loading === false) return null
  
  return (
    <div class={cm.loading} data-theme={props.theme}>
      <div class={cm.spinner}>
        <svg viewBox="25 25 50 50" class={cm.circular}>
          <circle cx="50" cy="50" r="20" fill="none" class={cm.path}></circle>
        </svg>
      </div>
      {props.text && <p class={cm.text}>{props.text}</p>}
    </div>
  )
}
</script>

<style module>
.loading {
  position: absolute;
  z-index: 2000;
  background-color: var(--bg-overlay);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity .3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 42px;
  height: 42px;
  position: relative;
}

.circular {
  animation: rotate 2s linear infinite;
  height: 100%;
  transform-origin: center center;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.path {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: round;
  stroke-width: 2px;
}

.text {
  color: var(--color-primary);
  margin: 3px 0;
  font-size: 14px;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}

@keyframes color {
  100%,
  0% {
    stroke: var(--color-primary);
  }
  40% {
    stroke: var(--color-primary);
  }
  66% {
    stroke: var(--color-primary);
  }
  80%,
  90% {
    stroke: var(--color-primary);
  }
}
</style>
