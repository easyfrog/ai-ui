<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, reactive } from 'vue'
import Form from '../components/Form/Form.vue'
import FormItem from '../components/Form/FormItem.vue'
import Input from '../components/Input/Input.vue'
import Select from '../components/Select/Select.vue'
import Switch from '../components/Switch/Switch.vue'
import Slider from '../components/Slider/Slider.vue'
import Radio from '../components/Radio/Radio.vue'
import Checkbox from '../components/Checkbox/Checkbox.vue'
import Button from '../components/Button/Button.vue'
import ButtonGroup from '../components/ButtonGroup/ButtonGroup.vue'
import DatePicker from '../components/DatePicker/DatePicker.vue'
import TimePicker from '../components/TimePicker/TimePicker.vue'
import ColorPicker from '../components/ColorPicker/ColorPicker.vue'
import Uploader from '../components/Uploader/Uploader.vue'
import InputTag from '../components/InputTag/InputTag.vue'

const cm = useCssModule()

const formData = reactive({
  name: '',
  desc: '',
  remember: true,
  gender: 'male',
  city: 'beijing',
  switch: true,
  slider: 50,
  date: '',
  time: '',
  color: '#409eff',
  tags: ['Vue', 'React']
})

const cityOptions = [
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'New York', value: 'ny' },
  { label: 'Tokyo', value: 'tokyo' }
]

const render = () => (
  <div>
    <h3 class={cm.title}>Form Components</h3>
    <div style={{ maxWidth: '600px' }}>
      <Form labelWidth="120px" model={formData}>
        <FormItem label="Input">
          <Input modelValue={formData.name} placeholder="Name" onUpdate:modelValue={v => formData.name = v as string} />
        </FormItem>
        <FormItem label="InputTag">
          <InputTag modelValue={formData.tags} placeholder="Add tags..." onUpdate:modelValue={v => formData.tags = v as string[]} />
        </FormItem>
        <FormItem label="Select">
          <Select modelValue={formData.city} options={cityOptions} onUpdate:modelValue={v => formData.city = v as string} />
        </FormItem>
        <FormItem label="Date Picker">
           <DatePicker modelValue={formData.date} onUpdate:modelValue={v => formData.date = v} placeholder="Select Date" />
        </FormItem>
        <FormItem label="Time Picker">
           <TimePicker modelValue={formData.time} onUpdate:modelValue={v => formData.time = v} placeholder="Select Time" />
        </FormItem>
        <FormItem label="Color Picker">
           <ColorPicker modelValue={formData.color} onUpdate:modelValue={v => formData.color = v} />
        </FormItem>
        <FormItem label="Switch">
          <Switch modelValue={formData.switch} onUpdate:modelValue={v => formData.switch = v as boolean} />
        </FormItem>
        <FormItem label="Slider">
          <Slider modelValue={formData.slider} onUpdate:modelValue={v => formData.slider = v as number} />
        </FormItem>
        <FormItem label="Radio">
           <Radio modelValue={formData.gender} value="male" label="Male" onUpdate:modelValue={v => formData.gender = v as string} />
           <Radio modelValue={formData.gender} value="female" label="Female" onUpdate:modelValue={v => formData.gender = v as string} />
        </FormItem>
        <FormItem label="Checkbox">
           <Checkbox modelValue={formData.remember} label="Remember me" onUpdate:modelValue={v => formData.remember = v} />
        </FormItem>
        <FormItem label="Uploader">
           <Uploader action="#" />
        </FormItem>
        <FormItem>
           <ButtonGroup>
              <Button type="primary">Submit</Button>
              <Button>Reset</Button>
           </ButtonGroup>
        </FormItem>
      </Form>
    </div>
  </div>
)
</script>

<style module>
.title {
  margin: 20px 0 20px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-base);
  padding-bottom: 10px;
}
</style>
