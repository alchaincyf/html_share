# aipage.top - HTML在线分享工具

aipage.top是一个轻量级的HTML分享预览工具，允许用户轻松粘贴HTML代码进行预览，并将预览的网站分享给朋友。用户可以创建、编辑和管理自己的HTML项目，生成独立的预览链接，完全像是一个独立的网站，可以交互操作。

## 功能特点

- 实时HTML预览
- 代码高亮显示
- 项目保存和管理
- 一键生成分享链接
- 独立预览页面，支持JavaScript交互
- Firebase代理层，解决跨区域访问问题

## 技术栈

- 前端: Next.js 14, React, TypeScript, TailwindCSS
- 状态管理: React Hooks
- 动画: Framer Motion
- 数据存储: Firebase Firestore
- 代理层: Next.js API Routes + Firebase Admin SDK
- 部署: Vercel

## 系统架构

项目采用了前后端分离的架构:

1. **前端**: 基于Next.js 14的React应用，使用App Router
2. **数据存储**: Firebase Firestore
3. **代理层**: 使用Next.js API Routes和Firebase Admin SDK实现的代理层
4. **部署**: Vercel

### Firebase代理层

为了解决某些地区访问Firebase的问题，项目实现了一个服务器端代理层:

```
客户端 → Next.js API Routes(代理层) → Firebase Firestore
```

代理层的主要组件:
- Firebase Admin初始化 (`lib/firebase-admin.ts`)
- API Routes处理请求 (`app/api/firebase/...`)
- 前端API客户端 (`lib/api-client.ts`)

## 本地开发

### 前提条件

- Node.js 18+
- npm 或 yarn
- Firebase 账号和项目

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/html-share.git
cd html-share
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

创建一个`.env.local`文件，并填写以下内容:

```
# Firebase 客户端配置
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin SDK 配置 (用于服务器端API代理)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_private_key_with_newlines
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_DATABASE_URL=your_database_url
```

注意: `FIREBASE_PRIVATE_KEY`需要包含完整的换行符，例如:
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBA...etc\n-----END PRIVATE KEY-----\n"
```

4. 在Firebase中设置Firestore数据库

登录Firebase控制台，创建一个新项目，然后设置Firestore数据库，创建一个名为`html_projects`的集合。

5. 启动开发服务器

```bash
npm run dev
```

6. 打开浏览器并访问 http://localhost:3000

## API路由说明

项目提供以下API路由:

- `GET /api/firebase/projects` - 获取所有项目
- `GET /api/firebase/project/:id` - 获取单个项目
- `POST /api/firebase/project/create` - 创建新项目
- `POST /api/firebase/project/:id/update` - 更新项目
- `DELETE /api/firebase/project/:id/delete` - 删除项目
- `GET /api/firebase/projects/public` - 获取公开项目

## 部署

### 部署到Vercel

1. 在Vercel上创建一个新项目
2. 导入GitHub仓库
3. 设置环境变量（与`.env.local`相同）
4. 部署

### 环境变量设置

在Vercel部署时，确保设置所有环境变量，特别注意`FIREBASE_PRIVATE_KEY`的格式。
Vercel环境变量中应该直接粘贴完整的私钥，包括换行符（`\n`）。

## 贡献

欢迎提交Pull Request和Issue！

## 许可证

MIT
