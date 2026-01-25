<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import Icon from '../Icon/Icon.vue'

const props = defineProps<{
  index: string
  disabled?: boolean
  icon?: string
  to?: string
}>()

const cm = useCssModule()
const menu = inject<any>('menu')
const level = inject<number>('menu-level', 1)
const isPopup = inject<boolean>('isPopup', false)
const router = useRouter()

const active = computed(() => menu.activeIndex.value === props.index)
const effectiveCollapsed = computed(() => menu.collapse?.value && !isPopup)

const handleClick = () => {
  if (props.disabled) return
  menu.handleSelect(props.index)
  if (props.to) {
    router.push(props.to)
  }
}

const itemStyle = computed(() => {
  if (effectiveCollapsed.value) return {}
  
  if (isPopup) {
    return { paddingLeft: '20px' }
  }

  let padding = 20 + (level - 1) * 20
  
  if (level > 1 && !props.icon) {
     padding = 54 + (level - 2) * 20
  }
  
  return { paddingLeft: `${padding}px` }
})

const render = () => {
  const mode = menu.mode || 'vertical'
  const collapsed = effectiveCollapsed.value
  
  return (
    <li 
      class={[
        cm.menuItem, 
        active.value && cm.active, 
        props.disabled && cm.disabled,
        cm[mode],
        collapsed && cm.collapsed
      ]}
      style={itemStyle.value}
      onClick={handleClick}
      title={collapsed ? (slots.default?.()[0]?.children as string) : ''}
    >
      {props.icon && (
        <span class={cm.icon}>
          <Icon name={props.icon} />
        </span>
      )}
      {!collapsed && <span class={cm.text}>{slots.default?.()}</span>}
    </li>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.menuItem {
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  color: var(--text-regular);
  padding: 0 20px;
  list-style: none;
  cursor: pointer;
  position: relative;
  transition: border-color .3s, background-color .3s, color .3s;
  box-sizing: border-box;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
}

.collapsed {
  padding: 0 20px;
  justify-content: center;
}

.collapsed .icon {
  margin-right: 0;
}

.text {
  transition: opacity 0.3s;
}

.menuItem:hover {
  background-color: var(--bg-component-hover);
}

.active {
  color: var(--color-primary);
}

.vertical.active {
  background-color: var(--bg-component-active);
}

.horizontal.active {
  border-bottom: 2px solid var(--color-primary);
  color: var(--text-primary);
}

.disabled {
  opacity: 0.25;
  cursor: not-allowed;
  background: transparent !important;
}
</style>
