/**
 * DeepSeek LLM Provider
 * Integration with DeepSeek AI models
 */

export interface DeepSeekMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface DeepSeekRequest {
  model: string
  messages: DeepSeekMessage[]
  temperature?: number
  max_tokens?: number
}

export interface DeepSeekResponse {
  id: string
  object: "chat.completion"
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: "assistant"
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

const DEEPSEEK_API_BASE = "https://api.deepseek.com/v1"

/**
 * Call DeepSeek API
 */
export async function callDeepSeekAPI(
  apiKey: string,
  request: DeepSeekRequest
): Promise<DeepSeekResponse> {
  const response = await fetch(`${DEEPSEEK_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature || 0.7,
      max_tokens: request.max_tokens || 4096,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`)
  }

  return response.json()
}

/**
 * Convert chat messages to DeepSeek format
 */
export function convertToDeepSeekMessages(
  messages: Array<{ role: string; content: string }>
): DeepSeekMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }))
}

/**
 * Available DeepSeek models
 */
export const DEEPSEEK_MODELS = [
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    description: "DeepSeek's chat model",
    context: 128000,
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek Coder",
    description: "DeepSeek's coding model",
    context: 128000,
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    description: "DeepSeek's latest model",
    context: 64000,
  },
]
