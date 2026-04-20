/**
 * Meta AI (LLaMA) API client
 * Provides integration with Meta's LLaMA models via their API
 */

export interface MetaMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface MetaRequest {
  model: string
  messages: MetaMessage[]
  temperature?: number
  max_tokens?: number
  top_p?: number
  stream?: boolean
}

export interface MetaResponse {
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

const META_API_BASE = "https://api.meta.com/v1"

/**
 * Call Meta LLaMA API
 */
export async function callMeta(
  apiKey: string,
  model: string,
  messages: MetaMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const url = `${META_API_BASE}/chat/completions`

  const request: MetaRequest = {
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
    throw new Error(`Meta API error: ${response.status} - ${error}`)
  }

  const data: MetaResponse = await response.json()

  if (!data.choices || data.choices.length === 0) {
    throw new Error("Meta API returned no choices")
  }

  const choice = data.choices[0]
  return choice.message.content
}

/**
 * Convert chat messages to Meta format
 */
export function toMetaMessages(messages: Array<{ role: string; content: string }>): MetaMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }))
}

/**
 * Available Meta LLaMA models
 */
export const META_MODELS = [
  {
    id: "meta-llama-3.1-405b-instruct",
    name: "LLaMA 3.1 405B",
    description: "Meta's largest open-source model",
    context: 128000,
    isOpenSource: true,
  },
  {
    id: "meta-llama-3.1-70b-instruct",
    name: "LLaMA 3.1 70B",
    description: "High-performance open-source model",
    context: 128000,
    isOpenSource: true,
  },
  {
    id: "meta-llama-3.1-8b-instruct",
    name: "LLaMA 3.1 8B",
    description: "Efficient open-source model",
    context: 128000,
    isOpenSource: true,
  },
  {
    id: "meta-llama-3-70b-instruct",
    name: "LLaMA 3 70B",
    description: "Previous generation large model",
    context: 8192,
    isOpenSource: true,
  },
  {
    id: "meta-llama-3-8b-instruct",
    name: "LLaMA 3 8B",
    description: "Previous generation efficient model",
    context: 8192,
    isOpenSource: true,
  },
]
