# Firebase代理层部署指南

本文档详细说明如何设置和部署Firebase代理层，以解决跨区域访问Firebase的问题。

## 概述

在某些区域，直接从浏览器访问Firebase可能会遇到连接问题。为了解决这个问题，我们实现了一个服务器端代理层，通过Next.js的API Routes和Firebase Admin SDK来中转所有Firebase请求。

这种架构的优点:
1. 所有Firebase请求都通过服务器端完成，避免了浏览器直接连接Firebase
2. 服务器部署在Vercel等全球CDN上，连接更稳定
3. 简化了前端代码，统一了数据处理逻辑

## 架构图

```
客户端 → Next.js API Routes(代理层) → Firebase Firestore
```

## 设置步骤

### 1. 创建Firebase项目

1. 访问[Firebase控制台](https://console.firebase.google.com/)
2. 点击"添加项目"并完成项目创建
3. 在左侧菜单中选择"Firestore Database"并创建数据库
4. 选择"生产模式"或"测试模式"
5. 选择合适的数据库位置(推荐亚洲或美国多区域)

### 2. 获取Firebase配置

#### 客户端配置
1. 在Firebase控制台中，点击左侧的"项目设置"(齿轮图标)
2. 在"您的应用"部分，点击Web应用图标(</>)
3. 注册应用并获取配置对象，包含API密钥等信息

#### 服务器端(Admin SDK)配置
1. 在Firebase控制台中，点击左侧的"项目设置"
2. 切换到"服务账号"选项卡
3. 选择"Firebase Admin SDK"，并点击"生成新的私钥"
4. 下载私钥JSON文件，包含敏感信息，请妥善保管

### 3. 设置环境变量

创建`.env.local`文件，添加以下环境变量:

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

注意：`FIREBASE_PRIVATE_KEY`的格式需要保留换行符，例如:
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBA...etc\n-----END PRIVATE KEY-----\n"
```

### 4. 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在Vercel上创建新项目并导入该仓库
3. 在项目设置中添加环境变量
4. 对于`FIREBASE_PRIVATE_KEY`，直接复制完整的私钥内容，包括开头和结尾
5. 部署项目

## 验证部署

部署完成后，可以通过以下方式验证代理层是否正常工作:

1. 访问健康检查端点: `https://your-domain.com/api/health`
2. 检查响应中的`firebase_admin`状态是否为`initialized`
3. 尝试创建一个测试项目并检查是否成功保存到Firestore

## 故障排除

如果遇到连接问题，请检查:

1. **环境变量**: 确保所有环境变量正确设置，特别是`FIREBASE_PRIVATE_KEY`格式
2. **Firebase规则**: 检查Firestore安全规则是否允许服务器端访问
3. **错误日志**: 在Vercel日志中查找任何相关错误
4. **授权问题**: 确保服务账号具有适当的权限

## 安全注意事项

1. 永远不要将包含私钥的文件提交到版本控制系统
2. 使用环境变量存储敏感信息
3. 在Firestore规则中限制数据访问范围
4. 定期轮换私钥以提高安全性

## API参考

项目提供以下API路由:

- `GET /api/firebase/projects` - 获取所有项目
- `GET /api/firebase/project/:id` - 获取单个项目
- `POST /api/firebase/project/create` - 创建新项目
- `POST /api/firebase/project/:id/update` - 更新项目
- `DELETE /api/firebase/project/:id/delete` - 删除项目
- `GET /api/firebase/projects/public` - 获取公开项目
- `GET /api/health` - 健康检查端点 