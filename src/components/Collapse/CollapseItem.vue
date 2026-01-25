<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, inject, computed, useSlots } from 'vue'
import CollapseTransition from '../Transition/CollapseTransition.vue'

const props = defineProps<{
  title?: string
  name: string
}>()

const cm = useCssModule()
const slots = useSlots()
const collapse = inject<any>('collapse')

const isActive = computed(() => {
  if (Array.isArray(collapse.activeNames.value)) {
    return collapse.activeNames.value.includes(props.name)
  }
  return collapse.activeNames.value === props.name
})

const handleClick = () => {
  collapse.handleItemClick(props.name)
}

const render = () => {
  return (
    <div class={[cm.item, isActive.value && cm.active]}>
      <div class={cm.header} onClick={handleClick}>
        {props.title || slots.title?.()}
        <span class={cm.arrow}>
          <svg viewBox="0 0 1024 1024" width="12" height="12">
            <path d="M340.864 192.128 652.672 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.6 0L714.24 534.336a32 32 0 0 0 0-44.672L382.528 149.376a29.12 29.12 0 0 0-41.728 0 30.592 30.592 0 0 0 0 42.752z" fill="currentColor"></path>
          </svg>
        </span>
      </div>
      <CollapseTransition>
        <div class={cm.wrap} v-show={isActive.value}>
          <div class={cm.content}>
            {slots.default?.()}
          </div>
        </div>
      </CollapseTransition>
    </div>
  )
}
</script>

<style module>
.item {
  border-bottom: 1px solid var(--border-base);
}
.item:last-child {
  border-bottom: none;
}

.header {
  display: flex;
  align-items: center;
  height: 48px;
  line-height: 48px;
  background-color: var(--bg-component);
  color: var(--text-primary);
  cursor: pointer;
  border-bottom: 1px solid transparent;
  font-size: 13px;
  font-weight: 500;
  transition: border-bottom-color .3s;
  outline: none;
}

.arrow {
  margin: 0 8px 0 auto;
  transition: transform .3s;
  font-weight: 300;
  color: var(--text-secondary);
}

.active .arrow {
  transform: rotate(90deg);
}

.active .header {
  border-bottom-color: var(--border-base);
}

.wrap {
  will-change: height;
  background-color: var(--bg-component);
  overflow: hidden;
  box-sizing: border-box;
  border-bottom-width: 1px;
}

.content {
  padding-bottom: 25px;
  font-size: 13px;
  color: var(--text-regular);
  line-height: 1.769230769230769;
}
</style>
