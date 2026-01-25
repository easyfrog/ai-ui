<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'
import CollapseTransition from '../Transition/CollapseTransition.vue'
import Icon from '../Icon/Icon.vue'

interface TreeNode {
  label: string
  children?: TreeNode[]
  expanded?: boolean
}

const props = defineProps<{
  data: TreeNode[]
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const cm = useCssModule()

const toggle = (node: TreeNode) => {
  node.expanded = !node.expanded
}

const renderNode = (node: TreeNode, level: number = 0) => {
  return (
    <div class={cm.treeNode}>
      <div 
        class={cm.content} 
        style={{ paddingLeft: `${level * 18}px` }}
        onClick={() => toggle(node)}
      >
        <span class={[cm.arrowWrapper, node.expanded && cm.expanded, (!node.children || node.children.length === 0) && cm.invisible]}>
           <Icon name="caret-right" size="12px" color="currentColor" />
        </span>
        <span class={cm.label}>{node.label}</span>
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
</style>
