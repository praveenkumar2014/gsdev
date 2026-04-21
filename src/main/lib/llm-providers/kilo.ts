/**
 * Kilo LLM Provider
 * Integration with Kilo AI models
 */

export interface KiloMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface KiloRequest {
  model: string
  messages: KiloMessage[]
  temperature?: number
  max_tokens?: number
}

export interface KiloResponse {
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

const KILO_API_BASE = "https://api.kilo.ai/v1"

/**
 * Call Kilo API
 */
export async function callKiloAPI(
  apiKey: string,
  request: KiloRequest
): Promise<KiloResponse> {
  const response = await fetch(`${KILO_API_BASE}/chat/completions`, {
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
    throw new Error(`Kilo API error: ${response.status} - ${error}`)
  }

  return response.json()
}

/**
 * Convert chat messages to Kilo format
 */
export function convertToKiloMessages(
  messages: Array<{ role: string; content: string }>
): KiloMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }))
}

/**
 * Available Kilo models
 */
export const KILO_MODELS = [
  {
    id: "kilo-7b",
    name: "Kilo 7B",
    description: "Kilo's 7B parameter model",
    context: 8192,
  },
  {
    id: "kilo-13b",
    name: "Kilo 13B",
    description: "Kilo's 13B parameter model",
    context: 16384,
  },
  {
    id: "kilo-34b",
    name: "Kilo 34B",
    description: "Kilo's 34B parameter model",
    context: 32768,
  },
]
