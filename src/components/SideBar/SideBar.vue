<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, useSlots, watch } from 'vue'
import Icon from '../Icon/Icon.vue'

const props = defineProps<{
  theme?: string
  logo?: string
  title?: string
  collapsed?: boolean
}>()

const emit = defineEmits(['update:collapsed'])
const slots = useSlots()

// Internal state initialized from props
const internalCollapsed = ref(props.collapsed || false)

watch(() => props.collapsed, (val) => {
  if (val !== undefined) {
    internalCollapsed.value = val
  }
})

const cm = useCssModule()

const toggleCollapse = () => {
  const newVal = !internalCollapsed.value
  internalCollapsed.value = newVal
  emit('update:collapsed', newVal)
}

const render = () => {
  return (
    <div class={[cm.sidebar, internalCollapsed.value && cm.collapsed]} data-theme={props.theme}>
      <div class={cm.logo}>
        <Icon name="logo" size="24px" color="var(--color-primary)" />
        {!internalCollapsed.value && <span class={cm.title}>{props.title || 'Admin Panel'}</span>}
      </div>
      
      <div class={cm.menuWrapper}>
        {slots.default?.({ collapsed: internalCollapsed.value })}
      </div>

      <div class={cm.collapseBtn} onClick={toggleCollapse}>
        <Icon name={internalCollapsed.value ? 'arrow-right' : 'arrow-left'} />
      </div>
    </div>
  )
}
</script>

<style module>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-component);
  border-right: 1px solid var(--border-base);
  transition: width 0.3s;
  width: 240px;
  box-sizing: border-box;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-base);
  overflow: hidden;
  white-space: nowrap;
}

.title {
  margin-left: 10px;
  font-weight: bold;
  font-size: var(--font-size-xl);
  color: var(--text-primary);
}

.menuWrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.collapseBtn {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-top: 1px solid var(--border-base);
  color: var(--text-regular);
  transition: background-color 0.3s;
  overflow: hidden;
  white-space: nowrap;
}

.collapseBtn:hover {
  background-color: var(--bg-component-hover);
}
</style>
