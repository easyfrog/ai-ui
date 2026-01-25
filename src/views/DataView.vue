<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, reactive, ref } from 'vue'
import Table from '../components/Table/Table.vue'
import Pagination from '../components/Pagination/Pagination.vue'
import Tree from '../components/Tree/Tree.vue'
import Collapse from '../components/Collapse/Collapse.vue'
import CollapseItem from '../components/Collapse/CollapseItem.vue'
import Tag from '../components/Tag/Tag.vue'
import Avatar from '../components/Avatar/Avatar.vue'
import Badge from '../components/Badge/Badge.vue'
import Image from '../components/Image/Image.vue'
import Calendar from '../components/Calendar/Calendar.vue'
import Progress from '../components/Progress/Progress.vue'
import Loading from '../components/Loading/Loading.vue'
import Carousel from '../components/Carousel/Carousel.vue'
import CarouselItem from '../components/Carousel/CarouselItem.vue'
import Button from '../components/Button/Button.vue'
import ButtonGroup from '../components/ButtonGroup/ButtonGroup.vue'

const cm = useCssModule()

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

const currentPage = ref(1)
const activeCollapse = ref(['1'])
const progressVal = ref(30)
const loading = ref(false)
const carouselType = ref<'fade' | 'slide'>('slide')

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

const render = () => (
  <div>
    <h3 class={cm.title}>Table & Pagination</h3>
    <Table data={tableData} columns={tableColumns} border stripe />
    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
      <Pagination 
        total={50} 
        currentPage={currentPage.value} 
        onUpdate:currentPage={v => currentPage.value = v}
      />
    </div>

    <h3 class={cm.title}>Tree & Collapse</h3>
    <div class={cm.row}>
      <div style={{ flex: 1, marginRight: '20px' }}>
        <h4 class={cm.subtitle}>Tree</h4>
        <div style={{ border: '1px solid var(--border-base)', padding: '10px', borderRadius: '4px' }}>
          <Tree data={treeData} />
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h4 class={cm.subtitle}>Collapse</h4>
        <Collapse modelValue={activeCollapse.value} onUpdate:modelValue={v => activeCollapse.value = v}>
          <CollapseItem title="Consistency" name="1">
            <div>Consistent with real life: in line with the process and logic of real life.</div>
          </CollapseItem>
          <CollapseItem title="Feedback" name="2">
            <div>Operation feedback: enable the users to clearly perceive their operations.</div>
          </CollapseItem>
        </Collapse>
      </div>
    </div>

    <h3 class={cm.title}>Tags & Avatars & Badges</h3>
    <div class={cm.row} style={{ alignItems: 'center' }}>
       <Tag>Tag 1</Tag>
       <Tag type="success">Tag 2</Tag>
       <Tag type="warning">Tag 3</Tag>
       <Tag type="danger">Tag 4</Tag>
       
       <div style={{ width: '20px' }}></div>

       <Avatar src="https://avatars.githubusercontent.com/u/1?v=4" />
       <Avatar>User</Avatar>
       
       <div style={{ width: '20px' }}></div>

       <Badge value={12}>
         <Button>Comments</Button>
       </Badge>
       <Badge isDot>
         <Avatar>A</Avatar>
       </Badge>
    </div>

    <h3 class={cm.title}>Images</h3>
    <div class={cm.row}>
      <Image src="https://via.placeholder.com/150" width="100px" height="100px" fit="cover" />
      <Image src="https://via.placeholder.com/150" width="100px" height="100px" fit="contain" />
    </div>

    <h3 class={cm.title}>Carousel</h3>
    <div style={{ marginBottom: '10px' }}>
      <span style={{ marginRight: '10px' }}>Mode:</span>
      <ButtonGroup>
        <Button type={carouselType.value === 'fade' ? 'primary' : 'default'} onClick={() => carouselType.value = 'fade'}>Fade</Button>
        <Button type={carouselType.value === 'slide' ? 'primary' : 'default'} onClick={() => carouselType.value = 'slide'}>Slide</Button>
      </ButtonGroup>
    </div>
    <Carousel height="200px" type={carouselType.value} arrow={carouselType.value === 'slide' ? 'always' : 'hover'}>
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

    <h3>Progress & Loading & Calendar</h3>
    <div class={cm.row}>
      <div style={{ flex: 1 }}>
        <h4>Calendar</h4>
        <Calendar modelValue={new Date()} />
      </div>
      <div style={{ flex: 1, marginLeft: '20px' }}>
        <h4>Progress</h4>
        <Progress percentage={progressVal.value} />
        <Progress percentage={70} status="success" strokeWidth={15} textInside />
        <Progress percentage={50} status="exception" type="circle" />
        <div style={{ marginTop: '10px' }}>
           <Button onClick={() => progressVal.value = Math.max(0, progressVal.value - 10)}>-</Button>
           <Button onClick={() => progressVal.value = Math.min(100, progressVal.value + 10)}>+</Button>
        </div>

        <h4>Loading</h4>
        <div style={{ position: 'relative', height: '100px', border: '1px solid #eee' }}>
           <Loading loading={loading.value} text="Loading..." />
           <div style={{ padding: '10px' }}>Content area...</div>
        </div>
        <Button onClick={() => loading.value = !loading.value} style={{ marginTop: '10px' }}>Toggle Loading</Button>
      </div>
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
