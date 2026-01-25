<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule, reactive } from 'vue'
import Dialog from '../components/Dialog/Dialog.vue'
import Drawer from '../components/Drawer/Drawer.vue'
import Popover from '../components/Popover/Popover.vue'
import Message from '../components/Message/Message.vue'
import Notification from '../components/Notification/Notification.vue'
import Toast from '../components/Toast/Toast.vue'
import Button from '../components/Button/Button.vue'

const cm = useCssModule()

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

const render = () => (
  <div>
    <h3 class={cm.title}>Dialogs & Popups</h3>
    <div class={cm.row}>
      <Button onClick={() => feedback.dialog = true}>Open Dialog</Button>
      <Button onClick={() => feedback.drawer = true}>Open Drawer</Button>
      <Popover content="This is a popover content" trigger="click">
         <Button>Click Popover</Button>
      </Popover>
    </div>

    <h3 class={cm.title}>Messages</h3>
    <div class={cm.row}>
      <Button type="success" onClick={showMessage}>Message</Button>
      <Button type="warning" onClick={showNotification}>Notification</Button>
      <Button type="danger" onClick={showToast}>Toast</Button>
    </div>

    {/* Overlays */}
    <Dialog 
      modelValue={feedback.dialog} 
      onUpdate:modelValue={v => feedback.dialog = v}
      title="Tips"
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
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
    
    {feedback.message && <Message message="This is a success message" type="success" onClose={() => feedback.message = false} />}
    {feedback.notification && <Notification title="Notification" message="This is a notification message" type="warning" onClose={() => feedback.notification = false} />}
    {feedback.toast && <Toast message="This is a toast message" onClose={() => feedback.toast = false} />}
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
</style>
