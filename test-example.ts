/**
 * 千问插件测试示例
 * 
 * 这个文件展示了如何测试插件的各个功能
 * 注意：这不是自动化测试，而是手动测试指南
 */

import OpenAI from 'openai'

// 测试配置
const testConfig = {
  apiKey: process.env.DASHSCOPE_API_KEY || 'sk-test',
  model: 'qwen-plus',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  temperature: 0.7,
  maxTokens: 2000,
}

/**
 * 测试 1: 基础对话
 */
async function testBasicChat() {
  console.log('🧪 测试 1: 基础对话')
  console.log('---')

  const openai = new OpenAI({
    apiKey: testConfig.apiKey,
    baseURL: testConfig.baseURL,
  })

  try {
    const completion = await openai.chat.completions.create({
      model: testConfig.model,
      messages: [
        {
          role: 'system',
          content: '你是一个有帮助的助手。请用简洁清晰的方式回答问题。',
        },
        {
          role: 'user',
          content: '你是谁？',
        },
      ],
      temperature: testConfig.temperature,
      max_tokens: testConfig.maxTokens,
    })

    const response = completion.choices[0]?.message?.content
    console.log('✅ 成功')
    console.log('回复:', response)
    console.log()
  } catch (error) {
    console.log('❌ 失败')
    console.log('错误:', error)
    console.log()
  }
}

/**
 * 测试 2: 多轮对话
 */
async function testMultiTurnChat() {
  console.log('🧪 测试 2: 多轮对话')
  console.log('---')

  const openai = new OpenAI({
    apiKey: testConfig.apiKey,
    baseURL: testConfig.baseURL,
  })

  try {
    // 第一轮
    const response1 = await openai.chat.completions.create({
      model: testConfig.model,
      messages: [
        {
          role: 'system',
          content: '你是一个有帮助的助手。',
        },
        {
          role: 'user',
          content: '什么是 TypeScript？',
        },
      ],
    })

    console.log('第一轮回复:', response1.choices[0]?.message?.content)

    // 第二轮（基于第一轮的对话）
    const response2 = await openai.chat.completions.create({
      model: testConfig.model,
      messages: [
        {
          role: 'system',
          content: '你是一个有帮助的助手。',
        },
        {
          role: 'user',
          content: '什么是 TypeScript？',
        },
        {
          role: 'assistant',
          content: response1.choices[0]?.message?.content || '',
        },
        {
          role: 'user',
          content: '它有什么优点？',
        },
      ],
    })

    console.log('第二轮回复:', response2.choices[0]?.message?.content)
    console.log('✅ 成功')
    console.log()
  } catch (error) {
    console.log('❌ 失败')
    console.log('错误:', error)
    console.log()
  }
}

/**
 * 测试 3: 不同的温度设置
 */
async function testTemperature() {
  console.log('🧪 测试 3: 温度设置影响')
  console.log('---')

  const openai = new OpenAI({
    apiKey: testConfig.apiKey,
    baseURL: testConfig.baseURL,
  })

  const temperatures = [0, 0.7, 1.5]

  for (const temp of temperatures) {
    try {
      const completion = await openai.chat.completions.create({
        model: testConfig.model,
        messages: [
          {
            role: 'user',
            content: '用一句话描述春天',
          },
        ],
        temperature: temp,
        max_tokens: 100,
      })

      console.log(`温度 ${temp}:`, completion.choices[0]?.message?.content)
    } catch (error) {
      console.log(`温度 ${temp}: 失败`)
    }
  }

  console.log('✅ 完成')
  console.log()
}

/**
 * 测试 4: 错误处理
 */
async function testErrorHandling() {
  console.log('🧪 测试 4: 错误处理')
  console.log('---')

  // 测试无效的 API Key
  const openai = new OpenAI({
    apiKey: 'sk-invalid-key',
    baseURL: testConfig.baseURL,
  })

  try {
    await openai.chat.completions.create({
      model: testConfig.model,
      messages: [
        {
          role: 'user',
          content: '测试',
        },
      ],
    })
  } catch (error) {
    console.log('✅ 成功捕获错误')
    if (error instanceof Error) {
      console.log('错误类型:', error.message.substring(0, 50))
    }
  }

  console.log()
}

/**
 * 测试 5: 流式输出
 */
async function testStreaming() {
  console.log('🧪 测试 5: 流式输出')
  console.log('---')

  const openai = new OpenAI({
    apiKey: testConfig.apiKey,
    baseURL: testConfig.baseURL,
  })

  try {
    const completion = await openai.chat.completions.create({
      model: testConfig.model,
      messages: [
        {
          role: 'user',
          content: '用 3 句话介绍人工智能',
        },
      ],
      stream: true,
    })

    console.log('流式输出:')
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        process.stdout.write(content)
      }
    }
    console.log('\n✅ 完成')
    console.log()
  } catch (error) {
    console.log('❌ 失败')
    console.log('错误:', error)
    console.log()
  }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
  console.log('🚀 开始运行千问插件测试')
  console.log('=' * 50)
  console.log()

  // 检查 API Key
  if (!process.env.DASHSCOPE_API_KEY) {
    console.log('❌ 错误: 未设置 DASHSCOPE_API_KEY 环境变量')
    console.log('请先设置: export DASHSCOPE_API_KEY=sk-xxx')
    process.exit(1)
  }

  await testBasicChat()
  await testMultiTurnChat()
  await testTemperature()
  await testErrorHandling()
  await testStreaming()

  console.log('=' * 50)
  console.log('✅ 所有测试完成')
}

// 运行测试
runAllTests().catch(console.error)
