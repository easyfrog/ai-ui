<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, computed, onMounted, onUnmounted } from 'vue'

interface Option {
  label: string
  value: string | number
}

const props = defineProps<{
  modelValue?: string | number
  options?: Option[]
  placeholder?: string
  disabled?: boolean
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const cm = useCssModule()
const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const handleSelect = (option: Option) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

const selectedLabel = computed(() => {
  const opt = props.options?.find(o => o.value === props.modelValue)
  return opt ? opt.label : ''
})

const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const render = () => {
  return (
    <div 
      class={[cm.select, props.disabled && cm.disabled, isOpen.value && cm.active]} 
      data-theme={props.theme}
      ref={containerRef}
    >
      <div class={cm.trigger} onClick={toggleDropdown}>
        <input 
          readonly 
          class={cm.input} 
          placeholder={props.placeholder} 
          value={selectedLabel.value}
          disabled={props.disabled}
        />
        <span class={cm.arrow}>
          <svg viewBox="0 0 1024 1024" width="12" height="12">
            <path d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z" fill="currentColor"></path>
          </svg>
        </span>
      </div>
      
      {isOpen.value && (
        <div class={cm.dropdown}>
          {props.options?.map(option => (
            <div 
              class={[cm.option, option.value === props.modelValue && cm.selected]}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
          {(!props.options || props.options.length === 0) && (
             <div class={cm.empty}>No Data</div>
          )}
        </div>
      )}
    </div>
  )
}
</script>

<style module>
.select {
  display: inline-block;
  position: relative;
  width: 100%;
  font-size: 14px;
}

.trigger {
  position: relative;
  cursor: pointer;
}

.input {
  cursor: pointer;
  background-color: var(--bg-component);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  color: var(--text-primary);
  display: block;
  width: 100%;
  height: 32px;
  line-height: 32px;
  padding: 0 30px 0 12px;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.input::placeholder {
  color: var(--text-placeholder);
}

.select:hover .input {
  border-color: var(--border-hover);
}

.active .input {
  border-color: var(--color-primary);
}

.arrow {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 12px;
  transition: transform 0.3s;
  height: 12px;
  line-height: 12px;
}

.active .arrow {
  transform: translateY(-50%) rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  min-width: 100%;
  margin-top: 5px;
  background-color: var(--bg-component);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 5px 0;
  max-height: 200px;
  overflow-y: auto;
}

.option {
  padding: 0 12px;
  height: 34px;
  line-height: 34px;
  cursor: pointer;
  color: var(--text-regular);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.option:hover {
  background-color: var(--bg-component-hover);
}

.selected {
  color: var(--color-primary);
  font-weight: bold;
}

.disabled .input {
  background-color: var(--bg-component-active);
  color: var(--text-secondary);
  cursor: not-allowed;
  border-color: var(--border-base);
}

.empty {
  padding: 10px;
  color: var(--text-secondary);
  text-align: center;
}
</style>
