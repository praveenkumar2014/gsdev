/**
 * Banana API client
 * Provides integration with Banana AI models
 */

export interface BananaMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface BananaRequest {
  model: string
  messages: BananaMessage[]
  temperature?: number
  max_tokens?: number
}

export interface BananaResponse {
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

const BANANA_API_BASE = "https://api.banana.dev/v1"

/**
 * Call Banana API
 */
export async function callBanana(
  apiKey: string,
  model: string,
  messages: BananaMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const url = `${BANANA_API_BASE}/chat/completions`

  const request: BananaRequest = {
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
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Banana API error: ${response.status} - ${error}`)
  }

  const data: BananaResponse = await response.json()

  if (!data.choices || data.choices.length === 0) {
    throw new Error("Banana API returned no choices")
  }

  const choice = data.choices[0]
  return choice.message.content
}

/**
 * Convert chat messages to Banana format
 */
export function toBananaMessages(messages: Array<{ role: string; content: string }>): BananaMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }))
}
