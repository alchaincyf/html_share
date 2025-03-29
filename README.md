# 元宝伴侣 - HTML分享预览工具

元宝伴侣是一个轻量级的HTML分享预览工具，允许用户轻松粘贴HTML代码进行预览，并将预览的网站分享给朋友。用户可以创建、编辑和管理自己的HTML项目，生成独立的预览链接，完全像是一个独立的网站，可以交互操作。

## 功能特点

- 实时HTML预览
- 代码高亮显示
- 项目保存和管理
- 一键生成分享链接
- 独立预览页面，支持JavaScript交互

## 技术栈

- 前端: Next.js, React, TypeScript, TailwindCSS
- 后端: Supabase (PostgreSQL数据库)
- 部署: Vercel

## 本地开发

### 前提条件

- Node.js 18+
- npm 或 yarn
- Supabase 账号

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

创建一个`.env.local`文件，并填写以下内容：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 在Supabase中设置数据库

登录Supabase控制台，创建一个新项目，然后在SQL编辑器中执行`supabase/setup.sql`文件中的SQL语句。

5. 启动开发服务器

```bash
npm run dev
```

6. 打开浏览器并访问 http://localhost:3000

## 部署

### 部署到Vercel

1. 在Vercel上创建一个新项目
2. 导入GitHub仓库
3. 设置环境变量（与`.env.local`相同）
4. 部署

## 贡献

欢迎提交Pull Request和Issue！

## 许可证

MIT
