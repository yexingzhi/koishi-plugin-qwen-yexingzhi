# koishi-plugin-qwen

[![npm](https://img.shields.io/npm/v/koishi-plugin-qwen?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-qwen)
[![downloads](https://img.shields.io/npm/dm/koishi-plugin-qwen?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-qwen)
[![license](https://img.shields.io/npm/l/koishi-plugin-qwen?style=flat-square)](https://opensource.org/licenses/MIT)

阿里云千问大模型 Koishi 插件，提供完整的 AI 功能集成。

## 功能特性

### 核心功能 ✅
- ✨ 支持与千问大模型进行实时对话
- 🎯 两个命令别名：`chat` 和 `ask`
- 🔄 支持多个大模型配置和动态切换
- ⚙️ 可配置的模型参数（温度、最大token等）
- 🛡️ 完善的错误处理和日志记录
- 🎮 模型管理命令：添加、删除、切换、列表

### 文生图 (Text-to-Image) ✅
- 🖼️ 基于 qwen-image-plus 模型
- 📐 支持 5 种图像尺寸（1328x1328、1664x928 等）
- 🎨 支持 5 种艺术风格（逼真摄影、艺术风格、卡通等）
- 🌍 支持北京和新加坡地域

### 图片编辑 (Image Edit) ✅
- ✏️ 基于 qwen-image-edit-plus 模型
- 🔧 支持 5 种编辑操作：修复、扩展、修补、增强、风格迁移
- 🤖 自动从中文提示词识别编辑操作
- 🌍 支持北京和新加坡地域

### 文生视频 (Text-to-Video) ✅
- 🎬 基于 WanXing 2.5 (wan2.5-t2v-preview) 模型
- ⏱️ 支持 5 秒和 10 秒时长
- 📺 支持多种分辨率（480P、720P、1080P）
- 🎵 支持自动配音
- 🔄 支持异步任务轮询
- 🎯 支持自动中文识别（时长、分辨率）
- 🌍 支持北京和新加坡地域

### 翻译 (Translate) ✅
- 🌐 基于 qwen-mt-flash 模型
- 🗣️ 支持 92+ 种语言
- 🔄 自动语言检测
- 🌍 支持北京和新加坡地域

### 地域支持 ✅
- 🗺️ 支持北京和新加坡地域
- 🔄 运行时动态切换地域
- 📍 所有服务支持地域配置
- 🌐 支持国际版（intl）别名

## 安装

该插件已集成在 koishi-app 中，位于 `external/qwen` 目录。

## 配置

### 1. 获取 API Key

访问 [阿里云百炼控制台](https://bailian.console.aliyun.com/) 获取 API Key。

### 2. 配置环境变量

在项目根目录的 `.env` 文件中添加：

```env
DASHSCOPE_API_KEY=sk-your-api-key-here
```

### 3. 插件配置

在 `koishi.yml` 中的插件配置：

```yaml
plugins:
  qwen:
    apiKey: sk-your-api-key-here
    model: qwen-plus
    baseURL: https://dashscope.aliyuncs.com/compatible-mode/v1
    temperature: 0.7
    maxTokens: 2000
    region: beijing  # 或 singapore
    enableTextToImage: true
    enableImageEdit: true
    enableTextToVideo: true
    enableTranslate: true
```

#### 配置参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `apiKey` | string | - | 阿里云百炼 API Key（必需） |
| `model` | string | `qwen-plus` | 使用的模型名称 |
| `baseURL` | string | `https://dashscope.aliyuncs.com/compatible-mode/v1` | API 基础 URL |
| `temperature` | number | `0.7` | 创意度，范围 0-2，值越大回复越创意 |
| `maxTokens` | number | `2000` | 最大输出 token 数 |
| `region` | string | `beijing` | API 地域：`beijing` 或 `singapore` |
| `enableTextToImage` | boolean | `true` | 是否启用文生图功能 |
| `enableImageEdit` | boolean | `true` | 是否启用图片编辑功能 |
| `enableTextToVideo` | boolean | `true` | 是否启用文生视频功能 |
| `enableTranslate` | boolean | `true` | 是否启用翻译功能 |

## 使用

### 对话命令

#### chat 命令

```
/chat <message>
```

与当前千问大模型进行对话。

**示例：**
```
/chat 你是谁？
/chat 如何学习 TypeScript？
/chat 帮我写一个 Hello World 程序
```

#### ask 命令

```
/ask <message>
```

与 `chat` 命令功能相同，是其别名。

**示例：**
```
/ask 今天天气怎么样？
/ask 解释一下人工智能
```

### 配置管理命令

#### 查看配置

```
/qwen-config
```

显示当前插件的所有配置信息。

#### 模型管理

```
/qwen-model list          # 列出所有模型
/qwen-model switch <name> # 切换到指定模型
/qwen-model add <name> <apiKey> [model]  # 添加新模型
/qwen-model remove <name> # 删除模型
```

**示例：**
```
# 列出所有模型
/qwen-model list

# 切换到 qwen-max 模型
/qwen-model switch qwen-max

# 添加自定义模型
/qwen-model add my-model sk-xxxxx qwen-plus

# 删除模型
/qwen-model remove my-model
```

#### 查看当前模型

```
/qwen-current
```

显示当前正在使用的模型。

#### 地域切换

```
/qwen-region <region>
```

动态切换 API 地域。

**示例：**
```
/qwen-region beijing     # 切换到北京地域
/qwen-region singapore   # 切换到新加坡地域
/qwen-region intl        # 切换到国际版（等同于新加坡）
```

### 文生图命令

#### 生成图片

```
/image <prompt>
```

根据文本描述生成图片。

**示例：**
```
/image 一只可爱的猫咪
/image 日落时的海滩，油画风格
/image 未来城市，科幻风格
```

#### 查看支持的尺寸

```
/image-sizes
```

显示支持的图像尺寸列表。

### 图片编辑命令

#### 编辑图片

```
/edit-image <text>
```

编辑图片。需要在消息中包含图片 URL 和编辑操作。

**示例：**
```
/edit-image <image_url> 修复图片中的缺陷
/edit-image <image_url> 扩展图片边界
/edit-image <image_url> 增强图片质量
/edit-image <image_url> 转换为油画风格
```

#### 查看支持的编辑操作

```
/edit-actions
```

显示支持的编辑操作列表。

### 文生视频命令

#### 生成视频

```
/video <prompt>
```

根据文本描述生成视频。支持自动识别时长和分辨率。

**示例：**
```
/video 一只狐狸在森林里奔跑
/video 一只狐狸在森林里奔跑 10秒 1080p
/video 猫咪玩耍 5秒 720p
```

**时长支持：** 5 秒、10 秒（默认 5 秒）

**分辨率支持：** 480P、720P、1080P（默认 480P）

#### 查看支持的时长

```
/video-durations
```

显示支持的视频时长列表。

### 翻译命令

#### 翻译文本

```
/translate <text> <language>
```

将文本翻译为指定语言。

**示例：**
```
/translate 你好世界 英文
/translate Hello World 中文
/translate Bonjour 日文
```

#### 查看支持的语言

```
/languages
```

显示支持的语言列表。

## 支持的模型

| 模型名称 | 描述 | 用途 |
|---------|------|------|
| `qwen-turbo` | 快速模型 | 实时对话、快速响应 |
| `qwen-plus` | 平衡模型 | 通用对话、推荐使用 |
| `qwen-max` | 高性能模型 | 复杂任务、高质量输出 |

## 错误处理

插件包含完善的错误处理：

- **API Key 无效**：返回 `❌ API Key 无效或已过期，请检查配置`
- **请求过于频繁**：返回 `❌ 请求过于频繁，请稍后再试`
- **服务器错误**：返回 `❌ 服务器错误，请稍后重试`
- **其他错误**：返回具体错误信息

所有错误都会被记录到日志中，便于调试。

## 开发

### 项目结构

```
external/qwen/
├── src/
│   └── index.ts          # 插件主文件
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── README.md             # 本文件
```

### 修改插件

编辑 `src/index.ts` 文件进行修改。

### 构建

```bash
# 构建所有插件
yarn build

# 仅构建 qwen 插件
yarn build external/qwen
```

### 开发模式

```bash
# 启动开发服务器（支持热重载）
yarn dev
```

## 扩展功能

### 添加多轮对话支持

可以修改插件以支持对话历史：

```typescript
// 在 apply 函数中添加对话历史管理
const conversationHistory = new Map<string, Array<{ role: string; content: string }>>()

ctx.command('chat <message:text>')
  .action(async ({ session }, message) => {
    const userId = session.userId
    const history = conversationHistory.get(userId) || []
    
    // 添加用户消息
    history.push({ role: 'user', content: message })
    
    // 调用 API
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: history,
      // ...
    })
    
    // 添加助手响应
    const response = completion.choices[0]?.message?.content
    history.push({ role: 'assistant', content: response })
    
    // 保存历史（限制长度）
    if (history.length > 20) {
      history.shift()
      history.shift()
    }
    conversationHistory.set(userId, history)
    
    return response
  })
```

### 添加流式输出

```typescript
ctx.command('chat <message:text>')
  .action(async ({ session }, message) => {
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [{ role: 'user', content: message }],
      stream: true,
    })
    
    let fullContent = ''
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        fullContent += content
        // 可以实时发送内容
      }
    }
    
    return fullContent
  })
```

## 常见问题

### Q: 如何更换模型？

A: 修改 `koishi.yml` 中的 `model` 参数：

```yaml
qwen:qwen001:
  model: qwen-max  # 改为其他模型
```

### Q: 如何调整回复的创意度？

A: 修改 `temperature` 参数：

```yaml
qwen:qwen001:
  temperature: 1.5  # 范围 0-2，值越大越创意
```

### Q: API 调用失败怎么办？

A: 检查以下几点：

1. API Key 是否正确配置在 `.env` 文件中
2. 网络连接是否正常
3. API Key 是否有效且未过期
4. 查看 Koishi 控制台的日志输出

### Q: 如何支持多轮对话？

A: 见上面的"扩展功能"部分。

## 许可证

MIT

## 相关链接

- [Koishi 官网](https://koishi.chat/)
- [阿里云百炼](https://bailian.console.aliyun.com/)
- [OpenAI SDK for Node.js](https://github.com/openai/node-sdk)
