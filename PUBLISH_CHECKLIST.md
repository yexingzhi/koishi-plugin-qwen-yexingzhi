# 发布前检查清单

## 代码准备

- [x] 删除所有测试 API Key
- [x] 删除所有敏感信息（Token、密码等）
- [x] 更新 README.md
- [x] 更新 CHANGELOG.md
- [x] 构建成功：`yarn build`
- [x] 没有 TypeScript 错误
- [x] 没有 ESLint 警告

## 版本管理

- [x] 更新 package.json 版本号为 0.0.1
- [x] 更新 koishi-app package.json 版本号为 0.0.1
- [x] 版本号遵循 Semantic Versioning

## 文件检查

- [x] package.json 配置正确
  - [x] name: koishi-plugin-qwen
  - [x] main: lib/index.js
  - [x] typings: lib/index.d.ts
  - [x] files: ["lib", "dist"]
  - [x] keywords 包含相关词汇
  - [x] peerDependencies 正确

- [x] tsconfig.json 配置正确
  - [x] outDir: ./lib
  - [x] declaration: true

- [x] .gitignore 配置正确
  - [x] node_modules/
  - [x] dist/
  - [x] lib/
  - [x] .env

- [x] README.md 完整
  - [x] 功能说明
  - [x] 安装说明
  - [x] 配置说明
  - [x] 使用示例
  - [x] 常见问题

## GitHub 准备

- [ ] 创建 GitHub 仓库：https://github.com/yexingzhi/koishi-plugin-qwen
- [ ] 初始化 Git 仓库
- [ ] 添加 .gitignore
- [ ] 提交代码
- [ ] 推送到 GitHub
- [ ] 创建 GitHub Release

## npm 发布

- [ ] 登录 npm：`npm login`
- [ ] 验证 npm 账户：`npm whoami`
- [ ] 发布到 npm：`npm publish`
- [ ] 验证发布成功：`npm view koishi-plugin-qwen`

## Koishi 官方市场

- [ ] Fork https://github.com/koishijs/registry
- [ ] 创建 plugins/qwen.yml
- [ ] 填写插件信息
- [ ] 提交 Pull Request
- [ ] 等待审核

## 发布后验证

- [ ] npm 上可以搜到插件
- [ ] GitHub Release 已创建
- [ ] 文档链接正确
- [ ] 版本号正确显示

## 快速发布命令

### 1. 初始化 GitHub 仓库

```bash
cd external/qwen

# 初始化 git
git init
git remote add origin https://github.com/yexingzhi/koishi-plugin-qwen.git

# 创建 .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
lib/
*.log
.env
.env.local
.DS_Store
EOF

# 提交代码
git add .
git commit -m "Initial commit: koishi-plugin-qwen v0.0.1"
git branch -M main
git push -u origin main
```

### 2. 创建 GitHub Release

```bash
# 创建标签
git tag -a v0.0.1 -m "Release v0.0.1: Initial release"
git push origin v0.0.1

# 在 GitHub 上手动创建 Release
# https://github.com/yexingzhi/koishi-plugin-qwen/releases/new
```

### 3. 发布到 npm

```bash
# 登录 npm
npm login

# 发布
npm publish

# 验证
npm view koishi-plugin-qwen
```

### 4. 提交到 Koishi 官方市场

```bash
# Fork https://github.com/koishijs/registry

# 克隆 fork 的仓库
git clone https://github.com/yexingzhi/registry.git
cd registry

# 创建 plugins/qwen.yml
cat > plugins/qwen.yml << 'EOF'
name: koishi-plugin-qwen
description: 阿里云千问大模型适配
author: yexingzhi
homepage: https://github.com/yexingzhi/koishi-plugin-qwen
repository:
  url: https://github.com/yexingzhi/koishi-plugin-qwen
  branch: main
keywords:
  - chatbot
  - qwen
  - alibaba
  - ai
  - text-to-image
  - text-to-video
  - translate
EOF

# 提交并推送
git add plugins/qwen.yml
git commit -m "Add koishi-plugin-qwen"
git push origin main

# 在 GitHub 上提交 Pull Request
# https://github.com/koishijs/registry/compare
```

## 发布后维护

### 更新版本

```bash
# 修改 package.json 版本号
# 例如：0.0.1 -> 0.0.2

# 更新 CHANGELOG.md

# 提交代码
git add .
git commit -m "Release v0.0.2"

# 创建标签
git tag -a v0.0.2 -m "Release v0.0.2"
git push origin main
git push origin v0.0.2

# 发布到 npm
npm publish
```

### 回滚版本

```bash
# 标记为已弃用
npm deprecate koishi-plugin-qwen@0.0.1 "This version has issues"

# 删除标签（如果需要）
git tag -d v0.0.1
git push origin :v0.0.1
```

## 常见问题

### Q: 发布失败，提示 "403 Forbidden"

A: 可能原因：
1. npm 账户未登录
2. 包名已被占用
3. 账户权限不足

解决方案：
```bash
npm logout
npm login
npm publish
```

### Q: 如何更新已发布的版本？

A: npm 不允许覆盖已发布的版本，必须发布新版本。

### Q: 如何删除已发布的包？

A: 只能在发布后 72 小时内删除：
```bash
npm unpublish koishi-plugin-qwen@0.0.1
```

### Q: GitHub Actions 自动发布失败

A: 需要配置 NPM_TOKEN：
1. 访问 https://www.npmjs.com/settings/your-username/tokens
2. 创建 "Automation" token
3. 在 GitHub 仓库设置中添加 secret：NPM_TOKEN

## 相关链接

- [Koishi 发布指南](https://koishi.chat/zh-CN/guide/develop/publish.html)
- [npm 发布指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Koishi 官方市场](https://registry.koishi.chat/)
