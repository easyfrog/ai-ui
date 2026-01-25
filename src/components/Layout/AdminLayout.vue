<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, watch, computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import MenuBar from '../MenuBar/MenuBar.vue'
import SideBar from '../SideBar/SideBar.vue'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
import BreadcrumbItem from '../Breadcrumb/BreadcrumbItem.vue'
import Card from '../Card/Card.vue'
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

// Auto-collapse when entering Mobile or Pad, expand when leaving
watch([isMobile, isPad], ([mobile, pad]) => {
  if (mobile || pad) {
    collapsed.value = true
  } else {
    collapsed.value = false // Auto expand on larger screens
  }
})

// Initialize state based on current screen
if (isMobile.value || isPad.value) {
  collapsed.value = true
}

const pageTitle = computed(() => route.meta.title as string || 'Dashboard')

const render = () => {
  return (
    <div class={cm.layout} data-theme={theme.value}>
      <SideBar 
        theme={theme.value} 
        title="AI-UI Admin" 
        collapsed={collapsed.value}
        onUpdate:collapsed={(v: boolean) => collapsed.value = v}
      />
      
      <div class={cm.main}>
        <MenuBar 
          theme={theme.value} 
          username="Admin User" 
          onUpdate:theme={handleThemeUpdate}
        />
        
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
}
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
</style>
