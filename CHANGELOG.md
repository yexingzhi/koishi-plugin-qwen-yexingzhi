# Changelog

所有值得注意的项目变更都将记录在此文件中。

## [0.0.1] - 2025-11-16

### Added
- ✨ 初始版本发布
- 🎯 支持与千问大模型进行实时对话
- 📝 两个命令别名：`chat` 和 `ask`
- 🔄 支持多个大模型配置和动态切换
- ⚙️ 可配置的模型参数（温度、最大token等）
- 🛡️ 完善的错误处理和日志记录

### Text-to-Image Features
- 🖼️ 文生图功能（qwen-image-plus 模型）
- 📐 支持 5 种图像尺寸
- 🎨 支持 5 种艺术风格
- 🌍 支持北京和新加坡地域

### Image Edit Features
- ✏️ 图片编辑功能（qwen-image-edit-plus 模型）
- 🔧 支持 5 种编辑操作：修复、扩展、修补、增强、风格迁移
- 🤖 自动从中文提示词识别编辑操作
- 🌍 支持北京和新加坡地域

### Text-to-Video Features
- 🎬 文生视频功能（wan2.5-t2v-preview 模型）
- ⏱️ 支持 5 秒和 10 秒时长
- 📺 支持多种分辨率（480P、720P、1080P）
- 🌍 支持自动配音
- 🔄 支持异步任务轮询
- 🎯 支持自动中文识别（时长、分辨率）
- 🌍 支持北京和新加坡地域

### Translate Features
- 🌐 翻译功能（qwen-mt-flash 模型）
- 🗣️ 支持 92+ 种语言
- 🔄 自动语言检测
- 🌍 支持北京和新加坡地域

### Regional Support
- 🗺️ 支持北京和新加坡地域
- 🔄 运行时动态切换地域（`/qwen-region` 命令）
- 📍 所有服务支持地域配置
- 🌐 支持国际版（intl）别名

### Model Management
- 📋 `/qwen-model list` - 列出所有模型
- 🔄 `/qwen-model switch <name>` - 切换模型
- ➕ `/qwen-model add <name> <apiKey> [model]` - 添加模型
- ➖ `/qwen-model remove <name>` - 删除模型
- 📊 `/qwen-current` - 查看当前模型
- ⚙️ `/qwen-config` - 查看配置

### Commands
- `/chat <message>` - 对话
- `/ask <message>` - 对话（别名）
- `/image <prompt>` - 文生图
- `/image-sizes` - 查看支持的图像尺寸
- `/edit-image <text>` - 编辑图片
- `/edit-actions` - 查看支持的编辑操作
- `/video <prompt>` - 文生视频
- `/video-durations` - 查看支持的视频时长
- `/translate <text> <language>` - 翻译
- `/languages` - 查看支持的语言
- `/qwen-region <region>` - 切换地域

### Bug Fixes
- 🐛 修复翻译 API 调用问题
- 🐛 修复图片编辑操作识别问题
- 🐛 修复视频生成参数验证问题
- 🐛 修复地域配置不生效问题

### Documentation
- 📚 完整的 README.md
- 📚 详细的 API 文档
- 📚 使用示例和常见问题

## Future Plans

### v0.1.0
- [ ] 多轮对话支持
- [ ] 对话历史管理
- [ ] 流式输出支持
- [ ] 自定义系统提示词

### v0.2.0
- [ ] 图片上传功能
- [ ] 批量图片处理
- [ ] 视频预览
- [ ] 下载功能

### v0.3.0
- [ ] 数据库支持
- [ ] 用户配置保存
- [ ] 权限管理
- [ ] 速率限制

---

**注意**: 版本号遵循 [Semantic Versioning](https://semver.org/)。
