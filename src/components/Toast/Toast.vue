<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, onMounted, Transition } from 'vue'

const props = defineProps<{
  message: string
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
      setTimeout(() => emit('close'), 300)
    }, props.duration || 2000)
  }
})

const render = () => {
  return (
    <Transition name="toast-fade">
      {visible.value && (
        <div class={cm.toast} data-theme={props.theme}>
          {props.message}
        </div>
      )}
    </Transition>
  )
}
</script>

<style module>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 2003;
  text-align: center;
  max-width: 80%;
}
</style>
