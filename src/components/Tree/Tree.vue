<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, watch } from 'vue'
import CollapseTransition from '../Transition/CollapseTransition.vue'
import Icon from '../Icon/Icon.vue'
import Checkbox from '../Checkbox/Checkbox.vue'

interface TreeNode {
  label: string
  key?: string | number
  children?: TreeNode[]
  expanded?: boolean
  isLeaf?: boolean
  loading?: boolean
  disabled?: boolean
  [key: string]: any
}

const props = defineProps<{
  data: TreeNode[]
  theme?: 'light' | 'dark' | 'deep-blue'
  checkable?: boolean
  checkedKeys?: (string | number)[]
  loadData?: (node: TreeNode) => Promise<TreeNode[]>
}>()

const emit = defineEmits(['update:checkedKeys', 'check', 'expand'])

const cm = useCssModule()

// Internal state for expanded keys if not controlled (though we modify node.expanded directly in this simple implementation)
// For checked keys, we need to track them.
const innerCheckedKeys = ref<Set<string | number>>(new Set(props.checkedKeys || []))
const indeterminateKeys = ref<Set<string | number>>(new Set())

watch(() => props.checkedKeys, (val) => {
  if (val) {
    innerCheckedKeys.value = new Set(val)
    recalcIndeterminate()
  }
}, { deep: true })

const getKey = (node: TreeNode) => {
  return node.key ?? node.label // Fallback to label if key missing
}

// Helper to find node by key - straightforward traversal
const findNode = (nodes: TreeNode[], key: string | number): TreeNode | null => {
  for (const node of nodes) {
    if (getKey(node) === key) return node
    if (node.children) {
      const found = findNode(node.children, key)
      if (found) return found
    }
  }
  return null
}

const isChecked = (node: TreeNode) => {
  const key = getKey(node)
  return innerCheckedKeys.value.has(key)
}

const isIndeterminate = (node: TreeNode) => {
  const key = getKey(node)
  return indeterminateKeys.value.has(key)
}

const setChecked = (node: TreeNode, checked: boolean) => {
  const key = getKey(node)
  if (checked) {
    innerCheckedKeys.value.add(key)
  } else {
    innerCheckedKeys.value.delete(key)
  }
}

// Update children recursively
const updateChildrenCheck = (node: TreeNode, checked: boolean) => {
  if (node.disabled) return
  
  setChecked(node, checked)
  
  if (node.children) {
    node.children.forEach(child => updateChildrenCheck(child, checked))
  }
}

// Update parents status
// This requires knowing the parent. Since we don't have parent pointers, we traverse from root.
const recalcIndeterminate = () => {
  indeterminateKeys.value.clear()
  const traverse = (nodes: TreeNode[]): { allChecked: boolean, hasChecked: boolean } => {
    let allChecked = true
    let hasChecked = false
    
    for (const node of nodes) {
      let nodeChecked = isChecked(node)
      let childrenAllChecked = true
      let childrenHasChecked = false
      
      if (node.children && node.children.length > 0) {
        const res = traverse(node.children)
        childrenAllChecked = res.allChecked
        childrenHasChecked = res.hasChecked
        
        // Auto check parent if all children checked (and parent not checked yet)
        if (childrenAllChecked && !nodeChecked) {
           setChecked(node, true)
           nodeChecked = true
        } else if (!childrenAllChecked && nodeChecked) {
           // Uncheck parent if not all children checked
           setChecked(node, false)
           nodeChecked = false
        }
        
        if (childrenHasChecked && !childrenAllChecked) {
          indeterminateKeys.value.add(getKey(node))
        } else {
          indeterminateKeys.value.delete(getKey(node))
        }
      }
      
      if (!nodeChecked) allChecked = false
      if (nodeChecked || childrenHasChecked) hasChecked = true
    }
    
    return { allChecked, hasChecked }
  }
  
  traverse(props.data)
}

// However, standard tree behavior usually:
// 1. Click node -> update all children
// 2. Then update all parents
const handleCheck = (node: TreeNode, checked: boolean) => {
  if (node.disabled) return

  // 1. Update self and children
  updateChildrenCheck(node, checked)
  
  // 2. Recalculate whole tree (simplest way without parent pointers)
  recalcIndeterminate()
  
  emit('update:checkedKeys', Array.from(innerCheckedKeys.value))
  emit('check', node, checked)
}

const toggle = async (node: TreeNode) => {
  if (node.loading) return
  
  if (props.loadData && !node.children && !node.isLeaf) {
    node.loading = true
    try {
      const children = await props.loadData(node)
      node.children = children
      node.expanded = true
      // If parent was checked, new children should inherit check status? 
      // Usually yes.
      if (isChecked(node)) {
         updateChildrenCheck(node, true)
         emit('update:checkedKeys', Array.from(innerCheckedKeys.value))
      }
    } catch (e) {
      console.error(e)
    } finally {
      node.loading = false
    }
  } else {
    node.expanded = !node.expanded
  }
  emit('expand', node, node.expanded)
}

const renderNode = (node: TreeNode, level: number = 0) => {
  const key = getKey(node)
  const hasChildren = (node.children && node.children.length > 0) || (props.loadData && !node.isLeaf)
  
  return (
    <div class={cm.treeNode} key={key}>
      <div 
        class={cm.content} 
        style={{ paddingLeft: `${level * 18}px` }}
      >
        <span 
          class={[
            cm.arrowWrapper, 
            node.expanded && cm.expanded, 
            !hasChildren && cm.invisible
          ]}
          onClick={(e) => {
            e.stopPropagation()
            toggle(node)
          }}
        >
           {node.loading ? (
             <Icon name="loading" size="12px" spin color="currentColor" />
           ) : (
             <Icon name="caret-right" size="12px" color="currentColor" />
           )}
        </span>
        
        {props.checkable && (
          <Checkbox 
            modelValue={isChecked(node)}
            indeterminate={isIndeterminate(node)}
            disabled={node.disabled}
            onChange={(checked: boolean) => handleCheck(node, checked)}
            class={cm.checkbox}
          />
        )}
        
        <span class={cm.label} onClick={() => toggle(node)}>{node.label}</span>
      </div>
      <CollapseTransition>
        <div v-show={node.expanded} class={cm.children}>
           {node.children && node.children.map(child => renderNode(child, level + 1))}
        </div>
      </CollapseTransition>
    </div>
  )
}

const render = () => {
  return (
    <div class={cm.tree} data-theme={props.theme}>
      {props.data.map(node => renderNode(node))}
    </div>
  )
}
</script>

<style module>
.tree {
  color: var(--text-regular);
  font-size: 14px;
}

.treeNode {
  white-space: nowrap;
  outline: none;
}

.content {
  display: flex;
  align-items: center;
  height: 26px;
  cursor: pointer;
}

.content:hover {
  background-color: var(--bg-component-hover);
}

.arrowWrapper {
  cursor: pointer;
  color: var(--text-secondary);
  transform: rotate(0deg);
  transition: transform .3s ease-in-out;
  margin-right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
}

.expanded {
  transform: rotate(90deg);
}

.invisible {
  visibility: hidden;
}

.label {
  flex: 1;
}

.checkbox {
  margin-right: 8px !important;
}
</style>
