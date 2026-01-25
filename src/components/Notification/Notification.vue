<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, onMounted, Transition } from 'vue'

const props = defineProps<{
  title?: string
  message?: string
  type?: 'success' | 'warning' | 'info' | 'error'
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['close'])
const cm = useCssModule()
const visible = ref(false)

const close = () => {
  visible.value = false
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  visible.value = true
  if (props.duration !== 0) {
    setTimeout(close, props.duration || 4500)
  }
})

const render = () => {
  const positionClass = props.position || 'top-right'
  
  return (
    <Transition name="notification-fade">
      {visible.value && (
        <div class={[cm.notification, cm[positionClass]]} data-theme={props.theme}>
          <div class={cm.group}>
            <h2 class={cm.title}>{props.title}</h2>
            <div class={cm.content}>
               {props.message}
            </div>
            <div class={cm.closeBtn} onClick={close}>×</div>
          </div>
        </div>
      )}
    </Transition>
  )
}
</script>

<style module>
.notification {
  display: flex;
  width: 330px;
  padding: 14px 26px 14px 13px;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid var(--border-base);
  position: fixed;
  background-color: var(--bg-component);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  transition: opacity .3s, transform .3s, left .3s, right .3s, top .4s, bottom .3s;
  overflow: hidden;
  z-index: 2002;
  color: var(--text-primary);
}

.top-right {
  top: 16px;
  right: 16px;
}

.top-left {
  top: 16px;
  left: 16px;
}

.bottom-right {
  bottom: 16px;
  right: 16px;
}

.bottom-left {
  bottom: 16px;
  left: 16px;
}

.group {
  margin-left: 13px;
  margin-right: 8px;
}

.title {
  font-weight: 700;
  font-size: 16px;
  color: var(--text-primary);
  margin: 0;
}

.content {
  font-size: 14px;
  line-height: 21px;
  margin: 6px 0 0;
  color: var(--text-regular);
  text-align: justify;
}

.closeBtn {
  position: absolute;
  top: 18px;
  right: 15px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 16px;
}

.closeBtn:hover {
  color: var(--text-primary);
}
</style>
