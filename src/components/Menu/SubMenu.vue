<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, inject, ref, provide } from 'vue'
import Icon from '../Icon/Icon.vue'
import CollapseTransition from '../Transition/CollapseTransition.vue'

const props = defineProps<{
  index: string
  title?: string
  icon?: string
}>()

const cm = useCssModule()
const menu = inject<any>('menu')
const level = inject<number>('menu-level', 1)

// Provide next level to children
provide('menu-level', level + 1)

const isOpened = ref(false)

const handleClick = () => {
  if (menu.collapse?.value) return
  isOpened.value = !isOpened.value
}

const render = () => {
  const collapsed = menu.collapse?.value
  
  return (
    <li class={[cm.submenu, collapsed && cm.collapsed]}>
      <div 
        class={[cm.submenuTitle, collapsed && cm.collapsed]} 
        onClick={handleClick}
        title={collapsed ? props.title : ''}
      >
        {props.icon && (
          <span class={cm.icon}>
            <Icon name={props.icon} />
          </span>
        )}
        {!collapsed && <span class={cm.text}>{props.title}</span>}
        {!collapsed && (
          <span class={[cm.arrow, isOpened.value && cm.arrowOpen]}>
             <Icon name="arrow-right" size="14px" />
          </span>
        )}
      </div>
      {!collapsed && (
        <CollapseTransition>
          <ul v-show={isOpened.value} class={cm.subList}>
            {slots.default?.()}
          </ul>
        </CollapseTransition>
      )}
    </li>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.submenu {
  list-style: none;
}

.submenuTitle {
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  color: var(--text-regular);
  padding: 0 20px;
  cursor: pointer;
  position: relative;
  transition: border-color .3s, background-color .3s, color .3s;
  box-sizing: border-box;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.submenuTitle:hover {
  background-color: var(--bg-component-hover);
}

.icon {
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
}

.text {
  flex: 1;
}

.arrow {
  transition: transform 0.3s;
  display: flex;
  align-items: center;
}

.arrowOpen {
  transform: rotate(90deg);
}

.subList {
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: rgba(0, 0, 0, 0.02); /* Slight contrast for submenu */
}

/* Collapsed state */
.collapsed .submenuTitle {
  justify-content: center;
  padding: 0 20px;
}

.collapsed .icon {
  margin-right: 0;
}
</style>
