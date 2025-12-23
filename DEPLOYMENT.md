# 部署指南

## 快速开始

### 本地开发部署

1. **安装依赖**
```bash
npm install
```

2. **启动 MongoDB**
```bash
# 使用 Docker（推荐）
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 或使用本地 MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置 MONGODB_URI
```

4. **填充示例数据**
```bash
npm run seed
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 http://localhost:3000

### 生产环境部署

#### 方式一：Docker Compose（推荐）

这是最简单的部署方式，包含应用、数据库和定时任务。

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

服务包括：
- **app**: Next.js 应用（端口 3000）
- **mongo**: MongoDB 数据库（端口 27017）
- **scraper**: 定时抓取服务（每天凌晨2点运行）

#### 方式二：Vercel 部署

1. **准备 MongoDB Atlas**

访问 https://www.mongodb.com/cloud/atlas 创建免费集群。

2. **连接 GitHub**

将代码推送到 GitHub：
```bash
git remote add origin <your-repo-url>
git push -u origin main
```

3. **在 Vercel 部署**

- 访问 https://vercel.com
- 导入 GitHub 仓库
- 配置环境变量：
  ```
  MONGODB_URI=mongodb+srv://...
  NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
  ```
- 点击部署

4. **设置定时任务**

由于 Vercel 不支持长时间运行的进程，定时抓取需要：
- 使用 Vercel Cron Jobs（推荐）
- 或部署单独的服务器运行 `npm run scrape:scheduled`

#### 方式三：VPS 部署（完整方案）

适用于 AWS EC2、DigitalOcean、阿里云等。

1. **服务器准备**
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# 安装 PM2（进程管理器）
sudo npm install -g pm2
```

2. **部署应用**
```bash
# 克隆代码
git clone <your-repo-url> /var/www/robot-comparison
cd /var/www/robot-comparison

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
nano .env  # 编辑配置

# 构建应用
npm run build

# 启动应用
pm2 start npm --name "robot-app" -- start

# 启动定时任务
pm2 start npm --name "robot-scraper" -- run scrape:scheduled

# 保存 PM2 配置
pm2 save
pm2 startup
```

3. **配置 Nginx 反向代理**
```bash
sudo apt install nginx

# 创建 Nginx 配置
sudo nano /etc/nginx/sites-available/robot-comparison
```

添加配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/robot-comparison /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

4. **配置 SSL（可选但推荐）**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 环境变量说明

### 必需配置

| 变量 | 说明 | 示例 |
|------|------|------|
| `MONGODB_URI` | MongoDB 连接字符串 | `mongodb://localhost:27017/robot-comparison` |

### 可选配置

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `SCRAPE_INTERVAL_HOURS` | 抓取间隔（小时） | `24` |
| `ENABLE_AUTO_SCRAPING` | 启用自动抓取 | `true` |
| `CRON_SCHEDULE` | Cron 表达式 | `0 2 * * *` |
| `RUN_ON_START` | 启动时立即抓取 | `false` |
| `NEXT_PUBLIC_APP_URL` | 应用 URL | `http://localhost:3000` |
| `TWITTER_API_KEY` | Twitter API 密钥 | - |
| `TWITTER_API_SECRET` | Twitter API 密钥 | - |

## 性能优化

### 1. 数据库索引

数据库模型已包含必要的索引，但如果数据量大，可以添加额外索引：

```javascript
// MongoDB Shell
use robot-comparison

// 为常用查询添加索引
db.robots.createIndex({ "category": 1, "status": 1, "createdAt": -1 })
db.robots.createIndex({ "manufacturer": 1, "category": 1 })
```

### 2. 图片优化

使用 CDN 存储图片：
- Cloudinary
- AWS S3 + CloudFront
- Vercel 图片优化（自动）

### 3. 缓存策略

添加 Redis 缓存热门数据：
```bash
# 安装 Redis
sudo apt install redis-server

# 在代码中集成
npm install redis
```

### 4. 负载均衡

使用 PM2 集群模式：
```bash
pm2 start npm --name "robot-app" -i max -- start
```

## 监控和日志

### PM2 监控
```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs robot-app
pm2 logs robot-scraper

# 监控面板
pm2 monit
```

### 日志管理
```bash
# 配置日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## 备份策略

### MongoDB 备份

每日自动备份脚本：
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/var/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mongodump --uri="mongodb://localhost:27017/robot-comparison" --out="$BACKUP_DIR/backup_$DATE"

# 保留最近7天的备份
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

设置 crontab：
```bash
crontab -e
# 添加：每天凌晨3点备份
0 3 * * * /path/to/backup.sh
```

## 故障排除

### 应用无法启动
```bash
# 检查日志
pm2 logs robot-app --lines 100

# 检查端口占用
sudo netstat -tulpn | grep 3000

# 重启应用
pm2 restart robot-app
```

### MongoDB 连接失败
```bash
# 检查 MongoDB 状态
sudo systemctl status mongod

# 查看 MongoDB 日志
sudo tail -f /var/log/mongodb/mongod.log

# 重启 MongoDB
sudo systemctl restart mongod
```

### 抓取任务失败
```bash
# 查看抓取日志
pm2 logs robot-scraper

# 手动运行测试
npm run scrape

# 检查网络连接
curl -I https://www.tesla.com
```

## 安全建议

1. **防火墙配置**
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

2. **MongoDB 安全**
```bash
# 创建管理员用户
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "strong_password",
  roles: ["root"]
})

# 启用认证
sudo nano /etc/mongod.conf
# 添加：
security:
  authorization: enabled

sudo systemctl restart mongod
```

3. **定期更新**
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 更新 Node.js 依赖
npm audit
npm audit fix
```

## 扩展阅读

- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [MongoDB Atlas 文档](https://docs.atlas.mongodb.com)
- [PM2 文档](https://pm2.keymetrics.io/docs)
- [Nginx 配置指南](https://nginx.org/en/docs/)
