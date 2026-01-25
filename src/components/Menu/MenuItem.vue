<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, inject, computed } from 'vue'
import Icon from '../Icon/Icon.vue'

const props = defineProps<{
  index: string
  disabled?: boolean
  icon?: string
}>()

const cm = useCssModule()
const menu = inject<any>('menu')
const level = inject<number>('menu-level', 1)

const active = computed(() => menu.activeIndex.value === props.index)

const handleClick = () => {
  if (props.disabled) return
  menu.handleSelect(props.index)
}

const itemStyle = computed(() => {
  const collapsed = menu.collapse?.value
  if (collapsed) return {}
  
  // Alignment logic:
  // Level 1: Padding 20px. Icon takes 24px+10px. Text starts at 54px.
  // Level > 1 (No Icon): User wants text to align with Level 1 text (54px).
  // Standard indentation usually adds 20px per level.
  // We'll support the specific request for no-icon subitems to align with parent text.
  
  let padding = 20 + (level - 1) * 20
  
  if (level > 1 && !props.icon) {
     // If no icon, we need to compensate for the missing icon to align text?
     // Or just set it to match Level 1 text position?
     // Level 1 Text = 54px.
     // Level 2 Base = 40px.
     // If we want 54px, we set it to 54px.
     // Let's use a heuristic: Base Indent + (Parent had Icon ? IconWidth : 0)
     // But here we just hardcode the user preference for this layout style.
     // If level 2, padding 54px.
     padding = 54 + (level - 2) * 20
  }
  
  return { paddingLeft: `${padding}px` }
})

const render = () => {
  const mode = menu.mode || 'vertical'
  const collapsed = menu.collapse?.value
  
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