<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, ref, computed } from 'vue'

const props = defineProps<{
  modelValue?: Date
  theme?: string
}>()

const emit = defineEmits(['update:modelValue'])
const cm = useCssModule()

const currentDate = ref(props.modelValue || new Date())
const currentMonth = ref(currentDate.value.getMonth())
const currentYear = ref(currentDate.value.getFullYear())

const days = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1)
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const firstDay = date.getDay()
  const res = []
  
  for (let i = 0; i < firstDay; i++) {
    res.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    res.push(i)
  }
  return res
})

const monthName = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleString('default', { month: 'long', year: 'numeric' })
})

const handlePrev = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const handleNext = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const render = () => {
  return (
    <div class={cm.calendar} data-theme={props.theme}>
      <div class={cm.header}>
        <button onClick={handlePrev}>&lt;</button>
        <span>{monthName.value}</span>
        <button onClick={handleNext}>&gt;</button>
      </div>
      <div class={cm.body}>
        <div class={cm.weekdays}>
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>
        <div class={cm.days}>
          {days.value.map((d, i) => (
            <div key={i} class={[cm.day, !d && cm.empty]}>{d}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
</script>

<style module>
.calendar {
  width: 300px;
  border: 1px solid var(--border-base);
  border-radius: 4px;
  background-color: var(--bg-component);
  color: var(--text-regular);
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid var(--border-base);
}

.body {
  padding: 10px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.day {
  text-align: center;
  padding: 5px;
  cursor: pointer;
  border-radius: 2px;
}
.day:hover:not(.empty) {
  background-color: var(--color-primary-light-9);
  color: var(--color-primary);
}

.empty {
  cursor: default;
}
</style>
