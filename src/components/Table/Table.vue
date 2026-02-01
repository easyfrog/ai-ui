<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, computed, ref, watch, useSlots } from 'vue'
import Checkbox from '../Checkbox/Checkbox.vue'
import Icon from '../Icon/Icon.vue'

interface Column {
  prop?: string
  label?: string
  width?: string | number
  fixed?: 'left' | 'right'
  sortable?: boolean
  type?: 'selection' | 'expand' | 'index'
  render?: (row: any, index: number) => any
  align?: 'left' | 'center' | 'right'
}

const props = defineProps<{
  data: any[]
  columns: Column[]
  stripe?: boolean
  border?: boolean
  theme?: 'light' | 'dark' | 'deep-blue'
  rowKey?: string | ((row: any) => string | number)
  expandRowKeys?: (string | number)[]
  defaultExpandAll?: boolean
  selection?: boolean // Simple prop to enable selection mode if columns doesn't have it
  selectedKeys?: (string | number)[]
}>()

const emit = defineEmits(['update:selectedKeys', 'update:expandRowKeys', 'sort-change', 'select', 'select-all', 'expand-change'])

const cm = useCssModule()
const slots = useSlots()

// --- State ---
const innerExpandKeys = ref<Set<string | number>>(new Set(props.expandRowKeys || []))
const innerSelectedKeys = ref<Set<string | number>>(new Set(props.selectedKeys || []))
const sortState = ref<{ prop: string, order: 'asc' | 'desc' | null }>({ prop: '', order: null })

watch(() => props.expandRowKeys, (val) => {
  if (val) innerExpandKeys.value = new Set(val)
}, { deep: true })

watch(() => props.selectedKeys, (val) => {
  if (val) innerSelectedKeys.value = new Set(val)
}, { deep: true })

// --- Helpers ---
const getRowKey = (row: any, index: number) => {
  if (typeof props.rowKey === 'function') return props.rowKey(row)
  if (props.rowKey) return row[props.rowKey]
  return index
}

// --- Columns Processing ---
const processedColumns = computed(() => {
  const cols = [...props.columns]
  
  // If selection prop is true and no selection column exists, add it
  if (props.selection && !cols.find(c => c.type === 'selection')) {
    cols.unshift({ type: 'selection', width: '50px', align: 'center' })
  }

  // Calculate sticky positions
  let left = 0
  let right = 0
  
  const result = cols.map((col) => {
    const newCol: any = { ...col }
    if (col.fixed === 'left') {
      newCol.style = { position: 'sticky', left: `${left}px`, zIndex: 2 }
      if (col.width) {
        const w = typeof col.width === 'number' ? col.width : parseInt(col.width)
        left += w
      }
      // Add last-left-fixed class for shadow if needed, but simple shadow on all fixed works too
    }
    return newCol
  })

  // Calculate right sticky (need to go backwards)
  for (let i = result.length - 1; i >= 0; i--) {
    const col = result[i]
    if (col.fixed === 'right') {
      col.style = { position: 'sticky', right: `${right}px`, zIndex: 2 }
      if (col.width) {
        const w = typeof col.width === 'number' ? col.width : parseInt(col.width)
        right += w
      }
    }
  }

  return result
})

// --- Data Processing (Sorting & Tree Flattening) ---

// 1. Sort
const sortedData = computed(() => {
  let data = [...props.data]
  if (sortState.value.order && sortState.value.prop) {
    data.sort((a, b) => {
      const va = a[sortState.value.prop]
      const vb = b[sortState.value.prop]
      if (va === vb) return 0
      const result = va > vb ? 1 : -1
      return sortState.value.order === 'desc' ? -result : result
    })
  }
  return data
})

// 2. Flatten (Tree)
const flattenData = computed(() => {
  const result: any[] = []
  
  const traverse = (nodes: any[], level: number) => {
    nodes.forEach((node, index) => {
      const key = getRowKey(node, index) // Note: index might not be stable if sorting
      const expanded = innerExpandKeys.value.has(key)
      
      result.push({
        ...node,
        __key: key,
        __level: level,
        __expanded: expanded,
        __hasChildren: node.children && node.children.length > 0
      })
      
      if (expanded && node.children) {
        traverse(node.children, level + 1)
      }
    })
  }
  
  traverse(sortedData.value, 0)
  return result
})

// --- Actions ---

const handleSort = (col: Column) => {
  if (!col.sortable || !col.prop) return
  
  if (sortState.value.prop !== col.prop) {
    sortState.value = { prop: col.prop, order: 'asc' }
  } else {
    if (sortState.value.order === 'asc') sortState.value.order = 'desc'
    else if (sortState.value.order === 'desc') sortState.value.order = null
    else sortState.value.order = 'asc'
  }
  
  emit('sort-change', sortState.value)
}

const toggleExpand = (row: any) => {
  const key = row.__key
  if (innerExpandKeys.value.has(key)) {
    innerExpandKeys.value.delete(key)
  } else {
    innerExpandKeys.value.add(key)
  }
  emit('update:expandRowKeys', Array.from(innerExpandKeys.value))
  emit('expand-change', row, innerExpandKeys.value.has(key))
}

const handleSelect = (row: any, checked: boolean) => {
  const updateSelection = (r: any, isSelected: boolean) => {
    const k = r.__key || getRowKey(r, 0) // Fallback if __key missing (e.g. not flattened yet)
    if (isSelected) innerSelectedKeys.value.add(k)
    else innerSelectedKeys.value.delete(k)
    
    if (r.children && r.children.length > 0) {
      r.children.forEach((child: any) => updateSelection(child, isSelected))
    }
  }

  updateSelection(row, checked)
  
  emit('update:selectedKeys', Array.from(innerSelectedKeys.value))
  emit('select', row, checked)
}

const getAllKeys = (data: any[]) => {
  const keys: (string | number)[] = []
  const traverse = (nodes: any[]) => {
    nodes.forEach((node, index) => {
       const key = getRowKey(node, index)
       keys.push(key)
       if (node.children) traverse(node.children)
    })
  }
  traverse(data)
  return keys
}

const handleSelectAll = (checked: boolean) => {
  if (checked) {
    const allKeys = getAllKeys(sortedData.value)
    allKeys.forEach(k => innerSelectedKeys.value.add(k))
  } else {
    innerSelectedKeys.value.clear()
  }
  emit('update:selectedKeys', Array.from(innerSelectedKeys.value))
  emit('select-all', checked)
}

const isAllSelected = computed(() => {
  const allKeys = getAllKeys(sortedData.value)
  if (allKeys.length === 0) return false
  return allKeys.every(k => innerSelectedKeys.value.has(k))
})

const isIndeterminate = computed(() => {
  const allKeys = getAllKeys(sortedData.value)
  if (allKeys.length === 0) return false
  const count = allKeys.filter(k => innerSelectedKeys.value.has(k)).length
  return count > 0 && count < allKeys.length
})

// --- Rendering ---

const renderCell = (row: any, col: Column, index: number) => {
  if (col.type === 'selection') {
    return (
      <Checkbox 
        modelValue={innerSelectedKeys.value.has(row.__key)}
        onChange={(v: boolean) => handleSelect(row, v)}
      />
    )
  }
  
  if (col.type === 'index') {
    return index + 1
  }
  
  if (col.type === 'expand') {
    return (
      <span 
        class={[cm.expandIcon, row.__expanded && cm.expanded]} 
        onClick={(e) => { e.stopPropagation(); toggleExpand(row) }}
      >
        <Icon name="caret-right" size="12px" />
      </span>
    )
  }

  // Tree toggle logic for first non-special column if no specific expand column
  const isFirstDataCol = processedColumns.value.find(c => !c.type) === col
  
  let content = col.render ? col.render(row, index) : row[col.prop!]
  
  if (isFirstDataCol && row.__level > 0) {
    // Indent
    return (
      <div style={{ paddingLeft: `${row.__level * 20}px`, display: 'flex', alignItems: 'center' }}>
         {row.__hasChildren && (
            <span 
              class={[cm.expandIcon, row.__expanded && cm.expanded]} 
              onClick={(e) => { e.stopPropagation(); toggleExpand(row) }}
              style={{ marginRight: '5px' }}
            >
              <Icon name="caret-right" size="12px" />
            </span>
         )}
         {!row.__hasChildren && <span style={{ width: '17px', marginRight: '5px' }}></span>}
         {content}
      </div>
    )
  }
  
  if (isFirstDataCol && row.__hasChildren) {
      return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
         <span 
            class={[cm.expandIcon, row.__expanded && cm.expanded]} 
            onClick={(e) => { e.stopPropagation(); toggleExpand(row) }}
            style={{ marginRight: '5px' }}
          >
            <Icon name="caret-right" size="12px" />
          </span>
         {content}
      </div>
    )
  }

  return content
}

const render = () => {
  return (
    <div 
      class={[cm.tableWrapper, props.border && cm.border]} 
      data-theme={props.theme}
    >
      <div class={cm.scrollContainer}>
        <table class={cm.table} cellspacing="0" cellpadding="0">
          <colgroup>
            {processedColumns.value.map(col => (
              <col width={col.width} />
            ))}
          </colgroup>
          <thead class={cm.thead}>
            <tr>
              {processedColumns.value.map(col => (
                <th 
                  class={[
                    cm.cell, 
                    col.fixed && cm[`fixed-${col.fixed}`],
                    col.sortable && cm.sortable
                  ]}
                  style={col.style}
                  onClick={() => handleSort(col)}
                >
                  <div class={cm.cellContent} style={{ justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}>
                    {col.type === 'selection' ? (
                      <Checkbox 
                        modelValue={isAllSelected.value}
                        indeterminate={isIndeterminate.value}
                        onChange={(v: boolean) => handleSelectAll(v)}
                      />
                    ) : (
                      <>
                        {col.label}
                        {col.sortable && (
                           <span class={cm.sortWrapper}>
                             <Icon name="caret-up" size="10px" class={[cm.sortIcon, sortState.value.prop === col.prop && sortState.value.order === 'asc' && cm.active]} />
                             <Icon name="caret-down" size="10px" class={[cm.sortIcon, sortState.value.prop === col.prop && sortState.value.order === 'desc' && cm.active]} style={{ marginTop: '-4px' }} />
                           </span>
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flattenData.value.map((row, index) => (
              <>
                <tr class={[cm.row, props.stripe && index % 2 === 1 && cm.striped]}>
                  {processedColumns.value.map(col => (
                    <td 
                      class={[
                        cm.cell,
                        col.fixed && cm[`fixed-${col.fixed}`]
                      ]}
                      style={col.style}
                    >
                      <div class={cm.cellContent} style={{ justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start' }}>
                         {renderCell(row, col, index)}
                      </div>
                    </td>
                  ))}
                </tr>
                {/* Expanded Row Content (if separate expanded row logic is needed, but tree data handles expand usually. 
                    If 'type=expand' is used for detail view, we might need a separate tr. 
                    Current implementation mixes Tree expand and Row expand logic. 
                    Let's assume type='expand' creates a detail row.) 
                */}
                {row.__expanded && props.columns.some(c => c.type === 'expand') && (
                   <tr class={cm.expandRow}>
                     <td colspan={processedColumns.value.length} class={cm.expandCell}>
                        {slots.expand ? slots.expand({ row }) : 'No expand slot content'}
                     </td>
                   </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {flattenData.value.length === 0 && (
           <div class={cm.empty}>No Data</div>
        )}
      </div>
    </div>
  )
}
</script>

<style module>
.tableWrapper {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  max-width: 100%;
  background-color: var(--bg-component);
  font-size: 14px;
  color: var(--text-regular);
}

.scrollContainer {
  overflow: auto;
  width: 100%;
  max-width: 100%;
}

.table {
  table-layout: fixed;
  width: 100%; /* Or min-width if scrollable */
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.thead {
  color: var(--text-primary);
  font-weight: 500;
}

.thead th {
  background-color: var(--bg-component-hover);
  border-bottom: 1px solid var(--border-base);
  text-align: left;
  user-select: none;
}

.cell {
  padding: 12px;
  box-sizing: border-box;
  vertical-align: middle;
  position: relative;
  text-align: left;
  border-bottom: 1px solid var(--border-base);
  background-color: var(--bg-component); /* Important for sticky */
}

.cellContent {
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.row {
  transition: background-color .25s ease;
}

.row:hover td {
  background-color: var(--bg-component-hover);
}

.striped td {
  background-color: var(--bg-app); 
}

.striped:hover td {
  background-color: var(--bg-component-hover);
}

.border {
  border: 1px solid var(--border-base);
  border-bottom: none;
}

.border .cell {
  border-right: 1px solid var(--border-base);
}

.border .cell:last-child {
  border-right: none;
}

/* Fixed Columns */
.fixed-left,
.fixed-right {
  position: sticky;
  z-index: 2;
}

.fixed-left {
  box-shadow: 3px 0 5px -2px rgba(0,0,0,0.1);
}

.fixed-right {
  box-shadow: -3px 0 5px -2px rgba(0,0,0,0.1);
}

/* Sort */
.sortable {
  cursor: pointer;
}

.sortable:hover {
  background-color: var(--bg-component-active);
}

.sortWrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  height: 20px;
  width: 24px;
  vertical-align: middle;
  cursor: pointer;
  overflow: initial;
  position: relative;
}

.sortIcon {
  color: var(--text-placeholder);
}

.active {
  color: var(--color-primary);
}

/* Expand */
.expandIcon {
  cursor: pointer;
  transition: transform .3s;
  display: inline-flex;
  margin-right: 8px;
}

.expanded {
  transform: rotate(90deg);
}

.empty {
  text-align: center;
  padding: 40px 0;
  color: var(--text-secondary);
}
</style>
