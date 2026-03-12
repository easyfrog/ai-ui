<template>
  <render />
</template>

<script lang="tsx" setup>
import { computed, ref, useCssModule, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import SideBar from '../../components/SideBar/SideBar.vue'
import MenuBar from '../../components/MenuBar/MenuBar.vue'
import Menu from '../../components/Menu/Menu.vue'
import MenuItem from '../../components/Menu/MenuItem.vue'
import SubMenu from '../../components/Menu/SubMenu.vue'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.vue'
import BreadcrumbItem from '../../components/Breadcrumb/BreadcrumbItem.vue'
import Card from '../../components/Card/Card.vue'
import Dropdown from '../../components/Dropdown/Dropdown.vue'
import DropdownItem from '../../components/Dropdown/DropdownItem.vue'
import Avatar from '../../components/Avatar/Avatar.vue'
import Icon from '../../components/Icon/Icon.vue'
import { useScreen } from '../../hooks/useScreen'

const props = defineProps<{
  initialTheme?: string
}>()

const cm = useCssModule()
const { isMobile, isPad } = useScreen()
const collapsed = ref(false)
const theme = ref(props.initialTheme || 'light')
const route = useRoute()

const handleThemeUpdate = (newTheme: string) => {
  theme.value = newTheme
}

watch([isMobile, isPad], ([mobile, pad]) => {
  if (mobile || pad) {
    collapsed.value = true
  } else {
    collapsed.value = false
  }
})

if (isMobile.value || isPad.value) {
  collapsed.value = true
}

const pageTitle = computed(() => (route.meta.title as string) || 'Dashboard')

const activeSidebarIndex = computed(() => {
  const p = route.path
  if (p === '/') return 'home'
  if (p.startsWith('/basic')) return 'basic'
  if (p.startsWith('/form')) return 'form'
  if (p.startsWith('/data')) return 'data'
  if (p.startsWith('/feedback')) return 'feedback'
  if (p.startsWith('/navigation')) return 'navigation'
  if (p.startsWith('/theme-editor')) return 'theme-editor'
  return 'home'
})

const renderSidebarMenu = (menuCollapsed: boolean) => (
  <Menu
    mode="vertical"
    collapse={menuCollapsed}
    defaultActive={activeSidebarIndex.value}
    theme={theme.value as any}
  >
    <MenuItem index="home" icon="home" to="/">Home</MenuItem>
    <SubMenu index="components" title="Components" icon="search">
      <MenuItem index="basic" to="/basic">Basic</MenuItem>
      <MenuItem index="form" to="/form">Form</MenuItem>
      <MenuItem index="data" to="/data">Data</MenuItem>
      <MenuItem index="feedback" to="/feedback">Feedback</MenuItem>
      <MenuItem index="navigation" to="/navigation">Navigation</MenuItem>
      <MenuItem index="theme-editor" to="/theme-editor">Theme Editor</MenuItem>
    </SubMenu>
  </Menu>
)

const renderTopNav = () => (
  <Menu mode="horizontal" defaultActive="dashboard" theme={theme.value as any}>
    <MenuItem index="dashboard">Dashboard</MenuItem>
    <MenuItem index="projects">Projects</MenuItem>
    <MenuItem index="team">Team</MenuItem>
    <SubMenu index="resources" title="Resources" icon="folder">
      <MenuItem index="docs">Documentation</MenuItem>
      <MenuItem index="api">API Reference</MenuItem>
      <SubMenu index="more-tools" title="More Tools" icon="setting">
        <MenuItem index="tool-a">Tool A</MenuItem>
        <MenuItem index="tool-b">Tool B</MenuItem>
        <MenuItem index="tool-c">Tool C</MenuItem>
      </SubMenu>
      <MenuItem index="support">Support</MenuItem>
    </SubMenu>
  </Menu>
)

const renderThemeSwitch = () => (
  <div class={cm.themeSwitch}>
    <Dropdown>
      {{
        default: () => (
          <div class={cm.themeBtn}>
            <Icon name="setting" size="18px" />
          </div>
        ),
        content: () => (
          <div>
            <DropdownItem onClick={() => handleThemeUpdate('light')}>Light</DropdownItem>
            <DropdownItem onClick={() => handleThemeUpdate('dark')}>Dark</DropdownItem>
            <DropdownItem onClick={() => handleThemeUpdate('deep-blue')}>Deep Blue</DropdownItem>
            <DropdownItem onClick={() => handleThemeUpdate('matcha')}>Matcha (Fresh)</DropdownItem>
            <DropdownItem onClick={() => handleThemeUpdate('lavender')}>Lavender (Elegant)</DropdownItem>
            <DropdownItem onClick={() => handleThemeUpdate('warm')}>Latte (Warm)</DropdownItem>
          </div>
        )
      }}
    </Dropdown>
  </div>
)

const renderUserMenu = () => (
  <Dropdown>
    {{
      default: () => (
        <div class={cm.userInfo}>
          <Avatar>U</Avatar>
          <span class={cm.username}>Admin User</span>
        </div>
      ),
      content: () => (
        <div>
          <DropdownItem>Personal Settings</DropdownItem>
          <DropdownItem divided>Logout</DropdownItem>
        </div>
      )
    }}
  </Dropdown>
)

const render = () => (
  <div class={cm.layout} data-theme={theme.value}>
    <SideBar
      theme={theme.value}
      title="AI-UI Admin"
      collapsed={collapsed.value}
      onUpdate:collapsed={(v: boolean) => (collapsed.value = v)}
    >
      {{
        default: ({ collapsed: menuCollapsed }: { collapsed: boolean }) => renderSidebarMenu(menuCollapsed)
      }}
    </SideBar>

    <div class={cm.main}>
      <MenuBar theme={theme.value}>
        {{
          left: () => renderTopNav(),
          right: () => (
            <div class={cm.topRight}>
              {renderThemeSwitch()}
              {renderUserMenu()}
            </div>
          )
        }}
      </MenuBar>

      <div class={cm.content}>
        <div class={cm.breadcrumbWrapper}>
          <Breadcrumb theme={theme.value}>
            <BreadcrumbItem to="/">Home</BreadcrumbItem>
            <BreadcrumbItem>{pageTitle.value}</BreadcrumbItem>
          </Breadcrumb>
        </div>

        <div class={cm.page}>
          <Card class={cm.pageCard} theme={theme.value as any} header={pageTitle.value}>
            <RouterView />
          </Card>
        </div>
      </div>
    </div>
  </div>
)
</script>

<style module>
.layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-app);
  color: var(--text-primary);
  overflow: hidden;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.breadcrumbWrapper {
  padding: 20px 20px;
  background-color: var(--bg-app);
}

.page {
  flex: 1;
  padding: 0 20px 20px;
  box-sizing: border-box;
  overflow: auto;
}

.pageCard {
  min-height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.topRight {
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
  font-size: var(--font-size-base);
  color: var(--text-regular);
}
</style>
