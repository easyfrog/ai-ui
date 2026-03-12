<template>
  <render />
</template>

<script lang="tsx" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, useCssModule, watch } from 'vue'
import Button from '../components/Button/Button.vue'
import Input from '../components/Input/Input.vue'
import ColorPicker from '../components/ColorPicker/ColorPicker.vue'
import Slider from '../components/Slider/Slider.vue'
import Text from '../components/Text/Text.vue'
import Tag from '../components/Tag/Tag.vue'

type ThemeFileV1 = {
  version: 1
  name?: string
  tokens: Record<string, string>
}

const cm = useCssModule()

const colorTokens = [
  { key: '--bg-app', label: 'bg-app' },
  { key: '--bg-overlay', label: 'bg-overlay' },
  { key: '--bg-component', label: 'bg-component' },
  { key: '--bg-component-hover', label: 'bg-component-hover' },
  { key: '--bg-component-active', label: 'bg-component-active' },
  { key: '--text-primary', label: 'text-primary' },
  { key: '--text-regular', label: 'text-regular' },
  { key: '--text-secondary', label: 'text-secondary' },
  { key: '--text-placeholder', label: 'text-placeholder' },
  { key: '--border-base', label: 'border-base' },
  { key: '--border-hover', label: 'border-hover' },
  { key: '--color-primary', label: 'color-primary' },
  { key: '--color-success', label: 'color-success' },
  { key: '--color-warning', label: 'color-warning' },
  { key: '--color-danger', label: 'color-danger' },
  { key: '--color-info', label: 'color-info' }
]

const sizeTokens = [
  { key: '--font-size-small', label: 'font-size-small', min: 10, max: 18, step: 1 },
  { key: '--font-size-base', label: 'font-size-base', min: 12, max: 22, step: 1 },
  { key: '--font-size-large', label: 'font-size-large', min: 14, max: 26, step: 1 },
  { key: '--font-size-xl', label: 'font-size-xl', min: 16, max: 32, step: 1 }
]

const themeName = ref('custom-theme')
const previewEnabled = ref(true)
const fileInputRef = ref<HTMLInputElement | null>(null)

const tokens = reactive<Record<string, string>>({})
const baselineTokens = reactive<Record<string, string>>({})

const tokenKeys = computed(() => [
  ...colorTokens.map(t => t.key),
  ...sizeTokens.map(t => t.key),
  '--font-family-base'
])

const getThemeHost = (): HTMLElement | null => {
  return document.querySelector('#app > [data-theme]') as HTMLElement | null
}

const normalizeCssValue = (v: string) => v.trim().replace(/\s+/g, ' ')

const ensureStyleEl = () => {
  const existing = document.getElementById('aui-theme-editor-style') as HTMLStyleElement | null
  if (existing) return existing
  const el = document.createElement('style')
  el.id = 'aui-theme-editor-style'
  document.head.appendChild(el)
  return el
}

const removeStyleEl = () => {
  const el = document.getElementById('aui-theme-editor-style')
  if (el?.parentNode) el.parentNode.removeChild(el)
}

const buildOverrideCss = () => {
  const lines = Object.entries(tokens)
    .filter(([, v]) => !!v && v.trim().length > 0)
    .map(([k, v]) => `  ${k}: ${v} !important;`)
    .join('\n')
  return `[data-theme], :root {\n${lines}\n}\n`
}

const applyPreview = () => {
  if (!previewEnabled.value) {
    removeStyleEl()
    return
  }
  const el = ensureStyleEl()
  el.textContent = buildOverrideCss()
}

const readBaseline = () => {
  const host = getThemeHost()
  const hostStyle = host ? getComputedStyle(host) : getComputedStyle(document.documentElement)
  const bodyStyle = getComputedStyle(document.body)

  tokenKeys.value.forEach((k) => {
    let v = ''
    if (k === '--font-family-base') {
      v = normalizeCssValue(bodyStyle.fontFamily || '')
    } else {
      v = normalizeCssValue(hostStyle.getPropertyValue(k) || '')
    }
    if (!v) {
      if (k === '--font-family-base') v = 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
      if (k === '--font-size-small') v = '12px'
      if (k === '--font-size-base') v = '14px'
      if (k === '--font-size-large') v = '16px'
      if (k === '--font-size-xl') v = '18px'
    }
    baselineTokens[k] = v
    tokens[k] = v
  })
}

const resetToBaseline = () => {
  tokenKeys.value.forEach((k) => {
    tokens[k] = baselineTokens[k]
  })
}

const toPxNumber = (v: string) => {
  const n = Number.parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

const setPxToken = (k: string, n: number) => {
  const v = `${Math.round(n)}px`
  tokens[k] = v
}

const downloadTheme = () => {
  const payload: ThemeFileV1 = {
    version: 1,
    name: themeName.value,
    tokens: Object.fromEntries(tokenKeys.value.map(k => [k, tokens[k]]))
  }
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(themeName.value || 'theme').trim() || 'theme'}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const openImport = () => {
  fileInputRef.value?.click()
}

const applyThemeFile = (fileData: unknown) => {
  const parsed = fileData as ThemeFileV1
  if (!parsed || parsed.version !== 1 || typeof parsed.tokens !== 'object' || !parsed.tokens) return
  if (typeof parsed.name === 'string' && parsed.name.trim()) themeName.value = parsed.name.trim()
  tokenKeys.value.forEach((k) => {
    const v = parsed.tokens[k]
    if (typeof v === 'string' && v.trim()) tokens[k] = normalizeCssValue(v)
  })
}

const onImportChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const text = await file.text()
    applyThemeFile(JSON.parse(text))
  } finally {
    input.value = ''
  }
}

watch(tokens, () => applyPreview(), { deep: true })
watch(previewEnabled, () => applyPreview())

onMounted(() => {
  readBaseline()
  applyPreview()
})

onBeforeUnmount(() => {
  removeStyleEl()
})

const renderTokenRow = (label: string, control: any) => (
  <div class={cm.tokenRow} key={label}>
    <div class={cm.tokenLabel}>
      <Text>{label}</Text>
    </div>
    <div class={cm.tokenControl}>
      {control}
    </div>
  </div>
)

const renderColorEditor = () => (
  <div class={cm.section}>
    <div class={cm.sectionTitle}>Colors</div>
    <div class={cm.tokens}>
      {colorTokens.map(t => renderTokenRow(
        t.label,
        <div class={cm.colorRow}>
          <ColorPicker
            modelValue={tokens[t.key]}
            onUpdate:modelValue={(v: string) => tokens[t.key] = v}
          />
          <Input
            modelValue={tokens[t.key]}
            onUpdate:modelValue={(v: string) => tokens[t.key] = v}
            placeholder="#RRGGBB / var(...)"
          />
        </div>
      ))}
    </div>
  </div>
)

const renderTypographyEditor = () => (
  <div class={cm.section}>
    <div class={cm.sectionTitle}>Typography</div>
    <div class={cm.tokens}>
      {renderTokenRow(
        'font-family-base',
        <Input
          modelValue={tokens['--font-family-base']}
          onUpdate:modelValue={(v: string) => tokens['--font-family-base'] = v}
          placeholder="Inter, system-ui, ..."
        />
      )}
      {sizeTokens.map(t => renderTokenRow(
        t.label,
        <div class={cm.sizeRow}>
          <div class={cm.sizeSlider}>
            <Slider
              modelValue={toPxNumber(tokens[t.key])}
              min={t.min}
              max={t.max}
              step={t.step}
              onUpdate:modelValue={(v: number) => setPxToken(t.key, v)}
            />
          </div>
          <div class={cm.sizeValue}>
            <Input
              modelValue={tokens[t.key]}
              onUpdate:modelValue={(v: string) => tokens[t.key] = normalizeCssValue(v)}
              placeholder="14px"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const renderPreview = () => (
  <div class={cm.preview}>
    <div class={cm.sectionTitle}>Preview</div>
    <div class={cm.previewBlock}>
      <div class={cm.previewRow}>
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="success">Success</Button>
        <Button type="danger">Danger</Button>
      </div>
      <div class={cm.previewRow}>
        <Input placeholder="Input" />
        <Tag type="primary">Tag</Tag>
        <Text size="large">Large Text</Text>
      </div>
      <div class={cm.previewRow}>
        <div class={cm.previewCard}>
          <div class={cm.previewCardTitle}>Card</div>
          <div class={cm.previewCardBody}>Background / border / text should follow the tokens.</div>
        </div>
      </div>
    </div>
  </div>
)

const renderToolbar = () => (
  <div class={cm.toolbar}>
    <div class={cm.toolbarLeft}>
      <div class={cm.field}>
        <Text>Theme name</Text>
        <Input
          modelValue={themeName.value}
          onUpdate:modelValue={(v: string) => themeName.value = v}
        />
      </div>
      <label class={cm.switch}>
        <input
          type="checkbox"
          checked={previewEnabled.value}
          onChange={(e: Event) => previewEnabled.value = (e.target as HTMLInputElement).checked}
        />
        <span class={cm.switchLabel}>Preview override</span>
      </label>
    </div>
    <div class={cm.toolbarRight}>
      <Button onClick={openImport}>Load theme</Button>
      <Button onClick={downloadTheme} type="primary">Save theme</Button>
      <Button onClick={resetToBaseline}>Reset</Button>
      <input ref={fileInputRef} class={cm.fileInput} type="file" accept="application/json" onChange={onImportChange} />
    </div>
  </div>
)

const render = () => (
  <div class={cm.page}>
    {renderToolbar()}
    <div class={cm.grid}>
      <div class={cm.editor}>
        {renderColorEditor()}
        {renderTypographyEditor()}
      </div>
      {renderPreview()}
    </div>
  </div>
)
</script>

<style module>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px;
  border: 1px solid var(--border-base);
  border-radius: 8px;
  background-color: var(--bg-component);
}

.toolbarLeft {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.toolbarRight {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 240px;
}

.switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-regular);
  font-size: var(--font-size-base);
  user-select: none;
}

.switchLabel {
  white-space: nowrap;
}

.fileInput {
  display: none;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 16px;
}

.editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section {
  border: 1px solid var(--border-base);
  border-radius: 8px;
  background-color: var(--bg-component);
  padding: 12px;
}

.sectionTitle {
  font-size: var(--font-size-large);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.tokens {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tokenRow {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 12px;
  align-items: center;
}

.tokenLabel {
  color: var(--text-secondary);
}

.tokenControl {
  min-width: 0;
}

.colorRow {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 10px;
  align-items: center;
}

.sizeRow {
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 10px;
  align-items: center;
}

.sizeSlider {
  min-width: 0;
}

.sizeValue {
  min-width: 0;
}

.preview {
  border: 1px solid var(--border-base);
  border-radius: 8px;
  background-color: var(--bg-component);
  padding: 12px;
  height: fit-content;
  position: sticky;
  top: 0;
}

.previewBlock {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.previewRow {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.previewCard {
  width: 100%;
  border: 1px solid var(--border-base);
  border-radius: 8px;
  background-color: var(--bg-overlay);
  padding: 12px;
}

.previewCardTitle {
  font-size: var(--font-size-large);
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 8px;
}

.previewCardBody {
  font-size: var(--font-size-base);
  color: var(--text-regular);
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .preview {
    position: static;
  }
  .tokenRow {
    grid-template-columns: 1fr;
  }
}
</style>
