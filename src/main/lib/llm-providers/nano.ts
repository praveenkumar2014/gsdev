/**
 * Nano API client
 * Provides integration with Nano AI models
 */

export interface NanoMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface NanoRequest {
  model: string
  messages: NanoMessage[]
  temperature?: number
  max_tokens?: number
}

export interface NanoResponse {
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

const NANO_API_BASE = "https://api.nano.ai/v1"

/**
 * Call Nano API
 */
export async function callNano(
  apiKey: string,
  model: string,
  messages: NanoMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const url = `${NANO_API_BASE}/chat/completions`

  const request: NanoRequest = {
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
    throw new Error(`Nano API error: ${response.status} - ${error}`)
  }

  const data: NanoResponse = await response.json()

  if (!data.choices || data.choices.length === 0) {
    throw new Error("Nano API returned no choices")
  }

  const choice = data.choices[0]
  return choice.message.content
}

/**
 * Convert chat messages to Nano format
 */
export function toNanoMessages(messages: Array<{ role: string; content: string }>): NanoMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }))
}
