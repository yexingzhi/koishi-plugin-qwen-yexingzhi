/**
 * 表情包生成服务模块
 */

import axios from 'axios'
import { EmojiGeneratorParams, ApiResponse } from '../types'
import { logger, formatError, isUrl } from '../utils'

/**
 * 表情包风格
 */
export const EMOJI_STYLES = {
  'cute': '可爱风格',
  'funny': '搞笑风格',
  'cool': '酷炫风格',
  'sad': '伤感风格',
  'angry': '愤怒风格',
  'love': '爱心风格',
  'confused': '困惑风格',
  'excited': '兴奋风格',
  'sleepy': '困倦风格',
  'shocked': '震惊风格'
} as const

/**
 * 表情包类型
 */
export const EMOJI_TYPES = {
  'image': '静态表情包',
  'video': '动态表情包视频'
} as const

/**
 * 表情包模板 ID 映射
 */
const EMOJI_TEMPLATE_IDS: Record<string, string> = {
  'cute': 'cute_1',
  'funny': 'funny_1',
  'cool': 'cool_1',
  'sad': 'sad_1',
  'angry': 'angry_1',
  'love': 'love_1',
  'confused': 'confused_1',
  'excited': 'excited_1',
  'sleepy': 'sleepy_1',
  'shocked': 'shocked_1'
}

/**
 * 中文风格映射
 */
const CHINESE_STYLE_MAP: Record<string, string> = {
  '可爱': 'cute',
  '搞笑': 'funny',
  '酷炫': 'cool',
  '伤感': 'sad',
  '愤怒': 'angry',
  '爱心': 'love',
  '困惑': 'confused',
  '兴奋': 'excited',
  '困倦': 'sleepy',
  '震惊': 'shocked'
}

/**
 * 表情包生成服务
 */
export class EmojiGeneratorService {
  private apiKey: string
  private detectUrl: string = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/image2video/face-detect'
  private generateUrl: string = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/image2video/video-synthesis'
  private queryUrl: string = 'https://dashscope.aliyuncs.com/api/v1/tasks'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * 从中文描述识别表情包风格
   */
  detectStyleFromChinese(text: string): string {
    // 检查中文风格关键词
    for (const [chinese, style] of Object.entries(CHINESE_STYLE_MAP)) {
      if (text.includes(chinese)) {
        return style
      }
    }
    
    // 默认返回可爱风格
    return 'cute'
  }

  /**
   * 生成表情包
   */
  async generateEmoji(params: EmojiGeneratorParams): Promise<ApiResponse<string>> {
    try {
      if (!params.imageUrl || !isUrl(params.imageUrl)) {
        return {
          success: false,
          error: '请提供有效的图片 URL'
        }
      }

      const style = (params.style || 'cute') as keyof typeof EMOJI_STYLES
      if (!EMOJI_STYLES[style]) {
        return {
          success: false,
          error: `不支持的风格: ${style}`
        }
      }

      logger.info(`生成表情包: ${style}`)

      // 步骤1：检测人脸
      const detectResponse = await axios.post(this.detectUrl, {
        model: 'emoji-detect-v1',
        input: {
          image_url: params.imageUrl
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      const faceInfo = detectResponse.data?.output
      if (!faceInfo || faceInfo.status !== 'success') {
        return {
          success: false,
          error: '人脸检测失败，请确保图片中包含清晰的人脸'
        }
      }

      logger.info(`人脸检测成功`)

      // 步骤2：生成表情包视频（静态表情包通过视频生成实现）
      const templateId = EMOJI_TEMPLATE_IDS[style]
      const createResponse = await axios.post(this.generateUrl, {
        model: 'emoji-v1',
        input: {
          image_url: params.imageUrl,
          template_id: templateId
        },
        parameters: {
          duration: 3
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      const taskId = createResponse.data?.output?.task_id
      if (!taskId) {
        return {
          success: false,
          error: '创建表情包生成任务失败'
        }
      }

      logger.info(`表情包任务已创建: ${taskId}`)

      // 步骤3：轮询查询结果
      let emojiUrl = ''
      let attempts = 0
      const maxAttempts = 24 // 120秒 / 5秒

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)) // 等待 5 秒

        const queryResponse = await axios.get(`${this.queryUrl}/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        })

        const status = queryResponse.data?.output?.status
        if (status === 'SUCCEEDED') {
          emojiUrl = queryResponse.data?.output?.results?.[0]?.url
          break
        } else if (status === 'FAILED') {
          return {
            success: false,
            error: '表情包生成失败'
          }
        }

        attempts++
      }

      if (!emojiUrl) {
        return {
          success: false,
          error: '表情包生成超时'
        }
      }

      logger.info(`表情包生成成功: ${emojiUrl}`)

      return {
        success: true,
        data: emojiUrl,
        message: `${EMOJI_STYLES[style]}表情包生成成功`
      }
    } catch (error: any) {
      logger.error('表情包生成失败', error)
      
      // 处理 API 错误响应
      if (error.response?.data) {
        const errorData = error.response.data
        const errorCode = errorData.code
        const errorMessage = errorData.message
        
        logger.error(`[表情包] API 错误代码: ${errorCode}`)
        logger.error(`[表情包] API 错误信息: ${errorMessage}`)
        
        // 根据错误代码返回友好的错误信息
        if (errorCode === 'InvalidParameter.DataInspection') {
          return {
            success: false,
            error: '❌ 图片格式不支持或无法识别，请确保上传的是有效的图片 URL'
          }
        } else if (errorCode === 'InvalidFile.NoHuman') {
          return {
            success: false,
            error: '❌ 图片中未检测到人脸，请上传包含清晰人脸的图片'
          }
        } else if (errorCode === 'InvalidFile.FaceNotMatch') {
          return {
            success: false,
            error: '❌ 人脸检测失败，请确保图片中包含清晰的人脸'
          }
        } else if (errorCode === '401-InvalidApiKey') {
          return {
            success: false,
            error: '❌ API Key 无效或已过期'
          }
        } else if (errorCode === '429-Throttling') {
          return {
            success: false,
            error: '❌ 请求过于频繁，请稍后再试'
          }
        } else if (errorCode === '500-InternalError') {
          return {
            success: false,
            error: '❌ 服务器内部错误，请稍后重试'
          }
        }
        
        return {
          success: false,
          error: `❌ API 错误 [${errorCode}]: ${errorMessage}`
        }
      }
      
      if (error.response?.status === 400) {
        return {
          success: false,
          error: '❌ 请求参数错误，请检查图片 URL 是否有效'
        }
      } else if (error.response?.status === 401) {
        return {
          success: false,
          error: '❌ API Key 无效或已过期'
        }
      } else if (error.response?.status === 429) {
        return {
          success: false,
          error: '❌ 请求过于频繁，请稍后再试'
        }
      } else if (error.response?.status === 500) {
        return {
          success: false,
          error: '❌ 服务器错误，请稍后重试'
        }
      }
      
      return {
        success: false,
        error: `❌ 表情包生成失败: ${formatError(error)}`
      }
    }
  }

  /**
   * 生成表情包视频
   */
  async generateEmojiVideo(params: EmojiGeneratorParams): Promise<ApiResponse<string>> {
    try {
      if (!params.imageUrl || !isUrl(params.imageUrl)) {
        return {
          success: false,
          error: '请提供有效的图片 URL'
        }
      }

      const style = (params.style || 'cute') as keyof typeof EMOJI_STYLES
      if (!EMOJI_STYLES[style]) {
        return {
          success: false,
          error: `不支持的风格: ${style}`
        }
      }

      logger.info(`生成表情包视频: ${style}`)

      // 步骤1：检测人脸
      const detectResponse = await axios.post(this.detectUrl, {
        model: 'emoji-detect-v1',
        input: {
          image_url: params.imageUrl
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      const faceInfo = detectResponse.data?.output
      if (!faceInfo || faceInfo.status !== 'success') {
        return {
          success: false,
          error: '人脸检测失败，请确保图片中包含清晰的人脸'
        }
      }

      logger.info(`人脸检测成功`)

      // 步骤2：生成表情包视频
      const templateId = EMOJI_TEMPLATE_IDS[style]
      const createResponse = await axios.post(this.generateUrl, {
        model: 'emoji-v1',
        input: {
          image_url: params.imageUrl,
          template_id: templateId
        },
        parameters: {
          duration: 5
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      const taskId = createResponse.data?.output?.task_id
      if (!taskId) {
        return {
          success: false,
          error: '创建表情包视频生成任务失败'
        }
      }

      logger.info(`表情包视频任务已创建: ${taskId}`)

      // 步骤3：轮询查询结果
      let videoUrl = ''
      let attempts = 0
      const maxAttempts = 24 // 120秒 / 5秒

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)) // 等待 5 秒

        const queryResponse = await axios.get(`${this.queryUrl}/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        })

        const status = queryResponse.data?.output?.status
        if (status === 'SUCCEEDED') {
          videoUrl = queryResponse.data?.output?.results?.[0]?.url
          break
        } else if (status === 'FAILED') {
          return {
            success: false,
            error: '表情包视频生成失败'
          }
        }

        attempts++
      }

      if (!videoUrl) {
        return {
          success: false,
          error: '表情包视频生成超时'
        }
      }

      logger.info(`表情包视频生成成功: ${videoUrl}`)

      return {
        success: true,
        data: videoUrl,
        message: `${EMOJI_STYLES[style]}表情包视频生成成功`
      }
    } catch (error: any) {
      logger.error('表情包视频生成失败', error)
      
      // 处理 API 错误响应
      if (error.response?.data) {
        const errorData = error.response.data
        const errorCode = errorData.code
        const errorMessage = errorData.message
        
        logger.error(`[表情包视频] API 错误代码: ${errorCode}`)
        logger.error(`[表情包视频] API 错误信息: ${errorMessage}`)
        
        // 根据错误代码返回友好的错误信息
        if (errorCode === 'InvalidParameter.DataInspection') {
          return {
            success: false,
            error: '❌ 图片格式不支持或无法识别，请确保上传的是有效的图片 URL'
          }
        } else if (errorCode === 'InvalidFile.NoHuman') {
          return {
            success: false,
            error: '❌ 图片中未检测到人脸，请上传包含清晰人脸的图片'
          }
        } else if (errorCode === 'InvalidFile.FaceNotMatch') {
          return {
            success: false,
            error: '❌ 人脸检测失败，请确保图片中包含清晰的人脸'
          }
        } else if (errorCode === '401-InvalidApiKey') {
          return {
            success: false,
            error: '❌ API Key 无效或已过期'
          }
        } else if (errorCode === '429-Throttling') {
          return {
            success: false,
            error: '❌ 请求过于频繁，请稍后再试'
          }
        } else if (errorCode === '500-InternalError') {
          return {
            success: false,
            error: '❌ 服务器内部错误，请稍后重试'
          }
        }
        
        return {
          success: false,
          error: `❌ API 错误 [${errorCode}]: ${errorMessage}`
        }
      }
      
      if (error.response?.status === 400) {
        return {
          success: false,
          error: '❌ 请求参数错误，请检查图片 URL 是否有效'
        }
      } else if (error.response?.status === 401) {
        return {
          success: false,
          error: '❌ API Key 无效或已过期'
        }
      } else if (error.response?.status === 429) {
        return {
          success: false,
          error: '❌ 请求过于频繁，请稍后再试'
        }
      } else if (error.response?.status === 500) {
        return {
          success: false,
          error: '❌ 服务器错误，请稍后重试'
        }
      }
      
      return {
        success: false,
        error: `❌ 表情包视频生成失败: ${formatError(error)}`
      }
    }
  }

  /**
   * 获取支持的风格
   */
  getSupportedStyles(): Record<string, string> {
    return EMOJI_STYLES
  }

  /**
   * 获取支持的类型
   */
  getSupportedTypes(): Record<string, string> {
    return EMOJI_TYPES
  }

  /**
   * 格式化风格列表
   */
  formatStylesList(): string {
    return Object.entries(EMOJI_STYLES)
      .map(([key, value]) => `  • ${key} - ${value}`)
      .join('\n')
  }

  /**
   * 格式化类型列表
   */
  formatTypesList(): string {
    return Object.entries(EMOJI_TYPES)
      .map(([key, value]) => `  • ${key} - ${value}`)
      .join('\n')
  }
}