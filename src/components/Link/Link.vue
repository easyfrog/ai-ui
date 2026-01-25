<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, useSlots } from 'vue'

const props = defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  underline?: boolean
  disabled?: boolean
  href?: string
  theme?: string
}>()

const emit = defineEmits(['click'])
const cm = useCssModule()
const slots = useSlots()

const handleClick = (e: MouseEvent) => {
  if (!props.disabled) emit('click', e)
}

const render = () => {
  return (
    <a 
      class={[
        cm.link, 
        cm[props.type || 'default'], 
        props.disabled && cm.disabled,
        props.underline === false && cm.noUnderline
      ]}
      href={props.disabled ? undefined : props.href}
      onClick={handleClick}
      data-theme={props.theme}
    >
      {slots.default?.()}
    </a>
  )
}
</script>

<style module>
.link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  position: relative;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  transition: .3s;
}

.link:hover {
  text-decoration: underline;
}

.noUnderline:hover {
  text-decoration: none;
}

.default {
  color: var(--text-regular);
}
.default:hover {
  color: var(--color-primary);
}

.primary { color: var(--color-primary); }
.success { color: var(--color-success); }
.warning { color: var(--color-warning); }
.danger { color: var(--color-danger); }
.info { color: var(--text-secondary); }

.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.disabled:hover {
  text-decoration: none;
}
</style>
