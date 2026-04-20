/**
 * Together AI API client
 * Provides integration with Together AI's open-source model platform
 */

export interface TogetherMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface TogetherRequest {
  model: string
  messages: TogetherMessage[]
  temperature?: number
  max_tokens?: number
  top_p?: number
  top_k?: number
  repetition_penalty?: number
  stream?: boolean
}

export interface TogetherResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
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

const TOGETHER_API_BASE = "https://api.together.xyz/v1"

/**
 * Call Together AI API
 */
export async function callTogether(
  apiKey: string,
  model: string,
  messages: TogetherMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const url = `${TOGETHER_API_BASE}/chat/completions`

  const request: TogetherRequest = {
    model,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4096,
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://gsdev.dev",
      "X-Title": "GSDEV Desktop",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Together API error: ${response.status} - ${error}`)
  }

  const data: TogetherResponse = await response.json()

  if (!data.choices || data.choices.length === 0) {
    throw new Error("Together API returned no choices")
  }

  const choice = data.choices[0]
  return choice.message.content
}

/**
 * Convert chat messages to Together format
 */
export function toTogetherMessages(messages: Array<{ role: string; content: string }>): TogetherMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }))
}

/**
 * Available Together AI models (all open source)
 */
export const TOGETHER_MODELS = [
  {
    id: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    name: "LLaMA 3.3 70B Turbo",
    description: "Meta's fastest 70B model",
    context: 128000,
    isOpenSource: true,
  },
  {
    id: "meta-llama/Llama-3.1-70B-Instruct-Turbo",
    name: "LLaMA 3.1 70B Turbo",
    description: "Meta's fast 70B model",
    context: 128000,
    isOpenSource: true,
  },
  {
    id: "meta-llama/Llama-3.1-8B-Instruct-Turbo",
    name: "LLaMA 3.1 8B Turbo",
    description: "Meta's fast 8B model",
    context: 128000,
    isOpenSource: true,
  },
  {
    id: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    name: "Mixtral 8x7B",
    description: "Mistral's mixture of experts",
    context: 32768,
    isOpenSource: true,
  },
  {
    id: "Qwen/Qwen2.5-72B-Instruct-Turbo",
    name: "Qwen 2.5 72B",
    description: "Alibaba's powerful 72B model",
    context: 131072,
    isOpenSource: true,
  },
  {
    id: "deepseek-ai/DeepSeek-V3",
    name: "DeepSeek V3",
    description: "DeepSeek's latest reasoning model",
    context: 64000,
    isOpenSource: true,
  },
]
