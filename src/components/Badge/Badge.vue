<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, computed, useSlots } from 'vue'

const props = defineProps<{
  value?: string | number
  max?: number
  isDot?: boolean
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  theme?: string
}>()

const cm = useCssModule()
const slots = useSlots()

const content = computed(() => {
  if (props.isDot) return ''
  if (typeof props.value === 'number' && typeof props.max === 'number') {
    return props.max < props.value ? `${props.max}+` : props.value
  }
  return props.value
})

const render = () => {
  return (
    <div class={cm.badge} data-theme={props.theme}>
      {slots.default?.()}
      {(content.value || props.isDot) && (
        <sup class={[cm.content, cm[props.type || 'danger'], props.isDot && cm.isDot]}>
          {content.value}
        </sup>
      )}
    </div>
  )
}
</script>

<style module>
.badge {
  position: relative;
  vertical-align: middle;
  display: inline-block;
  margin-right: 20px;
}

.content {
  position: absolute;
  top: 0;
  right: 10px;
  transform: translateY(-50%) translateX(100%);
  background-color: var(--color-danger);
  border-radius: 10px;
  color: #fff;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  height: 18px;
  padding: 0 6px;
  white-space: nowrap;
  border: 1px solid var(--bg-app);
}

.isDot {
  height: 8px;
  width: 8px;
  padding: 0;
  right: 5px;
  border-radius: 50%;
}

.primary { background-color: var(--color-primary); }
.success { background-color: var(--color-success); }
.warning { background-color: var(--color-warning); }
.danger { background-color: var(--color-danger); }
.info { background-color: var(--text-secondary); }
</style>
