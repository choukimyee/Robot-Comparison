# 快速开始指南

## 5分钟快速体验

### 方法一：使用 Docker（最简单）

```bash
# 1. 克隆项目
git clone <repository-url>
cd robot-comparison-platform

# 2. 启动所有服务（应用 + 数据库）
docker-compose up -d

# 3. 等待服务启动（约30秒）
docker-compose logs -f app

# 4. 访问应用
# 打开浏览器访问 http://localhost:3000
```

### 方法二：本地开发（推荐学习）

```bash
# 1. 安装依赖
npm install

# 2. 启动 MongoDB（选择一种方式）

# Docker 方式（推荐）
docker run -d -p 27017:27017 --name mongodb mongo

# 或本地安装的 MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux

# 3. 启动开发服务器
npm run dev

# 4. 在新终端填充示例数据
npm run seed

# 5. 访问应用
# 打开浏览器访问 http://localhost:3000
```

## 首次使用指南

### 1. 浏览产品

1. 访问首页 http://localhost:3000
2. 选择一个机器人品类（如"四足机器狗"或"人形机器人"）
3. 查看产品列表和详细信息

### 2. 对比产品

1. 在产品列表页面，勾选2-4个产品
2. 点击页面底部的"对比选中产品"按钮
3. 查看详细的参数对比，最优参数会自动高亮

### 3. 管理数据（后台）

1. 访问 http://localhost:3000/admin
2. 使用默认管理员账号登录：
   - **邮箱**: `admin@robot-comparison.com`
   - **密码**: `admin123`
3. 选择"机器人管理"或"厂家管理"
4. 添加或编辑产品信息

⚠️ **重要**: 生产环境请立即修改默认密码！

### 4. 添加数据源

1. 访问 http://localhost:3000/admin/scraping
2. 点击"添加数据源"
3. 选择产品，输入URL（如官网、新闻链接）
4. 系统会自动抓取数据

### 5. 查看效果

示例数据包含：

**制造商**
- Tesla（特斯拉）- Optimus 人形机器人
- Figure AI - Figure 01 人形机器人
- Unitree（宇树科技）- H1 人形机器人、Go2 四足机器人
- Boston Dynamics（波士顿动力）- Spot 四足机器人

**产品特点**
- 完整的规格参数（身高、重量、速度等）
- 价格信息
- 核心特性说明
- 官方链接

## 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器

# 数据管理
npm run seed         # 填充示例数据
npm run scrape       # 手动运行一次数据抓取
npm run scrape:scheduled  # 启动定时抓取服务

# 身份验证
npm run generate-password <your-password>  # 生成密码哈希

# 代码质量
npm run lint         # 检查代码规范
```

## 目录结构

```
robot-comparison-platform/
├── src/
│   ├── app/              # Next.js 页面和路由
│   │   ├── page.tsx      # 首页
│   │   ├── robots/       # 产品列表页
│   │   ├── compare/      # 对比页面
│   │   ├── admin/        # 管理后台
│   │   └── api/          # API 路由
│   ├── components/       # React 组件
│   ├── lib/              # 工具库
│   │   ├── mongodb.ts    # 数据库连接
│   │   └── scraper.ts    # 数据抓取
│   ├── models/           # 数据模型
│   ├── scripts/          # 脚本
│   └── types/            # TypeScript 类型
├── public/               # 静态资源
├── package.json
├── README.md
└── docker-compose.yml
```

## 下一步

- 📖 阅读完整 [README.md](./README.md) 了解详细功能
- 🔒 查看 [身份验证文档](./docs/authentication.md) 配置登录系统
- 🚀 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 学习部署
- 🔧 修改 `src/types/index.ts` 自定义参数字段
- 🕷️ 编辑 `src/lib/scraper.ts` 添加更多数据源

## 遇到问题？

### MongoDB 连接失败
```bash
# 检查 MongoDB 是否运行
docker ps | grep mongo
# 或
mongosh
```

### 登录问题
```bash
# 如果无法登录，检查环境变量
cat .env | grep NEXTAUTH

# 确保包含以下配置：
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=<自动生成的密钥>

# 清除浏览器 Cookies 后重试
```

### 端口被占用
```bash
# 修改端口（默认3000）
PORT=3001 npm run dev
```

### 查看日志
```bash
# Docker
docker-compose logs -f

# 本地
# 查看终端输出
```

## 技术支持

- 查看 [GitHub Issues](../../issues)
- 阅读详细文档
- 联系开发团队

---

**祝您使用愉快！** 🎉
