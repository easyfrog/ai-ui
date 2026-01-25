<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, onMounted, ref, Transition } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'warning' | 'info' | 'error'
  duration?: number
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['close'])
const cm = useCssModule()
const visible = ref(false)

onMounted(() => {
  visible.value = true
  if (props.duration !== 0) {
    setTimeout(() => {
      visible.value = false
      // emit close after transition? For simplicity, we emit after timeout but the element needs time to leave.
      // Ideally, we wait for transition end. But for now:
      setTimeout(() => emit('close'), 300) 
    }, props.duration || 3000)
  }
})

const render = () => {
  return (
    <Transition name="message-fade">
      {visible.value && (
        <div class={[cm.message, cm[props.type || 'info']]} data-theme={props.theme}>
          {props.message}
        </div>
      )}
    </Transition>
  )
}
</script>

<style module>
.message {
  min-width: 380px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid var(--border-base);
  position: fixed;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  background-color: var(--bg-component);
  transition: opacity 0.3s, transform 0.4s, top 0.4s;
  padding: 15px 15px 15px 20px;
  display: flex;
  align-items: center;
  z-index: 2001;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  color: var(--text-regular);
}

.success {
  color: var(--color-success);
  background-color: var(--bg-component); 
  border-color: var(--color-success);
}

.warning {
  color: var(--color-warning);
  background-color: var(--bg-component);
  border-color: var(--color-warning);
}

.error {
  color: var(--color-danger);
  background-color: var(--bg-component);
  border-color: var(--color-danger);
}

.info {
  color: var(--text-secondary);
}
</style>
