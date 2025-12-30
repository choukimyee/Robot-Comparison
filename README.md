# 机器人竞品对比平台 | Robot Comparison Platform

<div align="center">

🤖 一个全面的机器人产品对比平台，支持四足机器狗、人形机器人等多种机器人品类的对比分析

[快速开始](./QUICKSTART.md) · [部署指南](./DEPLOYMENT.md) · [在线演示](#) · [报告问题](../../issues)

</div>

---

## ✨ 核心特性

- 🤖 **多品类支持** - 四足机器狗、人形机器人、扫地机器人、割草机器人、泳池清洁机器人等
- 📊 **智能对比** - 自动高亮最优参数，支持多产品并行对比
- 🌊 **瀑布流展示** - 响应式瀑布流布局，优雅展示产品卡片
- 🕷️ **自动抓取** - 每日自动检索官网、新闻、社交媒体等数据源
- 📝 **手动管理** - 完整的后台管理系统，支持手动添加和编辑
- 🔒 **身份验证** - NextAuth.js 身份验证保护管理后台，会话管理和过期处理
- 🎯 **重点厂家** - 特别关注 Tesla、Figure AI、Unitree（宇树科技）、Sunday Robotics 等

## 🏗️ 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件**: React 18
- **状态管理**: Zustand
- **图标**: Lucide React

### 后端
- **运行时**: Node.js
- **API**: Next.js API Routes
- **数据库**: MongoDB + Mongoose
- **身份验证**: NextAuth.js + JWT
- **数据抓取**: Puppeteer, Cheerio, Axios

### 开发工具
- **包管理**: npm
- **代码规范**: ESLint
- **定时任务**: node-cron

## 📦 安装与运行

### 🎭 快速体验（演示模式 - 无需数据库）

如果您想快速体验项目功能而不安装数据库：

```bash
# 1. 安装依赖
npm install

# 2. 启用演示模式（已默认启用）
# 确认 .env 文件中 DEMO_MODE=true

# 3. 启动应用
npm run dev
```

访问 http://localhost:3010 即可体验！

查看详情：[DEMO_MODE.md](./DEMO_MODE.md)

---

### 🔧 完整安装（需要数据库）

### 前置要求

- Node.js 18+ 
- MongoDB 4.4+ 或 MongoDB Atlas（云数据库）
- npm 或 yarn

### 1. 克隆项目

```bash
git clone <repository-url>
cd robot-comparison-platform
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env` 并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库连接
MONGODB_URI=mongodb://localhost:27017/robot-comparison

# 抓取配置
SCRAPE_INTERVAL_HOURS=24
ENABLE_AUTO_SCRAPING=true
CRON_SCHEDULE=0 2 * * *
RUN_ON_START=false

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3010
```

### 4. 配置数据库

#### 选项 A：使用 MongoDB Atlas（推荐 - 免费云数据库）

1. 访问 https://www.mongodb.com/cloud/atlas/register
2. 创建免费集群（M0）
3. 获取连接字符串
4. 更新 `.env`：
   ```env
   DEMO_MODE=false
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/robot-comparison
   ```

详细步骤：[docs/mongodb-atlas-setup.md](./docs/mongodb-atlas-setup.md)

#### 选项 B：本地 MongoDB

```bash
# macOS (使用 Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

更新 `.env`：
```env
DEMO_MODE=false
MONGODB_URI=mongodb://localhost:27017/robot-comparison
```

### 5. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3010 查看应用。

### 6. 填充示例数据

首次运行时，可以使用示例数据快速开始：

```bash
npm run seed
```

这将创建：
- 5个制造商（Tesla、Figure AI、Unitree、Boston Dynamics等）
- 5个示例机器人产品（Optimus Gen 2、Figure 01、Unitree H1/Go2、Spot等）

### 7. 启动定时抓取任务（可选）

在另一个终端窗口中运行：

```bash
npm run scrape:scheduled
```

## 📖 使用指南

### 首页

访问首页选择机器人品类，系统支持：
- 四足机器狗
- 人形机器人
- 扫地机器人
- 割草机器人
- 泳池清洁机器人

### 产品列表页

- 瀑布流展示所有产品
- 支持筛选（状态、品类）
- 支持排序（名称、价格、发布日期）
- 选择产品进行对比（最多4个）

### 对比页面

- 并排展示选中产品
- 自动高亮最优参数
- 支持所有规格参数对比

### 数据管理后台

访问 `/admin` 进入管理后台（需要登录）：

**默认管理员账号**：
- 邮箱：`admin@robot-comparison.com`
- 密码：`admin123`

**⚠️ 重要**：生产环境请立即修改默认密码！查看 [身份验证文档](./docs/authentication.md) 了解详情。

1. **机器人管理** (`/admin/robots`)
   - 添加、编辑、删除机器人产品
   - 管理产品信息、参数、图片等

2. **厂家管理** (`/admin/manufacturers`)
   - 添加、编辑制造商信息
   - 管理官网、社交媒体链接

3. **数据源管理** (`/admin/scraping`)
   - 添加数据抓取源
   - 手动触发抓取
   - 查看抓取历史

## 🕷️ 数据抓取

### 自动抓取

系统支持每日自动抓取以下数据源：
- 官方网站
- 新闻报道
- Twitter / X
- 微信公众号
- YouTube

### 手动抓取

```bash
# 一次性手动抓取所有数据源
npm run scrape
```

### 添加新数据源

1. 进入 `/admin/scraping`
2. 点击"添加数据源"
3. 选择产品、输入URL、选择类型
4. 系统会立即抓取并更新数据

### 自定义抓取规则

编辑 `src/lib/scraper.ts` 中的 `scrapeManufacturerSite` 函数，为特定厂家添加自定义选择器：

```typescript
const customSelectors: Record<string, any> = {
  'unitree': {
    title: '.product-title',
    price: '.price-value',
    specs: '.specifications table',
    images: '.product-gallery img'
  },
  // 添加更多厂家...
}
```

## 🗄️ 数据模型

### Robot (机器人产品)
- 基本信息：名称、型号、厂家、品类
- 规格参数：重量、尺寸、电池、速度等
- 价格信息：金额、货币、说明
- 媒体资源：图片、视频链接
- 数据源：多个抓取源配置

### Manufacturer (制造商)
- 基本信息：中英文名称、国家
- 联系方式：官网、社交媒体
- Logo 和简介

### DataSource (数据源)
- URL 和类型
- 抓取配置和间隔
- 最后抓取时间和数据

### ScrapingJob (抓取任务)
- 任务状态和时间记录
- 抓取结果或错误信息

## 🎨 自定义配置

### 品类配置

在 `src/types/index.ts` 中添加新品类：

```typescript
export enum RobotCategory {
  QUADRUPED = 'quadruped',
  HUMANOID = 'humanoid',
  YOUR_NEW_CATEGORY = 'your_new_category', // 新增
  // ...
}

export const CATEGORY_LABELS: Record<RobotCategory, string> = {
  [RobotCategory.QUADRUPED]: '四足机器狗',
  [RobotCategory.YOUR_NEW_CATEGORY]: '您的新品类', // 新增
  // ...
}
```

### 规格参数

在 `src/types/index.ts` 的 `RobotSpecs` 接口中添加新参数：

```typescript
export interface RobotSpecs {
  // 现有参数...
  yourNewSpec?: number // 新增参数
}
```

## 🐳 Docker 部署

### 使用 Docker Compose

创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3010:3010"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/robot-comparison
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

运行：

```bash
docker-compose up -d
```

## 📝 API 端点

### 产品 API

- `GET /api/robots` - 获取产品列表
- `GET /api/robots/:id` - 获取单个产品
- `POST /api/robots` - 创建产品
- `PUT /api/robots/:id` - 更新产品
- `DELETE /api/robots/:id` - 删除产品

### 厂家 API

- `GET /api/manufacturers` - 获取厂家列表
- `POST /api/manufacturers` - 创建厂家
- `PUT /api/manufacturers/:id` - 更新厂家
- `DELETE /api/manufacturers/:id` - 删除厂家

### 对比 API

- `GET /api/compare?ids=id1,id2,id3` - 获取对比数据

### 抓取 API

- `POST /api/scrape` - 触发抓取任务
- `GET /api/scrape` - 获取抓取历史

### 身份验证 API

- `POST /api/auth/signin` - 用户登录
- `POST /api/auth/signout` - 用户登出
- `GET /api/auth/session` - 获取会话信息
- `GET /api/auth/csrf` - 获取 CSRF Token

查看完整身份验证文档：[authentication.md](./docs/authentication.md)

## 🔧 故障排除

### MongoDB 连接失败

确保 MongoDB 正在运行：
```bash
# 检查状态
mongosh

# 如果失败，重启服务
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod            # Linux
```

### 抓取失败

1. 检查网络连接
2. 确认目标网站可访问
3. 查看抓取任务历史中的错误信息
4. 调整 `src/lib/scraper.ts` 中的选择器

### 图片加载失败

在 `next.config.js` 中添加图片域名：

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-image-domain.com',
    },
  ],
}
```

### 登录问题 / 会话过期

**症状**：无法登录或登录后立即跳转到错误页

**解决方案**：
1. 检查环境变量是否配置正确（NEXTAUTH_URL 和 NEXTAUTH_SECRET）
2. 确认 `.env` 文件存在且包含正确配置
3. 清除浏览器 Cookies 和缓存
4. 重启开发服务器：`npm run dev`
5. 查看浏览器控制台和服务器终端的错误信息

**生成新密码**：
```bash
npm run generate-password your-new-password
```

查看完整身份验证文档：[authentication.md](./docs/authentication.md)

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

## 🌟 重点厂家

本平台特别关注以下机器人制造商：

- **Tesla** - Optimus 人形机器人
- **Figure AI** - Figure 01/02 人形机器人
- **Unitree (宇树科技)** - Go1, Go2, H1 等
- **Sunday Robotics** - 最新机器人产品
- **Boston Dynamics** - Spot, Atlas
- **Agility Robotics** - Digit

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [提交问题](../../issues)
- Email: your-email@example.com

---

**构建时间**: 2025年12月
**版本**: 1.0.0
