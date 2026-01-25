<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, computed } from 'vue'

const props = defineProps<{
  total: number
  pageSize?: number
  currentPage?: number
  disabled?: boolean
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const emit = defineEmits(['update:currentPage', 'change'])

const cm = useCssModule()

const pageCount = computed(() => {
  const size = props.pageSize || 10
  return Math.ceil(props.total / size)
})

const handlePageChange = (page: number) => {
  if (props.disabled) return
  if (page < 1 || page > pageCount.value) return
  emit('update:currentPage', page)
  emit('change', page)
}

const render = () => {
  const current = props.currentPage || 1
  const count = pageCount.value
  
  // Simplified pager logic: 1 ... current ... last
  const pages = []
  for (let i = 1; i <= count; i++) {
    pages.push(i)
  }

  return (
    <div class={[cm.pagination, props.disabled && cm.disabled]} data-theme={props.theme}>
      <button 
        class={cm.btnPrev}
        disabled={current === 1 || props.disabled}
        onClick={() => handlePageChange(current - 1)}
      >
        &lt;
      </button>
      <ul class={cm.pager}>
        {pages.map(p => (
           <li 
             class={[cm.number, current === p && cm.active]}
             onClick={() => handlePageChange(p)}
           >
             {p}
           </li>
        ))}
      </ul>
      <button 
        class={cm.btnNext}
        disabled={current === count || props.disabled}
        onClick={() => handlePageChange(current + 1)}
      >
        &gt;
      </button>
    </div>
  )
}
</script>

<style module>
.pagination {
  white-space: nowrap;
  padding: 2px 5px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
}

.pagination button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  vertical-align: top;
  box-sizing: border-box;
  background: var(--bg-component);
  cursor: pointer;
  border: 1px solid var(--border-base);
  border-radius: 4px;
  margin: 0 4px;
  color: var(--text-regular);
}

.pagination button:disabled {
  color: var(--text-secondary);
  cursor: not-allowed;
  background-color: var(--bg-component-active);
}

.pager {
  user-select: none;
  list-style: none;
  display: inline-block;
  vertical-align: top;
  font-size: 0;
  padding: 0;
  margin: 0;
}

.pager li {
  padding: 0 4px;
  background: var(--bg-component);
  vertical-align: top;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
  box-sizing: border-box;
  text-align: center;
  margin: 0 4px;
  border-radius: 4px;
  border: 1px solid var(--border-base);
  color: var(--text-regular);
}

.pager li:hover {
  color: var(--color-primary);
}

.pager li.active {
  color: var(--c-white);
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  cursor: default;
}

.disabled .pager li {
  cursor: not-allowed;
  color: var(--text-secondary);
  background-color: var(--bg-component-active);
}
</style>
