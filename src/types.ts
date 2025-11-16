/**
 * 千问插件类型定义
 */

/**
 * 模型配置
 */
export interface ModelConfig {
  name: string
  model: string
  baseURL: string
  apiKey: string
  temperature?: number
  maxTokens?: number
  description?: string
}

/**
 * 插件配置
 */
export interface PluginConfig {
  // 默认模型
  defaultModel: string
  
  // 模型列表
  models: ModelConfig[]
  
  // 全局设置
  temperature: number
  maxTokens: number
  
  // 功能开关
  enableTextToImage: boolean
  enableImageEdit: boolean
  enableTextToVideo: boolean
  enableTranslate: boolean
}

/**
 * 命令执行上下文
 */
export interface CommandContext {
  session: any
  config: PluginConfig
  currentModel: ModelConfig
}

/**
 * API 响应
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * 文生图参数
 */
export interface TextToImageParams {
  prompt: string
  size?: string
  style?: string
  quality?: string
}

/**
 * 图片编辑参数
 */
export interface ImageEditParams {
  imageUrl: string
  action: 'fix' | 'extend' | 'inpaint' | 'enhance' | 'style-transfer'
  prompt?: string
}

/**
 * 文生视频参数
 */
export interface TextToVideoParams {
  prompt: string
  duration?: number
  quality?: string
  size?: string
  negativePrompt?: string
}

/**
 * 翻译参数
 */
export interface TranslateParams {
  text: string
  targetLanguage: string
  sourceLanguage?: string
}

/**
 * 表情包参数
 */
export interface EmojiGeneratorParams {
  imageUrl: string
  style?: string
  type: 'image' | 'video'
}
