<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, inject, ref, provide, computed, useSlots } from 'vue'
import Icon from '../Icon/Icon.vue'
import CollapseTransition from '../Transition/CollapseTransition.vue'
import MenuPopup from './MenuPopup.vue'
import Popover from '../Popover/Popover.vue'

const props = defineProps<{
  index: string
  title?: string
  icon?: string
}>()

const cm = useCssModule()
const menu = inject<any>('menu')
const level = inject<number>('menu-level', 1)
const isPopup = inject<boolean>('isPopup', false)
const slots = useSlots()

// Provide next level to children
provide('menu-level', level + 1)

const isOpened = ref(false)

const effectiveCollapsed = computed(() => menu.collapse?.value && !isPopup)
const isHorizontal = computed(() => menu.mode === 'horizontal')

const isInPopup = computed(() => isPopup || (isHorizontal.value && level > 1))

// Determine if we should use Popover behavior
const usePopover = computed(() => {
  if (isHorizontal.value) return true // Horizontal menu always uses popovers for submenus
  if (effectiveCollapsed.value) return true // Collapsed sidebar uses popovers
  if (isPopup) return true // Nested items in popups use popovers (for side menus)
  return false
})

const popoverPlacement = computed(() => {
  if (isHorizontal.value && !isInPopup.value) return 'bottom'
  return 'right'
})

const handleClick = () => {
  if (usePopover.value) return // Popover handles trigger
  isOpened.value = !isOpened.value
}

const render = () => {
  const collapsed = effectiveCollapsed.value
  
  const renderTitle = () => (
    <div 
      class={[
        cm.submenuTitle, 
        collapsed && cm.collapsed,
        isInPopup.value && cm.inPopupTitle,
        // Only apply horizontal styling (static arrow) if we are strictly top-level horizontal
        isHorizontal.value && !isInPopup.value && cm.horizontalTitle
      ]} 
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
           <Icon 
             name={isHorizontal.value && !isInPopup.value ? "caret-bottom" : "arrow-right"} 
             size="14px" 
           />
        </span>
      )}
    </div>
  )
  
  if (usePopover.value) {
    return (
      <li class={[cm.submenu, collapsed && cm.collapsed, isHorizontal.value && cm.horizontal]}>
        <Popover 
          trigger="hover" 
          placement={popoverPlacement.value} 
          theme={menu.theme?.value}
          mouseLeaveDelay={300}
          v-slots={{
            default: renderTitle,
            content: () => (
              <MenuPopup>
                {slots.default?.()}
              </MenuPopup>
            )
          }}
        />
      </li>
    )
  }
  
  return (
    <li class={[cm.submenu, collapsed && cm.collapsed]}>
      {renderTitle()}
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
</script>

<style module>
.submenu {
  list-style: none;
  position: relative;
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

.horizontalTitle {
  padding: 0 20px;
}

.horizontal {
  display: flex;
  align-items: center;
}

.submenuTitle:hover {
  background-color: var(--bg-component-hover);
}

.collapsed .submenuTitle {
  padding: 0 20px;
  justify-content: center;
}

.icon {
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
}

.collapsed .icon {
  margin-right: 0;
}

.text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.3s;
}

.inPopupTitle .text {
  padding-right: 16px;
}

.arrow {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  transition: transform .3s;
  opacity: 0.8;
}

.horizontalTitle .arrow {
  margin-left: 8px;
}

.arrowOpen {
  transform: rotate(90deg);
}

.horizontalTitle .arrowOpen {
  transform: rotate(180deg);
}

.subList {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
