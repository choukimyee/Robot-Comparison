# MongoDB Atlas 设置指南

## 快速开始（5分钟）

### 1. 创建免费账户

访问 https://www.mongodb.com/cloud/atlas/register

### 2. 创建免费集群

1. 点击 "Build a Database"
2. 选择 "Free" (M0 Sandbox)
3. 选择离你最近的区域
4. 点击 "Create Cluster"（等待 3-5 分钟）

### 3. 设置数据库访问

1. 左侧菜单 → Database Access → Add New Database User
2. 创建用户名和密码（记住这些信息）
3. 设置权限为 "Read and write to any database"
4. 点击 "Add User"

### 4. 设置网络访问

1. 左侧菜单 → Network Access → Add IP Address
2. 点击 "Allow Access from Anywhere"（输入 0.0.0.0/0）
3. 点击 "Confirm"

### 5. 获取连接字符串

1. 左侧菜单 → Database → Connect
2. 选择 "Connect your application"
3. 复制连接字符串，格式类似：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. 更新项目配置

编辑 `.env` 文件：

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/robot-comparison?retryWrites=true&w=majority
```

**注意**：将 `<username>` 和 `<password>` 替换为你的实际用户名和密码

### 7. 测试连接

```bash
npm run dev
```

然后访问 http://localhost:3010/admin 检查是否能连接数据库。

## 安全提示

⚠️ **不要将 .env 文件提交到 Git**（已在 .gitignore 中配置）

## 常见问题

### 连接超时

- 检查网络访问设置是否允许你的 IP
- 确认用户名和密码正确
- 检查连接字符串格式

### 认证失败

- 确保密码中没有特殊字符，或者进行 URL 编码
- 确认数据库用户已创建成功

## 本地 MongoDB 替代方案

如果你更喜欢本地数据库，可以：

### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
```

### Windows
下载安装程序：https://www.mongodb.com/try/download/community
