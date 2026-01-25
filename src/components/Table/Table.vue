<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'

const props = defineProps<{
  data: any[]
  columns: { prop: string; label: string; width?: string }[]
  stripe?: boolean
  border?: boolean
  theme?: 'light' | 'dark' | 'deep-blue'
}>()

const cm = useCssModule()

const render = () => {
  return (
    <div 
      class={[cm.tableWrapper, props.border && cm.border]} 
      data-theme={props.theme}
    >
      <table class={cm.table} cellspacing="0" cellpadding="0">
        <colgroup>
          {props.columns.map(col => (
            <col width={col.width} />
          ))}
        </colgroup>
        <thead class={cm.thead}>
          <tr>
            {props.columns.map(col => (
              <th class={cm.cell}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.data.map((row, index) => (
            <tr class={[cm.row, props.stripe && index % 2 === 1 && cm.striped]}>
              {props.columns.map(col => (
                <td class={cm.cell}>{row[col.prop]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
</script>

<style module>
.tableWrapper {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  max-width: 100%;
  background-color: var(--bg-component);
  font-size: 14px;
  color: var(--text-regular);
}

.table {
  table-layout: fixed;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.thead {
  color: var(--text-primary);
  font-weight: 500;
}

.thead th {
  background-color: var(--bg-component-hover);
  border-bottom: 1px solid var(--border-base);
  text-align: left;
}

.cell {
  padding: 12px;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
  border-bottom: 1px solid var(--border-base);
}

.row {
  transition: background-color .25s ease;
}

.row:hover {
  background-color: var(--bg-component-hover);
}

.striped {
  background-color: var(--bg-app); /* Use slightly different bg for stripe */
}

.border {
  border: 1px solid var(--border-base);
  border-bottom: none;
}

.border .cell {
  border-right: 1px solid var(--border-base);
}

.border .cell:last-child {
  border-right: none;
}
</style>
