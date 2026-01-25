<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, reactive, ref } from 'vue'
import Card from './components/Card/Card.vue'
import Button from './components/Button/Button.vue'
import ButtonGroup from './components/ButtonGroup/ButtonGroup.vue'
import Input from './components/Input/Input.vue'
import Checkbox from './components/Checkbox/Checkbox.vue'
import Radio from './components/Radio/Radio.vue'
import Select from './components/Select/Select.vue'
import Switch from './components/Switch/Switch.vue'
import Slider from './components/Slider/Slider.vue'
import Collapse from './components/Collapse/Collapse.vue'
import CollapseItem from './components/Collapse/CollapseItem.vue'
import Pagination from './components/Pagination/Pagination.vue'
import Dialog from './components/Dialog/Dialog.vue'
import Drawer from './components/Drawer/Drawer.vue'
import Popover from './components/Popover/Popover.vue'
import Message from './components/Message/Message.vue'
import Notification from './components/Notification/Notification.vue'
import Toast from './components/Toast/Toast.vue'
import Table from './components/Table/Table.vue'
import Menu from './components/Menu/Menu.vue'
import MenuItem from './components/Menu/MenuItem.vue'
import Tree from './components/Tree/Tree.vue'
import Carousel from './components/Carousel/Carousel.vue'
import CarouselItem from './components/Carousel/CarouselItem.vue'
import Form from './components/Form/Form.vue'
import FormItem from './components/Form/FormItem.vue'
import Link from './components/Link/Link.vue'
import Text from './components/Text/Text.vue'
import Color from './components/Color/Color.vue'
import Icon from './components/Icon/Icon.vue'
import Image from './components/Image/Image.vue'
import Tag from './components/Tag/Tag.vue'
import Avatar from './components/Avatar/Avatar.vue'
import Badge from './components/Badge/Badge.vue'
import DatePicker from './components/DatePicker/DatePicker.vue'
import TimePicker from './components/TimePicker/TimePicker.vue'
import ColorPicker from './components/ColorPicker/ColorPicker.vue'
import Uploader from './components/Uploader/Uploader.vue'
import Calendar from './components/Calendar/Calendar.vue'
import Progress from './components/Progress/Progress.vue'
import Loading from './components/Loading/Loading.vue'

const cm = useCssModule()

// Theme State
const themes = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Deep Blue', value: 'deep-blue' }
]

const cardThemes = reactive<Record<string, any>>({
  basic: 'light',
  form: 'dark',
  data: 'deep-blue',
  navigation: 'light',
  feedback: 'light',
  others: 'light'
})

// Form Data
const formData = reactive({
  name: '',
  desc: '',
  remember: true,
  gender: 'male',
  city: 'beijing',
  switch: true,
  slider: 50
})

const cityOptions = [
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'New York', value: 'ny' },
  { label: 'Tokyo', value: 'tokyo' }
]

// Feedback State
const feedback = reactive({
  dialog: false,
  drawer: false,
  message: false,
  notification: false,
  toast: false
})

const showMessage = () => {
  feedback.message = true
  setTimeout(() => feedback.message = false, 3000)
}

const showNotification = () => {
  feedback.notification = true
  setTimeout(() => feedback.notification = false, 4500)
}

const showToast = () => {
  feedback.toast = true
  setTimeout(() => feedback.toast = false, 2000)
}

// Data for Table/Tree
const tableData = [
  { date: '2024-01-01', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2024-01-02', name: 'Jerry', address: 'No. 189, Grove St, Los Angeles' },
  { date: '2024-01-03', name: 'Spike', address: 'No. 189, Grove St, Los Angeles' },
]

const tableColumns = [
  { prop: 'date', label: 'Date', width: '120px' },
  { prop: 'name', label: 'Name', width: '100px' },
  { prop: 'address', label: 'Address' }
]

const treeData = reactive([
  {
    label: 'Level 1',
    children: [
      {
        label: 'Level 2-1',
        children: [
          { label: 'Level 3-1' },
          { label: 'Level 3-2' }
        ]
      },
      { label: 'Level 2-2' }
    ]
  }
])

// New Components State
const dateVal = ref('')
const timeVal = ref('')
const colorVal = ref('#409eff')
const progressVal = ref(30)
const loading = ref(false)
const carouselType = ref<'fade' | 'slide'>('slide')

// Collapse
const activeCollapse = ref(['1'])

// Pagination
const currentPage = ref(1)

// Render Helper for Theme Switcher
const renderThemeSwitcher = (key: string) => {
  return (
    <div class={cm.themeSwitcher}>
      <span style={{ marginRight: '8px', fontSize: '14px' }}>Theme:</span>
      <Select 
        modelValue={cardThemes[key]} 
        options={themes} 
        onUpdate:modelValue={(v: any) => cardThemes[key] = v}
        style={{ width: '120px' }}
      />
    </div>
  )
}

import AdminLayout from './components/Layout/AdminLayout.vue'

const showAdmin = ref(false)
const theme = ref('light')

const render = () => {
  if (showAdmin.value) {
    return (
      <div style={{ height: '100vh' }}>
        <AdminLayout theme={theme.value} onUpdate:theme={(v: string) => theme.value = v}>
           <div style={{ marginTop: '20px' }}>
              <Button type="primary" onClick={() => showAdmin.value = false}>Back to Component Demo</Button>
           </div>
        </AdminLayout>
      </div>
    )
  }

  return (
    <div class={cm.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>AI-UI Component Gallery</h1>
        <Button onClick={() => showAdmin.value = true}>View Admin Layout</Button>
      </div>
      
      {/* 1. Basic & Form Components */}
      <div class={cm.section}>
        <div class={cm.sectionHeader}>
          <h2>Basic & Form</h2>
          {renderThemeSwitcher('basic')}
        </div>
        <Card theme={cardThemes.basic} header="Form Elements">
          <Form labelWidth="100px" theme={cardThemes.basic} model={formData}>
            <FormItem label="Input">
              <Input modelValue={formData.name} placeholder="Name" onUpdate:modelValue={v => formData.name = v as string} />
            </FormItem>
            <FormItem label="Select">
              <Select modelValue={formData.city} options={cityOptions} onUpdate:modelValue={v => formData.city = v as string} />
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
             <FormItem label="Buttons">
               <ButtonGroup>
                  <Button type="primary">Save</Button>
                  <Button>Cancel</Button>
               </ButtonGroup>
            </FormItem>
          </Form>
        </Card>
      </div>

      {/* 2. Data Display */}
      <div class={cm.section}>
        <div class={cm.sectionHeader}>
          <h2>Data Display</h2>
          {renderThemeSwitcher('data')}
        </div>
        <Card theme={cardThemes.data} header="Table & Tree & Collapse">
           <div style={{ marginBottom: '20px' }}>
             <h3>Table</h3>
             <Table data={tableData} columns={tableColumns} border stripe theme={cardThemes.data} />
             <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
               <Pagination 
                  total={50} 
                  currentPage={currentPage.value} 
                  onUpdate:currentPage={v => currentPage.value = v}
                  theme={cardThemes.data}
                />
             </div>
           </div>
           
           <div class={cm.row}>
             <div style={{ flex: 1, marginRight: '20px' }}>
               <h3>Tree</h3>
               <div style={{ border: '1px solid var(--border-base)', padding: '10px', borderRadius: '4px' }}>
                 <Tree data={treeData} theme={cardThemes.data} />
               </div>
             </div>
             <div style={{ flex: 1 }}>
               <h3>Collapse</h3>
               <Collapse modelValue={activeCollapse.value} onUpdate:modelValue={v => activeCollapse.value = v} theme={cardThemes.data}>
                 <CollapseItem title="Consistency" name="1">
                   <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to.</div>
                 </CollapseItem>
                 <CollapseItem title="Feedback" name="2">
                   <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects.</div>
                 </CollapseItem>
               </Collapse>
             </div>
           </div>
        </Card>
      </div>

      {/* 3. Navigation & Others */}
      <div class={cm.section}>
        <div class={cm.sectionHeader}>
           <h2>Navigation & Others</h2>
           {renderThemeSwitcher('navigation')}
        </div>
        <Card theme={cardThemes.navigation} header="Menu & Carousel">
           <div style={{ marginBottom: '20px' }}>
              <h3>Horizontal Menu</h3>
              <Menu mode="horizontal" defaultActive="1" theme={cardThemes.navigation}>
                <MenuItem index="1">Processing Center</MenuItem>
                <MenuItem index="2">Workspace</MenuItem>
                <MenuItem index="3" disabled>Orders</MenuItem>
                <MenuItem index="4">Management</MenuItem>
              </Menu>
           </div>
           
           <div>
             <h3>Carousel</h3>
             <div style={{ marginBottom: '10px' }}>
                <span style={{ marginRight: '10px' }}>Mode:</span>
                <ButtonGroup>
                  <Button type={carouselType.value === 'fade' ? 'primary' : 'default'} onClick={() => carouselType.value = 'fade'}>Fade</Button>
                  <Button type={carouselType.value === 'slide' ? 'primary' : 'default'} onClick={() => carouselType.value = 'slide'}>Slide</Button>
                </ButtonGroup>
             </div>
             <Carousel height="200px" theme={cardThemes.navigation} type={carouselType.value} arrow={carouselType.value === 'slide' ? 'always' : 'hover'}>
               <CarouselItem>
                 <div style={{ height: '100%', background: '#d3dce6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <h3>Slide 1</h3>
                 </div>
               </CarouselItem>
               <CarouselItem>
                 <div style={{ height: '100%', background: '#99a9bf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <h3>Slide 2</h3>
                 </div>
               </CarouselItem>
               <CarouselItem>
                 <div style={{ height: '100%', background: '#d3dce6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <h3>Slide 3</h3>
                 </div>
               </CarouselItem>
             </Carousel>
           </div>
        </Card>
      </div>

      {/* 5. New Components */}
      <div class={cm.section}>
        <div class={cm.sectionHeader}>
          <h2>New Components</h2>
          {renderThemeSwitcher('others')}
        </div>
        <Card theme={cardThemes.others} header="Basic & Text">
           <div class={cm.row}>
             <Link href="#">Default Link</Link>
             <Link type="primary">Primary Link</Link>
             <Link type="success">Success Link</Link>
             <Link type="danger">Danger Link</Link>
             <Link type="warning">Warning Link</Link>
           </div>
           <div class={cm.row} style={{ alignItems: 'center' }}>
             <Text size="large" bold>Large Bold Text</Text>
             <Text type="primary">Primary Text</Text>
             <Text type="success">Success Text</Text>
             <Text type="info">Info Text</Text>
             <Text type="warning">Warning Text</Text>
             <Text type="danger">Danger Text</Text>
           </div>
           <div class={cm.row} style={{ alignItems: 'center' }}>
             <Color color="#409eff" showValue />
             <Color color="#67c23a" size="30px" />
             <Color color="red" />
           </div>
           <div class={cm.row} style={{ alignItems: 'center' }}>
             <Icon name="search" size="20px" />
             <Icon name="home" color="blue" />
             <Icon name="setting" />
             <Tag>Tag 1</Tag>
             <Tag type="success">Tag 2</Tag>
             <Tag type="warning">Tag 3</Tag>
             <Tag type="danger">Tag 4</Tag>
           </div>
           <div class={cm.row} style={{ alignItems: 'center' }}>
              <Avatar src="https://avatars.githubusercontent.com/u/1?v=4" />
              <Avatar>User</Avatar>
              <Badge value={12}>
                <Button>Comments</Button>
              </Badge>
              <Badge isDot>
                <Avatar>A</Avatar>
              </Badge>
           </div>
           <div class={cm.row}>
              <Image src="https://via.placeholder.com/150" width="100px" height="100px" fit="cover" />
              <Image src="https://via.placeholder.com/150" width="100px" height="100px" fit="contain" />
           </div>
        </Card>

        <div style={{ height: '20px' }}></div>

        <Card theme={cardThemes.others} header="Form Enhanced">
          <div class={cm.row}>
             <div style={{ width: '220px' }}>
                <p>DatePicker</p>
                <DatePicker modelValue={dateVal.value} onUpdate:modelValue={v => dateVal.value = v} placeholder="Select Date" />
             </div>
             <div style={{ width: '220px' }}>
                <p>TimePicker</p>
                <TimePicker modelValue={timeVal.value} onUpdate:modelValue={v => timeVal.value = v} placeholder="Select Time" />
             </div>
             <div style={{ width: '220px' }}>
                <p>ColorPicker</p>
                <ColorPicker modelValue={colorVal.value} onUpdate:modelValue={v => colorVal.value = v} />
             </div>
          </div>
          <div class={cm.row}>
             <div style={{ width: '100%' }}>
               <p>Uploader</p>
               <Uploader action="#" />
             </div>
          </div>
        </Card>

        <div style={{ height: '20px' }}></div>

        <Card theme={cardThemes.others} header="Data & Feedback Enhanced">
           <div class={cm.row}>
              <div style={{ flex: 1 }}>
                <h3>Calendar</h3>
                <Calendar modelValue={new Date()} />
              </div>
              <div style={{ flex: 1, marginLeft: '20px' }}>
                <h3>Progress</h3>
                <Progress percentage={progressVal.value} />
                <Progress percentage={70} status="success" strokeWidth={15} textInside />
                <Progress percentage={50} status="exception" type="circle" />
                <div style={{ marginTop: '10px' }}>
                   <Button onClick={() => progressVal.value = Math.max(0, progressVal.value - 10)}>-</Button>
                   <Button onClick={() => progressVal.value = Math.min(100, progressVal.value + 10)}>+</Button>
                </div>

                <h3>Loading</h3>
                <div style={{ position: 'relative', height: '100px', border: '1px solid #eee' }}>
                   <Loading loading={loading.value} text="Loading..." />
                   <div style={{ padding: '10px' }}>Content area...</div>
                </div>
                <Button onClick={() => loading.value = !loading.value} style={{ marginTop: '10px' }}>Toggle Loading</Button>
              </div>
           </div>
        </Card>
      </div>

       {/* 4. Feedback & Overlays */}
      <div class={cm.section}>
         <div class={cm.sectionHeader}>
           <h2>Feedback & Overlays</h2>
           {renderThemeSwitcher('feedback')}
        </div>
        <Card theme={cardThemes.feedback} header="Dialogs & Popups">
          <div class={cm.row}>
            <Button onClick={() => feedback.dialog = true}>Open Dialog</Button>
            <Button onClick={() => feedback.drawer = true}>Open Drawer</Button>
            <Popover content="This is a popover content" trigger="click" theme={cardThemes.feedback}>
               <Button>Click Popover</Button>
            </Popover>
          </div>
          <div class={cm.row}>
            <Button type="success" onClick={showMessage}>Message</Button>
            <Button type="warning" onClick={showNotification}>Notification</Button>
            <Button type="danger" onClick={showToast}>Toast</Button>
          </div>
        </Card>
      </div>

      {/* Overlays */}
      <Dialog 
        modelValue={feedback.dialog} 
        onUpdate:modelValue={v => feedback.dialog = v}
        title="Tips"
        theme={cardThemes.feedback}
      >
        <span>This is a dialog message</span>
        {{
          footer: () => (
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => feedback.dialog = false} style={{ marginRight: '10px' }}>Cancel</Button>
              <Button type="primary" onClick={() => feedback.dialog = false}>Confirm</Button>
            </div>
          )
        }}
      </Dialog>

      <Drawer
        modelValue={feedback.drawer}
        onUpdate:modelValue={v => feedback.drawer = v}
        title="Drawer Title"
        theme={cardThemes.feedback}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      
      {feedback.message && <Message message="This is a success message" type="success" onClose={() => feedback.message = false} theme={cardThemes.feedback} />}
      {feedback.notification && <Notification title="Notification" message="This is a notification message" type="warning" onClose={() => feedback.notification = false} theme={cardThemes.feedback} />}
      {feedback.toast && <Toast message="This is a toast message" onClose={() => feedback.toast = false} theme={cardThemes.feedback} />}

    </div>
  )
}
</script>

<style module>
.container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}
.section {
  margin-bottom: 40px;
}
.sectionHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.themeSwitcher {
  display: flex;
  align-items: center;
}
.row {
  margin-top: 15px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
  flex-wrap: wrap;
}
h1, h2, h3 {
  color: var(--text-primary);
}
</style>