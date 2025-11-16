# 千问插件功能文档

## Phase 1: 配置管理系统 ✅

### 已实现功能

#### 1. 多模型支持
- 支持添加多个大模型
- 每个模型独立配置 API Key 和参数
- 支持模型切换

#### 2. 配置管理命令

##### 查看配置
```
/qwen-config
```
显示当前插件配置信息，包括：
- 默认模型
- 温度和最大 Token
- 模型数量
- 功能开关状态

**示例输出：**
```
⚙️ 当前配置:
  默认模型: qwen-plus
  温度: 0.7
  最大 Token: 2000
  模型数量: 1

✨ 功能开关:
  文生图: ✅
  图片编辑: ✅
  文生视频: ✅
  翻译: ✅
  表情包生成: ✅
```

##### 列出所有模型
```
/qwen-model list
```
显示所有可用的模型列表，当前模型用 ✓ 标记。

**示例输出：**
```
📋 可用模型:
  ✓ qwen-plus - 平衡模型，推荐使用
    qwen-turbo - 快速模型，适合实时对话
    qwen-max - 高性能模型，适合复杂任务
```

##### 切换模型
```
/qwen-model switch <name>
```
切换到指定的模型。

**示例：**
```
/qwen-model switch qwen-max
```

**输出：**
```
✅ 已切换到模型: 📦 qwen-max - 高性能模型，适合复杂任务
```

##### 添加模型
```
/qwen-model add <name> <apiKey> [model]
```
添加一个新的模型配置。

**参数：**
- `name` - 模型名称（唯一标识）
- `apiKey` - 阿里云 API Key
- `model` - 模型类型（可选，默认与 name 相同）

**示例：**
```
/qwen-model add my-model sk-xxxxx qwen-plus
```

**输出：**
```
✅ 已添加模型: 📦 my-model
```

##### 删除模型
```
/qwen-model remove <name>
```
删除指定的模型配置。

**示例：**
```
/qwen-model remove my-model
```

**输出：**
```
✅ 已删除模型: my-model
```

**注意：** 不能删除当前使用的模型。

##### 查看当前模型
```
/qwen-current
```
显示当前正在使用的模型。

**示例输出：**
```
📦 当前模型: 📦 qwen-plus - 平衡模型，推荐使用
```

#### 3. 对话命令

##### 基础对话
```
/chat <message>
/ask <message>
```
与当前模型进行对话。

**示例：**
```
/chat 你好，请介绍一下自己
/ask 帮我写一个 Python 程序
```

### 配置选项

在 Koishi 控制台的插件配置中可以设置：

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `apiKey` | string | - | 阿里云百炼 API Key（必需） |
| `model` | string | qwen-plus | 默认使用的模型 |
| `baseURL` | string | https://dashscope.aliyuncs.com/compatible-mode/v1 | API 基础 URL |
| `temperature` | number | 0.7 | 创意度 (0-2) |
| `maxTokens` | number | 2000 | 最大输出 token 数 |
| `enableTextToImage` | boolean | true | 启用文生图功能 |
| `enableImageEdit` | boolean | true | 启用图片编辑功能 |
| `enableTextToVideo` | boolean | true | 启用文生视频功能 |
| `enableTranslate` | boolean | true | 启用翻译功能 |
| `enableEmojiGenerator` | boolean | true | 启用表情包生成功能 |

---

## Phase 2: 文生图功能 ✅

**状态：** 已实现

### 命令

#### 生成图像
```
/image <prompt> [-s <size>] [-t <style>]
```

**参数：**
- `prompt` - 图像描述（必需）
- `-s <size>` - 图像尺寸（可选）
- `-t <style>` - 图像风格（可选）

**示例：**
```
/image 一只可爱的猫咪坐在沙发上
/image 美丽的日落 -s 1024x1024
```

#### 查看支持的尺寸
```
/image-sizes
```

**支持的尺寸：**
- 512x512
- 768x768
- 1024x1024
- 1024x1536
- 1536x1024

---

## Phase 3: 图片编辑功能 ✅

**状态：** 已实现

### 命令

#### 编辑图片
```
/edit-image <action> <imageUrl> <prompt>
```

**参数：**
- `action` - 编辑操作（必需）
- `imageUrl` - 图片 URL（必需）
- `prompt` - 编辑描述（必需）

**示例：**
```
/edit-image fix https://example.com/image.jpg 移除图片中的水印
/edit-image extend https://example.com/image.jpg 扩展图片的右侧
```

#### 查看支持的编辑操作
```
/edit-actions
```

**支持的操作：**
- fix - 修复/去除瑕疵
- extend - 扩展/补全
- inpaint - 内容填充
- enhance - 增强/优化
- style-transfer - 风格转换

---

## Phase 4: 文生视频功能 ✅

**状态：** 已实现

### 命令

#### 生成视频
```
/video <prompt> [-d <duration>] [-q <quality>]
```

**参数：**
- `prompt` - 视频描述（必需）
- `-d <duration>` - 视频时长（秒，可选）
- `-q <quality>` - 视频质量（可选）

**示例：**
```
/video 一只狗在公园里跑步
/video 日落时的海滩 -d 30 -q high
```

#### 查看支持的时长
```
/video-durations
```

**支持的时长：**
- 5 秒
- 10 秒
- 15 秒
- 30 秒
- 60 秒

---

## Phase 5: 翻译功能 ✅

**状态：** 已实现

### 命令

#### 翻译文本
```
/translate <text> <targetLanguage> [-s <source>]
```

**参数：**
- `text` - 要翻译的文本（必需）
- `targetLanguage` - 目标语言（必需）
- `-s <source>` - 源语言（可选，默认自动检测）

**示例：**
```
/translate "Hello, how are you?" zh
/translate "你好，今天天气很好" en -s zh
```

#### 查看支持的语言
```
/languages
```

**支持的语言：**
- zh - 中文
- en - 英文
- ja - 日文
- ko - 韩文
- es - 西班牙文
- fr - 法文
- de - 德文
- ru - 俄文
- pt - 葡萄牙文
- it - 意大利文
- th - 泰文
- vi - 越南文
- ar - 阿拉伯文
- hi - 印地文
- tr - 土耳其文

---

## Phase 6: 表情包生成功能 ✅

**状态：** 已实现

### 命令

#### 生成表情包
```
/emoji <imageUrl> [-s <style>]
```

**参数：**
- `imageUrl` - 图片 URL（必需）
- `-s <style>` - 表情包风格（可选）

**示例：**
```
/emoji https://example.com/photo.jpg
/emoji https://example.com/photo.jpg -s funny
```

#### 生成表情包视频
```
/emoji-video <imageUrl> [-s <style>]
```

**参数：**
- `imageUrl` - 图片 URL（必需）
- `-s <style>` - 表情包风格（可选）

**示例：**
```
/emoji-video https://example.com/photo.jpg
/emoji-video https://example.com/photo.jpg -s cool
```

#### 查看支持的风格
```
/emoji-styles
```

**支持的风格：**
- cute - 可爱风格
- funny - 搞笑风格
- cool - 酷炫风格
- sad - 伤感风格
- angry - 愤怒风格
- love - 爱心风格
- confused - 困惑风格
- excited - 兴奋风格
- sleepy - 困倦风格
- shocked - 震惊风格

---

## 使用示例

### 场景 1: 添加多个模型并切换

```
# 添加 qwen-max 模型
/qwen-model add qwen-max sk-xxxxx qwen-max

# 查看所有模型
/qwen-model list

# 切换到 qwen-max
/qwen-model switch qwen-max

# 验证切换
/qwen-current
```

### 场景 2: 使用不同模型进行对话

```
# 使用当前模型对话
/chat 这是什么？

# 切换模型
/qwen-model switch qwen-turbo

# 使用新模型对话
/ask 用另一个模型回答同样的问题
```

### 场景 3: 查看和管理配置

```
# 查看当前配置
/qwen-config

# 查看当前模型
/qwen-current

# 列出所有模型
/qwen-model list
```

---

## 故障排除

### 问题：添加模型时提示 API Key 格式不正确

**原因：** API Key 必须以 `sk-` 开头

**解决方案：** 确保 API Key 格式正确，从阿里云控制台复制完整的 Key

### 问题：无法删除当前模型

**原因：** 系统不允许删除正在使用的模型

**解决方案：** 先切换到其他模型，再删除

### 问题：切换模型后对话失败

**原因：** 新模型的 API Key 无效或配置错误

**解决方案：** 检查模型的 API Key 和 baseURL 配置

---

## 技术细节

### 模型管理器

`ModelManager` 类负责管理所有模型配置：

```typescript
// 获取所有模型
const models = modelManager.getAllModels()

// 获取当前模型
const current = modelManager.getCurrentModel()

// 切换模型
modelManager.setCurrentModel('qwen-max')

// 添加模型
modelManager.addModel(newModel)

// 删除模型
modelManager.removeModel('my-model')
```

### 配置持久化

模型配置通过 Koishi 的配置系统自动持久化，重启后会自动恢复。

### 错误处理

所有命令都包含完善的错误处理和用户提示。

---

## 下一步

- [ ] 实现文生图功能
- [ ] 实现图片编辑功能
- [ ] 实现文生视频功能
- [ ] 实现翻译功能
- [ ] 实现表情包生成功能

