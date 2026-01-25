<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, useSlots } from 'vue'

const props = defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  closable?: boolean
  theme?: string
  size?: 'large' | 'default' | 'small'
}>()

const emit = defineEmits(['close', 'click'])
const cm = useCssModule()
const slots = useSlots()

const handleClose = (e: MouseEvent) => {
  e.stopPropagation()
  emit('close', e)
}

const render = () => {
  return (
    <span 
      class={[cm.tag, cm[props.type || 'info'], cm[props.size || 'default']]} 
      data-theme={props.theme}
      onClick={(e) => emit('click', e)}
    >
      <span class={cm.content}>{slots.default?.()}</span>
      {props.closable && (
        <span class={cm.close} onClick={handleClose}>×</span>
      )}
    </span>
  )
}
</script>

<style module>
.tag {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  padding: 0 9px;
  font-size: 12px;
  line-height: 1;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  margin-right: 8px;
}

.large { height: 32px; padding: 0 11px; font-size: 14px; }
.small { height: 20px; padding: 0 7px; font-size: 12px; }

.primary { background-color: rgba(64, 158, 255, 0.1); border-color: rgba(64, 158, 255, 0.2); color: var(--color-primary); }
.success { background-color: rgba(103, 194, 58, 0.1); border-color: rgba(103, 194, 58, 0.2); color: var(--color-success); }
.warning { background-color: rgba(230, 162, 60, 0.1); border-color: rgba(230, 162, 60, 0.2); color: var(--color-warning); }
.danger { background-color: rgba(245, 108, 108, 0.1); border-color: rgba(245, 108, 108, 0.2); color: var(--color-danger); }
.info { background-color: rgba(144, 147, 153, 0.1); border-color: rgba(144, 147, 153, 0.2); color: var(--text-secondary); }

.close {
  margin-left: 5px;
  cursor: pointer;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
.close:hover {
  background-color: rgba(0,0,0,0.2);
  color: #fff;
}
</style>
