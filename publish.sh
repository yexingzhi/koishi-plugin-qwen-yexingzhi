#!/bin/bash

# Koishi Qwen 插件发布脚本

set -e

echo "🚀 开始发布 koishi-plugin-qwen..."
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 external/qwen 目录下运行此脚本"
    exit 1
fi

# 获取版本号
VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')
echo "📦 版本号: $VERSION"
echo ""

# 1. 检查敏感信息
echo "🔍 检查敏感信息..."
if grep -r "sk-" src/ 2>/dev/null | grep -v "YOUR_API_KEY"; then
    echo "❌ 发现 API Key，请先删除！"
    exit 1
fi
echo "✅ 敏感信息检查通过"
echo ""

# 2. 构建
echo "🔨 构建项目..."
cd ../..
yarn build external/qwen
cd external/qwen
echo "✅ 构建完成"
echo ""

# 3. 初始化 git（如果需要）
if [ ! -d ".git" ]; then
    echo "📝 初始化 Git 仓库..."
    git init
    git remote add origin https://github.com/yexingzhi/koishi-plugin-qwen.git
    echo "✅ Git 仓库已初始化"
else
    echo "✅ Git 仓库已存在"
fi
echo ""

# 4. 提交代码
echo "📤 提交代码到 GitHub..."
git add -A
git commit -m "Release v$VERSION" || echo "⚠️ 没有新的更改"
git branch -M main
git push -u origin main || echo "⚠️ 推送失败，请检查网络"
echo "✅ 代码已推送"
echo ""

# 5. 创建标签
echo "🏷️ 创建 Git 标签..."
git tag -a v$VERSION -m "Release v$VERSION" || echo "⚠️ 标签已存在"
git push origin v$VERSION || echo "⚠️ 标签推送失败"
echo "✅ 标签已创建"
echo ""

# 6. 发布到 npm
echo "📦 发布到 npm..."
echo "请确保已登录 npm: npm login"
echo ""
read -p "是否继续发布到 npm? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm publish
    echo "✅ 已发布到 npm"
else
    echo "⏭️ 跳过 npm 发布"
fi
echo ""

echo "🎉 发布流程完成！"
echo ""
echo "📋 后续步骤："
echo "1. 访问 GitHub 创建 Release: https://github.com/yexingzhi/koishi-plugin-qwen/releases"
echo "2. 提交到 Koishi 官方市场: https://github.com/koishijs/registry"
echo ""
