<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'
import Menu from '../components/Menu/Menu.vue'
import MenuItem from '../components/Menu/MenuItem.vue'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb.vue'
import BreadcrumbItem from '../components/Breadcrumb/BreadcrumbItem.vue'

const cm = useCssModule()

const render = () => (
  <div>
    <h3>Menu</h3>
    <div style={{ marginBottom: '20px' }}>
      <h4>Horizontal Menu</h4>
      <Menu mode="horizontal" defaultActive="1">
        <MenuItem index="1">Processing Center</MenuItem>
        <MenuItem index="2">Workspace</MenuItem>
        <MenuItem index="3" disabled>Orders</MenuItem>
        <MenuItem index="4">Management</MenuItem>
      </Menu>
    </div>

    <h3 class={cm.title}>Breadcrumb</h3>
    <Breadcrumb>
      <BreadcrumbItem to="/">Home</BreadcrumbItem>
      <BreadcrumbItem to="/navigation">Navigation</BreadcrumbItem>
      <BreadcrumbItem>Current</BreadcrumbItem>
    </Breadcrumb>
  </div>
)
</script>

<style module>
.title {
  margin: 20px 0 10px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-base);
  padding-bottom: 5px;
}
.subtitle {
  margin: 10px 0;
  color: var(--text-regular);
}
</style>
