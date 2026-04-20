/**
 * OpenCode API client
 * Provides integration with OpenCode AI models for coding tasks
 */

export interface OpenCodeMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface OpenCodeRequest {
  model: string
  messages: OpenCodeMessage[]
  temperature?: number
  max_tokens?: number
}

export interface OpenCodeResponse {
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

const OPENCODE_API_BASE = "https://api.opencode.ai/v1"

/**
 * Call OpenCode API
 */
export async function callOpenCode(
  apiKey: string,
  model: string,
  messages: OpenCodeMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const url = `${OPENCODE_API_BASE}/chat/completions`

  const request: OpenCodeRequest = {
    model,
    messages,
    temperature: options?.temperature ?? 0.2, // Lower temperature for coding
    max_tokens: options?.maxTokens ?? 8192,
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
    throw new Error(`OpenCode API error: ${response.status} - ${error}`)
  }

  const data: OpenCodeResponse = await response.json()

  if (!data.choices || data.choices.length === 0) {
    throw new Error("OpenCode API returned no choices")
  }

  const choice = data.choices[0]
  return choice.message.content
}

/**
 * Convert chat messages to OpenCode format
 */
export function toOpenCodeMessages(messages: Array<{ role: string; content: string }>): OpenCodeMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }))
}
