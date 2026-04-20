/**
 * OpenRouter API client
 * Provides integration with OpenRouter's unified API for multiple LLM providers
 */

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface OpenRouterRequest {
  model: string
  messages: OpenRouterMessage[]
  temperature?: number
  max_tokens?: number
  top_p?: number
  stream?: boolean
}

export interface OpenRouterResponse {
  id: string
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

const OPENROUTER_API_BASE = "https://openrouter.ai/api/v1"

/**
 * Call OpenRouter API
 */
export async function callOpenRouter(
  apiKey: string,
  model: string,
  messages: OpenRouterMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const url = `${OPENROUTER_API_BASE}/chat/completions`

  const request: OpenRouterRequest = {
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
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
  }

  const data: OpenRouterResponse = await response.json()

  if (!data.choices || data.choices.length === 0) {
    throw new Error("OpenRouter API returned no choices")
  }

  const choice = data.choices[0]
  return choice.message.content
}

/**
 * Convert chat messages to OpenRouter format
 */
export function toOpenRouterMessages(messages: Array<{ role: string; content: string }>): OpenRouterMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "system" | "user" | "assistant",
    content: msg.content,
  }))
}
