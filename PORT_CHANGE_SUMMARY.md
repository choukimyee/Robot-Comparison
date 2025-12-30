# 端口更改总结

## 更改内容

应用端口已从默认的 **3000** 更改为 **3010**

## 更新的文件

### 配置文件
1. **.env** - 添加 PORT=3010
2. **.env.example** - 更新所有端口引用
3. **package.json** - 更新 dev 和 start 脚本使用 -p 3010
4. **docker-compose.yml** - 更新端口映射为 3010:3010

### 文档文件
1. **README.md** - 所有端口引用更新
2. **QUICKSTART.md** - 所有端口引用更新
3. **SESSION_AUTH_IMPLEMENTATION.md** - 所有端口引用更新
4. **docs/authentication.md** - 所有端口引用更新
5. **docs/mongodb-atlas-setup.md** - 所有端口引用更新
6. **DEMO_MODE.md** - 所有端口引用更新
7. **DEPLOYMENT.md** - 所有端口引用更新

## 现在的访问地址

### 开发环境
```
前台: http://localhost:3010
管理后台: http://localhost:3010/admin
登录页面: http://localhost:3010/auth/signin
```

### 环境变量配置

```env
PORT=3010
NEXTAUTH_URL=http://localhost:3010
NEXT_PUBLIC_APP_URL=http://localhost:3010
```

## 启动命令

```bash
# 开发模式（自动使用端口 3010）
npm run dev

# 生产模式（自动使用端口 3010）
npm run build
npm run start

# Docker（端口映射 3010:3010）
docker-compose up -d
```

## 如何使用其他端口？

如果需要使用其他端口（如 3011-3020），只需：

### 方法 1: 临时更改
```bash
PORT=3015 npm run dev
```

### 方法 2: 永久更改
编辑 `.env` 文件：
```env
PORT=3015
NEXTAUTH_URL=http://localhost:3015
NEXT_PUBLIC_APP_URL=http://localhost:3015
```

然后正常启动：
```bash
npm run dev
```

### 方法 3: 修改脚本
编辑 `package.json`：
```json
{
  "scripts": {
    "dev": "next dev -p 3015",
    "start": "next start -p 3015"
  }
}
```

## 注意事项

⚠️ **重要**: 更改端口后，请同时更新：
1. `.env` 中的 PORT
2. `.env` 中的 NEXTAUTH_URL
3. `.env` 中的 NEXT_PUBLIC_APP_URL
4. 如果使用 Docker，更新 `docker-compose.yml` 中的端口映射

## 验证

启动应用后，检查：
```bash
# 查看进程
lsof -i :3010

# 或
netstat -an | grep 3010

# 访问测试
curl http://localhost:3010
```

## 端口范围说明

推荐端口范围: **3010-3020**
- 3010: 主应用（当前配置）
- 3011-3020: 可用于其他实例或测试环境

---

**更新日期**: 2025-12-30
**默认端口**: 3010
