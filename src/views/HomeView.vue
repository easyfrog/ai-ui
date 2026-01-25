<template>
  <render />
</template>

<script lang="tsx" setup>
const render = () => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Welcome to AI-UI Admin Dashboard</h1>
      <p style={{ fontSize: '18px', color: 'var(--text-regular)', marginTop: '20px' }}>
        Select a category from the sidebar to explore the components.
      </p>
    </div>
  )
}
</script>
