/**
 * Groq API client
 * Provides integration with Groq's fast inference for open-source models
 */

export interface GroqMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface GroqRequest {
  model: string
  messages: GroqMessage[]
  temperature?: number
  max_tokens?: number
  top_p?: number
  stream?: boolean
}

export interface GroqResponse {
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

const GROQ_API_BASE = "https://api.groq.com/openai/v1"

/**
 * Call Groq API
 */
export async function callGroq(
  apiKey: string,
  model: string,
  messages: GroqMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const url = `${GROQ_API_BASE}/chat/completions`

  const request: GroqRequest = {
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
    throw new Error(`Groq API error: ${response.status} - ${error}`)
  }

  const data: GroqResponse = await response.json()

  if (!data.choices || data.choices.length === 0) {
    throw new Error("Groq API returned no choices")
  }

  const choice = data.choices[0]
  return choice.message.content
}

/**
 * Convert chat messages to Groq format
 */
export function toGroqMessages(messages: Array<{ role: string; content: string }>): GroqMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }))
}

/**
 * Available Groq models (all open source)
 */
export const GROQ_MODELS = [
  {
    id: "llama-3.3-70b-versatile",
    name: "LLaMA 3.3 70B Versatile",
    description: "Meta's versatile 70B model on Groq",
    context: 128000,
    isOpenSource: true,
  },
  {
    id: "llama-3.1-70b-versatile",
    name: "LLaMA 3.1 70B Versatile",
    description: "Meta's 70B model on Groq",
    context: 128000,
    isOpenSource: true,
  },
  {
    id: "llama-3.1-8b-instant",
    name: "LLaMA 3.1 8B Instant",
    description: "Fast 8B model for quick responses",
    context: 131072,
    isOpenSource: true,
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    description: "Mistral's mixture of experts model",
    context: 32768,
    isOpenSource: true,
  },
  {
    id: "gemma2-9b-it",
    name: "Gemma 2 9B",
    description: "Google's efficient 9B model",
    context: 8192,
    isOpenSource: true,
  },
]
