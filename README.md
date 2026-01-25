# AI-UI

AI-UI 是一个基于 **Vue 3** + **Vite** + **TypeScript** + **JSX** 构建的现代化自定义 UI 组件库。它旨在提供一套轻量、高效、易于扩展且具备强大主题定制能力的组件集合，特别适合用于构建现代化的 Web 应用程序和后台管理系统。

## ✨ 特性 (Features)

- **🚀 前沿技术栈**: 采用 Vue 3 (Composition API), Vite, TypeScript, JSX (SFC) 进行开发，保持代码的现代化和高性能。
- **🎨 上下文主题系统 (Contextual Theming)**:
  - 基于 CSS 变量 (CSS Variables) 构建。
  - 支持 **Light (默认)**, **Dark**, **Deep Blue** 等多种内置主题。
  - **级联特性**: 支持在任意容器组件（如 Card, Layout）上设置主题，该主题会自动级联应用到其所有子组件，实现局部的深色/浅色模式嵌套。
- **📱 响应式布局**: 内置 `AdminLayout` 管理后台布局，支持 PC、平板、手机端的自动适配（侧边栏自动折叠/展开/抽屉式交互）。
- **🧩 丰富的组件库**: 包含 40+ 个常用组件，覆盖基础、表单、数据展示、导航、反馈等各个方面。
- **💅 CSS Modules**: 组件样式采用 CSS Modules，确保样式隔离，避免全局污染。

## 📦 项目结构 (Project Structure)

```
d:\dev\aui\
├── src\
│   ├── components\     # UI 组件源码 (Button, Input, Tree, Layout 等)
│   ├── hooks\          # 组合式 API 钩子 (如 useScreen 响应式检测)
│   ├── router\         # Vue Router 路由配置
│   ├── styles\         # 全局样式与 CSS 变量定义 (vars.css, index.css)
│   ├── views\          # 示例页面 (展示组件用法的页面)
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── index.html
├── package.json
└── vite.config.ts
```

## 🛠️ 快速开始 (Getting Started)

### 环境要求
- Node.js >= 16
- pnpm (推荐) 或 npm/yarn

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm run dev
```
启动后，访问 `http://localhost:5173` 即可查看组件库演示。

### 3. 构建生产版本

```bash
pnpm run build
```

## 💻 使用指南 (Usage)

### 组件开发规范
本项目采用 `.vue` 文件结合 `JSX` 的方式进行开发：

```tsx
<template>
  <render />
</template>

<script lang="tsx" setup>
import { useCssModule } from 'vue'

const cm = useCssModule()

const render = () => (
  <div class={cm.wrapper}>
    <button class={cm.btn}>Click Me</button>
  </div>
)
</script>

<style module>
.wrapper {
  padding: 10px;
}
.btn {
  background: var(--ai-primary); /* 使用预定义的 CSS 变量 */
}
</style>
```

### 主题切换示例

AI-UI 的核心特性是基于 `data-theme` 属性的主题切换：

```html
<!-- 全局应用深色主题 -->
<div data-theme="dark">
  <Button>I am Dark</Button>
  
  <!-- 局部应用浅色主题，内部组件自动继承 -->
  <Card data-theme="light">
    <Button>I am Light (Nested)</Button>
  </Card>
</div>
```

### 路由与页面
项目内置了演示用的路由系统，将组件分类展示：
- **Home**: 项目概览
- **Basic**: 基础组件 (Button, Icon, Layout, Typography...)
- **Form**: 表单组件 (Input, Select, Switch, Checkbox...)
- **Data**: 数据展示 (Table, Tree, Pagination, Card...)
- **Navigation**: 导航组件 (Menu, Breadcrumb, Steps...)
- **Feedback**: 反馈组件 (Dialog, Message, Loading...)

## 📝 贡献 (Contributing)
欢迎提交 Issue 或 Pull Request 来丰富组件库或修复 Bug。请确保遵循现有的代码风格和组件结构。
