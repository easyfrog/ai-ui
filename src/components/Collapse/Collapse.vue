<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, provide, ref, watch } from 'vue'

const props = defineProps<{
  modelValue?: string | string[]
  accordion?: boolean
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const cm = useCssModule()
const activeNames = ref<string | string[]>(props.modelValue || (props.accordion ? '' : []))

watch(() => props.modelValue, (val) => {
  activeNames.value = val || (props.accordion ? '' : [])
})

const handleItemClick = (name: string) => {
  if (props.accordion) {
    const newValue = activeNames.value === name ? '' : name
    activeNames.value = newValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
  } else {
    const activeArr = Array.isArray(activeNames.value) ? activeNames.value : []
    const index = activeArr.indexOf(name)
    let newActiveArr: string[]
    if (index > -1) {
      newActiveArr = activeArr.filter(i => i !== name)
    } else {
      newActiveArr = [...activeArr, name]
    }
    activeNames.value = newActiveArr
    emit('update:modelValue', newActiveArr)
    emit('change', newActiveArr)
  }
}

provide('collapse', {
  activeNames,
  handleItemClick
})

const render = () => {
  return (
    <div class={cm.collapse} data-theme={props.theme}>
      {slots.default?.()}
    </div>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
</script>

<style module>
.collapse {
  border-top: 1px solid var(--border-base);
  border-bottom: 1px solid var(--border-base);
}
</style>
