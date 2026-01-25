<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'
import Menu from '../Menu/Menu.vue'
import MenuItem from '../Menu/MenuItem.vue'
import Avatar from '../Avatar/Avatar.vue'
import Dropdown from '../Dropdown/Dropdown.vue'
import DropdownItem from '../Dropdown/DropdownItem.vue'
import Icon from '../Icon/Icon.vue'

const props = defineProps<{
  theme?: string
  username?: string
  avatarUrl?: string
}>()

const emit = defineEmits(['logout', 'settings', 'update:theme'])
const cm = useCssModule()

const render = () => {
  return (
    <div class={cm.menubar} data-theme={props.theme}>
      <div class={cm.left}>
        <Menu mode="horizontal" defaultActive="1" theme={props.theme as any}>
          <MenuItem index="1">Dashboard</MenuItem>
          <MenuItem index="2">Projects</MenuItem>
          <MenuItem index="3">Team</MenuItem>
        </Menu>
      </div>
      <div class={cm.right}>
        <div class={cm.themeSwitch}>
           <Dropdown>
              {{
                default: () => <div class={cm.themeBtn}><Icon name="setting" size="18px" /></div>,
                content: () => (
                  <div>
                    <DropdownItem onClick={() => emit('update:theme', 'light')}>Light</DropdownItem>
                    <DropdownItem onClick={() => emit('update:theme', 'dark')}>Dark</DropdownItem>
                    <DropdownItem onClick={() => emit('update:theme', 'deep-blue')}>Deep Blue</DropdownItem>
                  </div>
                )
              }}
           </Dropdown>
        </div>

        <Dropdown>
          {{
            default: () => (
              <div class={cm.userInfo}>
                <Avatar src={props.avatarUrl}>{props.username?.[0] || 'U'}</Avatar>
                <span class={cm.username}>{props.username || 'User'}</span>
              </div>
            ),
            content: () => (
              <div>
                <DropdownItem onClick={() => emit('settings')}>Personal Settings</DropdownItem>
                <DropdownItem divided onClick={() => emit('logout')}>Logout</DropdownItem>
              </div>
            )
          }}
        </Dropdown>
      </div>
    </div>
  )
}
</script>

<style module>
.menubar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: var(--bg-component);
  border-bottom: 1px solid var(--border-base);
  padding: 0 20px;
  box-sizing: border-box;
}

.left {
  flex: 1;
}

.right {
  display: flex;
  align-items: center;
}

.themeSwitch {
  margin-right: 20px;
  cursor: pointer;
}

.themeBtn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-regular);
  transition: background-color 0.3s;
}

.themeBtn:hover {
  background-color: var(--bg-component-hover);
  color: var(--color-primary);
}

.userInfo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 10px;
  font-size: 14px;
  color: var(--text-regular);
}
</style>