<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref } from 'vue'
import Tag from '../Tag/Tag.vue'

const props = defineProps<{
  modelValue?: string[]
  placeholder?: string
  disabled?: boolean
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])
const cm = useCssModule()
const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')
const isFocused = ref(false)

const handleContainerClick = () => {
  if (props.disabled) return
  inputRef.value?.focus()
}

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  inputValue.value = target.value
}

const addTag = () => {
  const val = inputValue.value.trim()
  if (val) {
    const newList = [...(props.modelValue || [])]
    if (!newList.includes(val)) {
      newList.push(val)
      emit('update:modelValue', newList)
      emit('change', newList)
    }
    inputValue.value = ''
  }
}

const removeTag = (index: number) => {
  if (props.disabled) return
  const newList = [...(props.modelValue || [])]
  newList.splice(index, 1)
  emit('update:modelValue', newList)
  emit('change', newList)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    addTag()
  } else if (e.key === 'Backspace' && !inputValue.value && (props.modelValue?.length || 0) > 0) {
    removeTag((props.modelValue?.length || 0) - 1)
  }
}

const handleFocus = (e: FocusEvent) => {
  isFocused.value = true
  emit('focus', e)
}

const handleBlur = (e: FocusEvent) => {
  // Delay clearing focus to allow click on tag close button to work? 
  // But click on tag close happens on mousedown/click, blur happens later or before?
  // Actually if we click outside, blur happens.
  isFocused.value = false
  // Add current input as tag on blur? Maybe user wants that.
  addTag() 
  emit('blur', e)
}

const render = () => {
  return (
    <div 
      class={[
        cm.wrapper, 
        props.disabled && cm.disabled,
        isFocused.value && cm.focused
      ]} 
      data-theme={props.theme}
      onClick={handleContainerClick}
    >
      <div class={cm.content}>
        {props.modelValue?.map((tag, index) => (
          <div class={cm.tagWrapper} key={tag}>
             <Tag 
               closable={!props.disabled} 
               onClose={() => removeTag(index)}
               size="small"
             >
               {tag}
             </Tag>
          </div>
        ))}
        <input
          ref={inputRef}
          class={cm.input}
          type="text"
          value={inputValue.value}
          placeholder={(!props.modelValue?.length) ? props.placeholder : ''}
          disabled={props.disabled}
          onInput={handleInput}
          onKeydown={handleKeydown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </div>
  )
}
</script>

<style module>
.wrapper {
  background-color: var(--bg-component);
  border: 1px solid var(--border-base);
  border-radius: 4px;
  color: var(--text-primary);
  display: inline-block;
  width: 100%;
  min-height: 32px;
  line-height: 1.5;
  padding: 1px 11px;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  cursor: text;
}

.wrapper:hover:not(.disabled) {
  border-color: var(--border-hover);
}

.focused:not(.disabled) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.disabled {
  background-color: var(--bg-component-active);
  color: var(--text-secondary);
  cursor: not-allowed;
  border-color: var(--border-base);
}

.content {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 3px;
  margin-bottom: 3px;
}

.tagWrapper {
  display: flex;
  align-items: center;
}

.input {
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  flex-grow: 1;
  min-width: 50px;
  height: 24px; /* Match small tag height approx */
  font-size: 14px;
  padding: 0;
  margin: 0;
}

.input::placeholder {
  color: var(--text-placeholder);
}

.disabled .input {
  cursor: not-allowed;
}
</style>
