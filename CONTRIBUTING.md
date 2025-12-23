# 贡献指南

感谢您考虑为机器人竞品对比平台做出贡献！

## 如何贡献

### 报告 Bug

如果您发现了 bug，请创建一个 Issue，并包含以下信息：

- Bug 的详细描述
- 复现步骤
- 预期行为
- 实际行为
- 截图（如果适用）
- 环境信息（操作系统、浏览器、Node.js 版本等）

### 提出新功能

如果您有新功能的想法：

1. 先检查 Issues 中是否已有类似建议
2. 创建新 Issue，描述功能的用途和预期效果
3. 等待社区讨论和反馈

### 提交代码

1. **Fork 项目**
   ```bash
   # 点击 GitHub 页面右上角的 Fork 按钮
   ```

2. **克隆到本地**
   ```bash
   git clone https://github.com/your-username/robot-comparison-platform.git
   cd robot-comparison-platform
   ```

3. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **进行修改**
   - 遵循项目的代码风格
   - 添加必要的测试
   - 更新相关文档

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```

   提交信息格式：
   - `feat: 新功能`
   - `fix: Bug 修复`
   - `docs: 文档更新`
   - `style: 代码格式调整`
   - `refactor: 代码重构`
   - `test: 测试相关`
   - `chore: 构建/工具相关`

6. **推送到 GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 访问您的 Fork 页面
   - 点击 "New Pull Request"
   - 填写 PR 描述，说明改动内容
   - 等待 review

## 代码规范

### TypeScript/JavaScript

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用有意义的变量名
- 添加必要的注释

### React 组件

- 使用函数组件和 Hooks
- Props 使用 TypeScript 接口定义
- 组件文件使用 PascalCase
- 一个文件一个组件（除非是小型辅助组件）

### 样式

- 使用 Tailwind CSS
- 避免内联样式
- 保持响应式设计

### API

- RESTful 设计原则
- 适当的 HTTP 状态码
- 统一的响应格式
- 错误处理

## 项目结构

```
src/
├── app/              # Next.js 应用路由
│   ├── api/         # API 路由
│   ├── admin/       # 管理后台
│   └── robots/      # 产品页面
├── components/       # React 组件
├── lib/             # 工具函数
├── models/          # 数据模型
├── scripts/         # 脚本
└── types/           # TypeScript 类型
```

## 添加新功能

### 添加新的机器人品类

1. 在 `src/types/index.ts` 中添加品类枚举和标签
2. 更新首页的品类选择（`src/app/page.tsx`）
3. 添加品类特定的规格参数

### 添加新的数据源

1. 在 `src/lib/scraper.ts` 中添加抓取逻辑
2. 测试抓取功能
3. 更新文档

### 改进 UI/UX

1. 确保响应式设计
2. 保持一致的设计语言
3. 添加适当的加载状态和错误处理

## 测试

目前项目还没有完整的测试套件，欢迎贡献：

- 单元测试
- 集成测试
- E2E 测试

## 文档

贡献代码时，请同时更新：

- README.md（如果影响主要功能）
- 代码注释
- JSDoc（如果是公共 API）

## 获取帮助

- 查看现有 Issues 和 Discussions
- 在 Issue 中提问
- 查看文档

## 行为准则

- 尊重他人
- 建设性反馈
- 保持友好和专业

## 许可证

通过提交代码，您同意您的贡献将使用与项目相同的 MIT 许可证。

---

再次感谢您的贡献！🙏
