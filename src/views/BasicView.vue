<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, computed } from 'vue'
import Button from '../components/Button/Button.vue'
import ButtonGroup from '../components/ButtonGroup/ButtonGroup.vue'
import Link from '../components/Link/Link.vue'
import Text from '../components/Text/Text.vue'
import Color from '../components/Color/Color.vue'
import Icon from '../components/Icon/Icon.vue'
import Input from '../components/Input/Input.vue'
import { icons } from '../components/Icon/icons'

const cm = useCssModule()

const iconFilter = ref('')

const filteredIcons = computed(() => {
  const keyword = iconFilter.value.toLowerCase().trim()
  if (!keyword) return Object.keys(icons)
  return Object.keys(icons).filter(name => name.toLowerCase().includes(keyword))
})

const render = () => (
  <div>
    <h3 class={cm.title}>Buttons</h3>
    <div class={cm.row}>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="success">Success</Button>
      <Button type="danger">Danger</Button>
      <Button type="warning">Warning</Button>
      <Button disabled>Disabled</Button>
    </div>
    <div class={cm.row} style={{ alignItems: 'center' }}>
      <Button type="primary" size="large">Large</Button>
      <Button type="primary">Default</Button>
      <Button type="primary" size="small">Small</Button>
    </div>
    <div class={cm.row}>
      <ButtonGroup>
        <Button type="primary">Left</Button>
        <Button type="primary">Middle</Button>
        <Button type="primary">Right</Button>
      </ButtonGroup>
    </div>

    <h3 class={cm.title}>Links</h3>
    <div class={cm.row}>
      <Link href="#">Default Link</Link>
      <Link type="primary">Primary Link</Link>
      <Link type="success">Success Link</Link>
      <Link type="danger">Danger Link</Link>
      <Link type="warning">Warning Link</Link>
      <Link disabled>Disabled Link</Link>
    </div>

    <h3 class={cm.title}>Typography</h3>
    <div class={cm.row} style={{ alignItems: 'center' }}>
      <Text size="large" bold>Large Bold</Text>
      <Text type="primary">Primary</Text>
      <Text type="success">Success</Text>
      <Text type="info">Info</Text>
      <Text type="warning">Warning</Text>
      <Text type="danger">Danger</Text>
    </div>

    <h3 class={cm.title}>Colors</h3>
    <div class={cm.row} style={{ alignItems: 'center' }}>
       <Color color="#409eff" showValue />
       <Color color="#67c23a" size="30px" />
       <Color color="#e6a23c" />
       <Color color="#f56c6c" />
       <Color color="#909399" />
    </div>

    <h3 class={cm.title}>Icons</h3>
    <div class={cm.row}>
      <Input
        v-model={iconFilter.value}
        placeholder="Filter icons..."
        prefix="search"
        allowClear
      />
    </div>
    <div class={cm.iconGrid}>
       {filteredIcons.value.map(name => (
         <div class={cm.iconItem} key={name} title={name}>
           <Icon name={name} size="24px" />
           <span class={cm.iconName}>{name}</span>
         </div>
       ))}
    </div>
  </div>
)
</script>

<style module>
.row {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.iconGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
  padding: 10px 0;
}
.iconItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border: 1px solid var(--border-base);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--bg-component);
}
.iconItem:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.iconName {
  margin-top: 10px;
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
  word-break: break-all;
}
.title {
  margin: 20px 0 10px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-base);
  padding-bottom: 10px;
}
</style>
