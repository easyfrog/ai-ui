<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'
import MenuBar from '../MenuBar/MenuBar.vue'
import SideBar from '../SideBar/SideBar.vue'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
import BreadcrumbItem from '../Breadcrumb/BreadcrumbItem.vue'
import Card from '../Card/Card.vue'

const props = defineProps<{
  theme?: string
}>()

const emit = defineEmits(['update:theme'])
const cm = useCssModule()

const render = () => {
  return (
    <div class={cm.layout} data-theme={props.theme}>
      <SideBar theme={props.theme} title="AI-UI Admin" />
      
      <div class={cm.main}>
        <MenuBar 
          theme={props.theme} 
          username="Admin User" 
          onUpdate:theme={(v: string) => emit('update:theme', v)}
        />
        
        <div class={cm.content}>
          <div class={cm.breadcrumbWrapper}>
            <Breadcrumb theme={props.theme}>
              <BreadcrumbItem to="/">Home</BreadcrumbItem>
              <BreadcrumbItem to="/dashboard">Dashboard</BreadcrumbItem>
              <BreadcrumbItem>Analysis</BreadcrumbItem>
            </Breadcrumb>
          </div>
          
          <div class={cm.page}>
            <Card class={cm.pageCard} theme={props.theme as any}>
               <h3>Main Content Area</h3>
               <p>This is a demo of the admin layout framework.</p>
               <p>The card automatically fills the available space.</p>
               {slots.default?.()}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useSlots } from 'vue'
const slots = useSlots()
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
  padding: 15px 20px;
  background-color: var(--bg-app);
}

.page {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
}

.pageCard {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>