<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref } from 'vue'
import Menu from '../Menu/Menu.vue'
import MenuItem from '../Menu/MenuItem.vue'
import SubMenu from '../Menu/SubMenu.vue'
import Icon from '../Icon/Icon.vue'

const props = defineProps<{
  theme?: string
  logo?: string
  title?: string
}>()

const collapsed = ref(false)
const cm = useCssModule()

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

const render = () => {
  return (
    <div class={[cm.sidebar, collapsed.value && cm.collapsed]} data-theme={props.theme}>
      <div class={cm.logo}>
        <Icon name="logo" size="24px" color="var(--color-primary)" />
        {!collapsed.value && <span class={cm.title}>{props.title || 'Admin Panel'}</span>}
      </div>
      
      <div class={cm.menuWrapper}>
        <Menu mode="vertical" collapse={collapsed.value} defaultActive="1" theme={props.theme as any}>
          <MenuItem index="1" icon="home">Home</MenuItem>
          <SubMenu index="2" title="Management" icon="setting">
            <MenuItem index="2-1">Users</MenuItem>
            <MenuItem index="2-2">Roles</MenuItem>
            <MenuItem index="2-3">Permissions</MenuItem>
          </SubMenu>
          <MenuItem index="3" icon="search">Search</MenuItem>
          <MenuItem index="4" icon="delete">Trash</MenuItem>
        </Menu>
      </div>

      <div class={cm.collapseBtn} onClick={toggleCollapse}>
        <Icon name={collapsed.value ? 'arrow-right' : 'arrow-left'} />
        {/* {!collapsed.value && <span style={{ marginLeft: '10px' }}>Collapse</span>} */}
      </div>
    </div>
  )
}
</script>

<style module>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-component);
  border-right: 1px solid var(--border-base);
  transition: width 0.3s;
  width: 240px;
  box-sizing: border-box;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-base);
  overflow: hidden;
  white-space: nowrap;
}

.title {
  margin-left: 10px;
  font-weight: bold;
  font-size: 18px;
  color: var(--text-primary);
}

.menuWrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.collapseBtn {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-top: 1px solid var(--border-base);
  color: var(--text-regular);
  transition: background-color 0.3s;
  overflow: hidden;
  white-space: nowrap;
}

.collapseBtn:hover {
  background-color: var(--bg-component-hover);
}
</style>