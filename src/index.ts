import { Context, Schema } from 'koishi'
import OpenAI from 'openai'
import { ModelManager, createDefaultConfig, PRESET_MODELS } from './models'
import { PluginConfig, ModelConfig } from './types'
import { logger, formatError, formatConfigInfo, formatModelInfo, validateApiKey } from './utils'
import {
  TextToImageService,
  ImageEditService,
  TextToVideoService,
  TranslateService
} from './services'

export const name = 'qwen'

export interface Config {
  apiKey: string
  model: string
  baseURL: string
  region: string
  temperature: number
  maxTokens: number
  enableTextToImage: boolean
  enableImageEdit: boolean
  enableTextToVideo: boolean
  enableTranslate: boolean
}

export const Config: Schema<Config> = Schema.object({
  apiKey: Schema.string()
    .required()
    .description('阿里云百炼 API Key'),
  model: Schema.string()
    .default('qwen-plus')
    .description('默认使用的模型名称'),
  baseURL: Schema.string()
    .default('https://dashscope.aliyuncs.com/compatible-mode/v1')
    .description('API 基础 URL'),
  region: Schema.string()
    .default('beijing')
    .description('API 地域 (beijing 或 singapore)'),
  temperature: Schema.number()
    .default(0.7)
    .min(0)
    .max(2)
    .description('创意度 (0-2)'),
  maxTokens: Schema.number()
    .default(2000)
    .min(1)
    .description('最大输出 token 数'),
  enableTextToImage: Schema.boolean()
    .default(true)
    .description('启用文生图功能'),
  enableImageEdit: Schema.boolean()
    .default(true)
    .description('启用图片编辑功能'),
  enableTextToVideo: Schema.boolean()
    .default(true)
    .description('启用文生视频功能'),
  enableTranslate: Schema.boolean()
    .default(true)
    .description('启用翻译功能'),
})

export function apply(ctx: Context, config: Config) {
  logger.info('[插件] Qwen 插件启动')
  logger.info(`[插件] 配置: apiKey=${config.apiKey?.substring(0, 10)}..., model=${config.model}`)
  logger.info(`[插件] 功能启用: 文生图=${config.enableTextToImage}, 图片编辑=${config.enableImageEdit}, 文生视频=${config.enableTextToVideo}, 翻译=${config.enableTranslate}`)
  
  // 验证 API Key
  if (!validateApiKey(config.apiKey)) {
    logger.error('无效的 API Key 格式')
    return
  }

  // 初始化模型管理器
  const pluginConfig: PluginConfig = {
    defaultModel: config.model,
    models: [
      {
        name: config.model,
        model: config.model,
        baseURL: config.baseURL,
        apiKey: config.apiKey,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        description: '主模型'
      }
    ],
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    enableTextToImage: config.enableTextToImage,
    enableImageEdit: config.enableImageEdit,
    enableTextToVideo: config.enableTextToVideo,
    enableTranslate: config.enableTranslate
  }

  const modelManager = new ModelManager(pluginConfig)
  
  // 创建 OpenAI 客户端
  const createOpenAIClient = (model: ModelConfig) => {
    return new OpenAI({
      apiKey: model.apiKey,
      baseURL: model.baseURL,
    })
  }

  let openai = createOpenAIClient(modelManager.getCurrentModel()!)

  // 初始化服务
  logger.info('[插件] 初始化服务...')
  let textToImageService = new TextToImageService(config.apiKey, config.region)
  logger.info('[插件] 文生图服务已初始化 (地域: ' + config.region + ')')
  let imageEditService = new ImageEditService(config.apiKey, config.region)
  logger.info('[插件] 图片编辑服务已初始化 (地域: ' + config.region + ')')
  let textToVideoService = new TextToVideoService(config.apiKey, config.region)
  logger.info('[插件] 文生视频服务已初始化 (地域: ' + config.region + ')')
  let translateService = new TranslateService(config.apiKey, config.region)
  logger.info('[插件] 翻译服务已初始化 (地域: ' + config.region + ')')

  // 注册 chat 命令
  ctx.command('chat <message:text>', '与千问大模型对话')
    .action(async ({ session }, message) => {
      if (!message) {
        return '请输入要对话的内容'
      }

      try {
        // 显示正在处理的提示
        await session.send('正在思考中...')

        const completion = await openai.chat.completions.create({
          model: config.model,
          messages: [
            {
              role: 'system',
              content: '你是一个有帮助的助手。请用简洁清晰的方式回答问题。',
            },
            {
              role: 'user',
              content: message,
            },
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
        })

        const response = completion.choices[0]?.message?.content

        if (!response) {
          return '未能获取回复，请稍后重试'
        }

        return response
      } catch (error) {
        ctx.logger.error('千问 API 调用失败:', error)

        if (error instanceof Error) {
          if (error.message.includes('401')) {
            return '❌ API Key 无效或已过期，请检查配置'
          } else if (error.message.includes('429')) {
            return '❌ 请求过于频繁，请稍后再试'
          } else if (error.message.includes('500')) {
            return '❌ 服务器错误，请稍后重试'
          }
          return `❌ 错误: ${error.message}`
        }

        return '❌ 发生未知错误，请查看日志'
      }
    })

  // 注册 ask 命令（别名）
  ctx.command('ask <message:text>', '与千问大模型对话 (chat 的别名)')
    .action(async ({ session }, message) => {
      if (!message) {
        return '请输入要对话的内容'
      }

      try {
        await session.send('正在思考中...')

        const completion = await openai.chat.completions.create({
          model: config.model,
          messages: [
            {
              role: 'system',
              content: '你是一个有帮助的助手。请用简洁清晰的方式回答问题。',
            },
            {
              role: 'user',
              content: message,
            },
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
        })

        const response = completion.choices[0]?.message?.content

        if (!response) {
          return '未能获取回复，请稍后重试'
        }

        return response
      } catch (error) {
        ctx.logger.error('千问 API 调用失败:', error)

        if (error instanceof Error) {
          if (error.message.includes('401')) {
            return '❌ API Key 无效或已过期，请检查配置'
          } else if (error.message.includes('429')) {
            return '❌ 请求过于频繁，请稍后再试'
          } else if (error.message.includes('500')) {
            return '❌ 服务器错误，请稍后重试'
          }
          return `❌ 错误: ${error.message}`
        }

        return '❌ 发生未知错误，请查看日志'
      }
    })

  // 注册配置命令
  ctx.command('qwen-config', '查看千问插件配置')
    .action(({ session }) => {
      return formatConfigInfo(pluginConfig)
    })

  // 注册模型列表命令
  ctx.command('qwen-model', '模型管理')
    .subcommand('list', '列出所有模型')
    .action(({ session }) => {
      const models = modelManager.getAllModels()
      if (models.length === 0) {
        return '❌ 没有配置任何模型'
      }
      const list = modelManager.getModelListString()
      return `📋 可用模型:\n${list}`
    })

  // 注册模型切换命令
  ctx.command('qwen-model switch <name:string>', '切换模型')
    .action(({ session }, name) => {
      if (!name) {
        return '❌ 请指定模型名称'
      }

      if (modelManager.setCurrentModel(name)) {
        const model = modelManager.getCurrentModel()
        openai = createOpenAIClient(model!)
        // 更新所有服务
        textToImageService = new TextToImageService(config.apiKey, config.region)
        imageEditService = new ImageEditService(config.apiKey, config.region)
        textToVideoService = new TextToVideoService(config.apiKey, config.region)
        translateService = new TranslateService(config.apiKey, config.region)
        return `✅ 已切换到模型: ${formatModelInfo(name, model?.description)}`
      } else {
        return `❌ 模型 "${name}" 不存在`
      }
    })

  // 注册地域切换命令
  ctx.command('qwen-region <region:string>', '切换 API 地域')
    .action(({ session }, region) => {
      if (!region) {
        return `❌ 请指定地域\n📍 支持的地域: beijing (北京), singapore (新加坡)`
      }

      const validRegions = ['beijing', 'singapore', 'intl']
      if (!validRegions.includes(region.toLowerCase())) {
        return `❌ 不支持的地域: ${region}\n📍 支持的地域: beijing (北京), singapore (新加坡)`
      }

      const normalizedRegion = region.toLowerCase() === 'intl' ? 'singapore' : region.toLowerCase()
      config.region = normalizedRegion

      // 重新初始化所有服务
      textToImageService = new TextToImageService(config.apiKey, config.region)
      imageEditService = new ImageEditService(config.apiKey, config.region)
      textToVideoService = new TextToVideoService(config.apiKey, config.region)
      translateService = new TranslateService(config.apiKey, config.region)

      // 更新 OpenAI 客户端的 baseURL
      const model = modelManager.getCurrentModel()
      if (model) {
        const newBaseUrl = normalizedRegion === 'singapore' 
          ? 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
          : 'https://dashscope.aliyuncs.com/compatible-mode/v1'
        model.baseURL = newBaseUrl
        openai = createOpenAIClient(model)
      }

      const regionName = normalizedRegion === 'singapore' ? '新加坡' : '北京'
      return `✅ 已切换到地域: ${regionName} (${normalizedRegion})\n📍 所有服务已更新`
    })

  // 注册模型添加命令
  ctx.command('qwen-model add <name:string> <apiKey:string> [model:string]', '添加模型')
    .action(({ session }, name, apiKey, model) => {
      if (!name || !apiKey) {
        return '❌ 请提供模型名称和 API Key'
      }

      if (!validateApiKey(apiKey)) {
        return '❌ API Key 格式不正确'
      }

      const newModel: ModelConfig = {
        name,
        model: model || name,
        baseURL: config.baseURL,
        apiKey,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        description: `自定义模型 - ${name}`
      }

      if (modelManager.addModel(newModel)) {
        return `✅ 已添加模型: ${formatModelInfo(name)}`
      } else {
        return `❌ 模型 "${name}" 已存在`
      }
    })

  // 注册模型删除命令
  ctx.command('qwen-model remove <name:string>', '删除模型')
    .action(({ session }, name) => {
      if (!name) {
        return '❌ 请指定模型名称'
      }

      if (modelManager.removeModel(name)) {
        return `✅ 已删除模型: ${name}`
      } else {
        return `❌ 无法删除模型 "${name}" (可能是当前模型或不存在)`
      }
    })

  // 注册当前模型查询命令
  ctx.command('qwen-current', '查看当前模型')
    .action(({ session }) => {
      const current = modelManager.getCurrentModel()
      if (!current) {
        return '❌ 没有可用的模型'
      }
      return `📦 当前模型: ${formatModelInfo(current.name, current.description)}`
    })

  // ==================== 文生图功能 ====================

  // 注册文生图命令
  ctx.command('image <prompt:text>', '生成图像')
    .option('size', '-s <size:string> 图像尺寸')
    .option('style', '-t <style:string> 图像风格')
    .action(async ({ session, options }, prompt) => {
      if (!pluginConfig.enableTextToImage) {
        return '❌ 文生图功能未启用'
      }

      if (!prompt) {
        return '❌ 请提供图像描述'
      }

      try {
        const result = await textToImageService.generateImage({
          prompt,
          size: options?.size,
          quality: 'standard'
        })

        if (result.success) {
          // 直接发送图片
          await session.send(`<image url="${result.data}" />`)
          return ''
        } else {
          return `❌ ${result.error}`
        }
      } catch (error) {
        return `❌ 生成图像失败: ${formatError(error)}`
      }
    })

  // 注册图像尺寸列表命令
  ctx.command('image-sizes', '查看支持的图像尺寸')
    .action(() => {
      return `📐 支持的图像尺寸:\n${textToImageService.formatSizesList()}`
    })

  // ==================== 图片编辑功能 ====================

  // 注册图片编辑命令
  logger.info('[插件] 注册图片编辑命令: edit-image')
  ctx.command('edit-image <text:text>', '编辑图片')
    .action(async ({ session }, text) => {
      logger.info(`[命令] 图片编辑命令被触发`)
      logger.info(`[命令] 原始输入: text=${text}`)
      
      if (!pluginConfig.enableImageEdit) {
        ctx.logger.warn(`[命令] 图片编辑功能未启用`)
        return '❌ 图片编辑功能未启用'
      }

      // 从 text 中提取图片 URL 和编辑描述
      const imgMatch = text.match(/<img[^>]*src="([^"]+)"/)
      let imageUrl = imgMatch ? imgMatch[1] : null
      
      // 提取中文文本（去掉 <img> 标签）
      let prompt = text.replace(/<img[^>]*>/g, '').trim()
      
      logger.info(`[命令] 提取的 imageUrl: ${imageUrl}`)
      logger.info(`[命令] 提取的 prompt: ${prompt}`)
      
      if (!imageUrl || !prompt) {
        ctx.logger.warn(`[命令] 参数不完整: imageUrl=${imageUrl}, prompt=${prompt}`)
        return '❌ 请提供图片和编辑描述\n用法: /edit-image <编辑描述> [图片]'
      }

      try {
        // 根据中文描述自动识别编辑操作
        const action = imageEditService.detectActionFromPrompt(prompt)
        logger.info(`[命令] 自动识别的操作: ${action}`)
        ctx.logger.info(`[命令] 自动识别的操作: ${action}`)
        
        ctx.logger.info(`[命令] 调用图片编辑服务...`)
        const result = await imageEditService.editImage({
          imageUrl,
          action,
          prompt
        })

        if (result.success) {
          ctx.logger.info(`[命令] 图片编辑成功，发送图片: ${result.data}`)
          // 直接发送编辑后的图片
          await session.send(`<image url="${result.data}" />`)
          return ''
        } else {
          ctx.logger.error(`[命令] 图片编辑失败: ${result.error}`)
          return `❌ ${result.error}`
        }
      } catch (error) {
        ctx.logger.error(`[命令] 图片编辑异常: ${formatError(error)}`)
        return `❌ 编辑图片失败: ${formatError(error)}`
      }
    })

  // 注册图片编辑操作列表命令
  ctx.command('edit-actions', '查看支持的图片编辑操作')
    .action(() => {
      return `🎨 支持的编辑操作:\n${imageEditService.formatActionsList()}`
    })

  // ==================== 文生视频功能 ====================

  // 注册文生视频命令
  ctx.command('video <prompt:text>', '生成视频')
    .action(async ({ session }, prompt) => {
      if (!pluginConfig.enableTextToVideo) {
        return '❌ 文生视频功能未启用'
      }

      if (!prompt) {
        return '❌ 请提供视频描述'
      }

      try {
        // 从中文描述自动识别时长和分辨率
        const duration = parseInt(textToVideoService.detectDurationFromChinese(prompt))
        const size = textToVideoService.detectResolutionFromChinese(prompt)

        logger.info(`[命令] 文生视频命令被触发`)
        logger.info(`[命令] 提示词: ${prompt}`)
        logger.info(`[命令] 识别的时长: ${duration}秒`)
        logger.info(`[命令] 识别的分辨率: ${size}`)

        const result = await textToVideoService.generateVideo({
          prompt,
          duration,
          size
        })

        if (result.success) {
          // 直接发送视频
          await session.send(`<video url="${result.data}" />`)
          return ''
        } else {
          return `❌ ${result.error}`
        }
      } catch (error) {
        return `❌ 生成视频失败: ${formatError(error)}`
      }
    })

  // 注册视频时长列表命令
  ctx.command('video-durations', '查看支持的视频时长')
    .action(() => {
      return `⏱️ 支持的视频时长:\n${textToVideoService.formatDurationsList()}`
    })

  // ==================== 翻译功能 ====================

  // 注册翻译命令
  ctx.command('translate <text:text>', '翻译文本')
    .option('source', '-s <source:string> 源语言')
    .action(async ({ session, options }, text) => {
      logger.info(`[命令] 翻译命令被触发`)
      logger.info(`[命令] 原始输入: text=${text}`)
      
      if (!pluginConfig.enableTranslate) {
        return '❌ 翻译功能未启用'
      }

      if (!text) {
        return '❌ 请提供要翻译的文本和目标语言\n用法: /translate <文本内容> <目标语言>'
      }

      try {
        // 自动识别目标语言
        const targetLanguage = translateService.detectTargetLanguage(text)
        logger.info(`[命令] 自动识别的目标语言: ${targetLanguage}`)
        
        // 提取要翻译的内容
        const textToTranslate = translateService.extractTranslateText(text)
        logger.info(`[命令] 提取的翻译内容: ${textToTranslate}`)
        
        if (!textToTranslate) {
          return '❌ 请提供要翻译的文本'
        }

        logger.info(`[命令] 调用翻译服务...`)
        const result = await translateService.translate({
          text: textToTranslate,
          targetLanguage,
          sourceLanguage: options?.source
        })

        if (result.success) {
          logger.info(`[命令] 翻译成功`)
          return result.data
        } else {
          logger.error(`[命令] 翻译失败: ${result.error}`)
          return `❌ ${result.error}`
        }
      } catch (error) {
        logger.error(`[命令] 翻译异常: ${formatError(error)}`)
        return `❌ 翻译失败: ${formatError(error)}`
      }
    })

  // 注册语言列表命令
  ctx.command('languages', '查看支持的语言')
    .action(() => {
      return `🌍 支持的语言:\n${translateService.formatLanguagesList()}`
    })

}
