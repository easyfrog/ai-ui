<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'

const props = defineProps<{
  percentage: number
  status?: 'success' | 'warning' | 'exception'
  strokeWidth?: number
  textInside?: boolean
  type?: 'line' | 'circle' | 'dashboard'
  theme?: string
}>()

const cm = useCssModule()

const render = () => {
  // Simple implementation for circle/dashboard types (placeholder)
  if (props.type === 'circle' || props.type === 'dashboard') {
    return (
      <div class={cm.progress} data-theme={props.theme}>
        <div class={cm.circlePlaceholder}>
          {props.type} progress not fully implemented
          <br/>
          {props.percentage}%
        </div>
      </div>
    )
  }

  return (
    <div class={cm.progress} data-theme={props.theme}>
      <div class={cm.barOuter} style={{ height: `${props.strokeWidth || 6}px` }}>
        <div 
          class={[cm.barInner, cm[props.status || 'default']]} 
          style={{ width: `${props.percentage}%` }}
        >
           {props.textInside && <div class={cm.innerText}>{props.percentage}%</div>}
        </div>
      </div>
      {!props.textInside && <div class={cm.text}>{props.percentage}%</div>}
    </div>
  )
}
</script>

<style module>
.progress {
  display: flex;
  align-items: center;
}

.barOuter {
  flex: 1;
  background-color: var(--bg-component-active);
  border-radius: 100px;
  overflow: hidden;
  position: relative;
  vertical-align: middle;
}

.barInner {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 100px;
  transition: width .6s ease;
  background-color: var(--color-primary);
}

.success { background-color: var(--color-success); }
.warning { background-color: var(--color-warning); }
.exception { background-color: var(--color-danger); }

.text {
  font-size: 14px;
  margin-left: 10px;
  color: var(--text-regular);
  min-width: 50px;
}

.innerText {
  color: #fff;
  font-size: 12px;
  margin: 0 5px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding-right: 5px;
}

.circle {
  position: relative;
  width: 100%;
  height: 100%;
}

.circleText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--text-primary);
  text-align: center;
}
</style>
