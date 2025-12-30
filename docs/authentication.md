# 身份验证和会话管理

本项目使用 NextAuth.js 实现了完整的身份验证和会话管理功能，保护管理后台免受未授权访问。

## 功能特性

- ✅ 基于凭证的身份验证（邮箱 + 密码）
- ✅ JWT 会话管理
- ✅ 会话过期自动处理
- ✅ 中间件保护管理后台路由
- ✅ 美观的登录界面
- ✅ 登录/登出状态显示

## 默认管理员账号

### 开发/演示环境

```
邮箱: admin@robot-comparison.com
密码: admin123
```

**⚠️ 警告**: 生产环境中请立即修改默认密码！

## 配置

### 环境变量

在 `.env` 文件中添加以下配置：

```env
# NextAuth 配置
NEXTAUTH_URL=http://localhost:3010
NEXTAUTH_SECRET=your-super-secret-key-here
```

### 生成密钥

可以使用以下命令生成安全的密钥：

```bash
openssl rand -base64 32
```

## 保护的路由

以下路由需要身份验证才能访问：

- `/admin` - 管理后台首页
- `/admin/robots` - 机器人管理
- `/admin/manufacturers` - 厂家管理
- `/admin/scraping` - 数据源管理

未登录用户访问这些路由将自动跳转到登录页面。

## 会话管理

### 会话配置

- **策略**: JWT (JSON Web Token)
- **过期时间**: 30 天
- **更新间隔**: 24 小时

### 会话过期处理

当会话过期时：
1. 用户将自动跳转到登录页面
2. 显示友好的错误提示
3. 登录后可返回原页面

## 添加新用户

### 方法 1: 修改代码（开发环境）

编辑 `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
const users = [
  {
    id: "1",
    name: "Admin",
    email: "admin@robot-comparison.com",
    password: "$2a$10$...", // bcrypt hash
    role: "admin"
  },
  {
    id: "2",
    name: "New User",
    email: "newuser@example.com",
    password: "$2a$10$...", // bcrypt hash
    role: "admin"
  }
]
```

### 方法 2: 生成密码哈希

使用 Node.js 生成密码哈希：

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-password';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

或使用提供的脚本：

```bash
npm run generate-password your-password
```

### 方法 3: 连接数据库（推荐 - 生产环境）

在生产环境中，建议：
1. 创建 User 模型连接 MongoDB
2. 实现用户注册 API
3. 实现密码重置功能
4. 添加角色和权限管理

## 自定义身份验证

### 添加其他登录方式

NextAuth.js 支持多种认证提供者：

```typescript
// Google OAuth
import GoogleProvider from "next-auth/providers/google"

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  // ... 其他提供者
]
```

### 自定义登录页面

编辑 `src/app/auth/signin/page.tsx` 自定义登录界面。

### 自定义回调函数

在 `src/app/api/auth/[...nextauth]/route.ts` 中修改 callbacks：

```typescript
callbacks: {
  async jwt({ token, user }) {
    // 自定义 JWT 逻辑
    return token
  },
  async session({ session, token }) {
    // 自定义 Session 逻辑
    return session
  }
}
```

## API 端点

### NextAuth API

- `POST /api/auth/signin` - 登录
- `POST /api/auth/signout` - 登出
- `GET /api/auth/session` - 获取会话信息
- `GET /api/auth/csrf` - 获取 CSRF Token

### 前端使用

```typescript
import { useSession, signIn, signOut } from 'next-auth/react'

function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <div>Loading...</div>
  if (status === 'unauthenticated') return <div>Not logged in</div>
  
  return (
    <div>
      <p>Welcome {session.user.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}
```

## 安全建议

### 开发环境

- ✅ 使用默认账号快速测试
- ✅ 确保 `.env` 文件不提交到 Git

### 生产环境

- 🔒 修改所有默认密码
- 🔒 使用强随机密钥作为 NEXTAUTH_SECRET
- 🔒 启用 HTTPS（NextAuth 强烈建议）
- 🔒 实现用户数据库存储
- 🔒 添加登录失败次数限制
- 🔒 实现双因素认证（2FA）
- 🔒 定期更新密码策略
- 🔒 记录和监控登录活动

## 故障排除

### 会话一直显示未登录

1. 检查 NEXTAUTH_URL 是否正确
2. 确认 NEXTAUTH_SECRET 已设置
3. 清除浏览器 Cookies
4. 检查浏览器控制台错误

### 登录后立即跳转到错误页

1. 检查数据库连接
2. 验证密码哈希是否正确
3. 查看服务器日志

### 中间件不工作

1. 确认 `middleware.ts` 在正确位置
2. 检查 matcher 配置
3. 重启开发服务器

## 相关资源

- [NextAuth.js 官方文档](https://next-auth.js.org/)
- [NextAuth.js GitHub](https://github.com/nextauthjs/next-auth)
- [JWT 介绍](https://jwt.io/introduction)
- [bcrypt 密码加密](https://github.com/kelektiv/node.bcrypt.js)

## 下一步改进

1. **用户管理界面** - 创建用户 CRUD 界面
2. **角色权限** - 实现细粒度权限控制
3. **审计日志** - 记录所有管理操作
4. **邮箱验证** - 添加邮箱验证流程
5. **密码重置** - 实现忘记密码功能
6. **多因素认证** - 提高安全性
7. **OAuth 集成** - 支持第三方登录
