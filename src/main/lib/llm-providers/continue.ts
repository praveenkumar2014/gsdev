/**
 * Continue LLM Provider
 * Integration with Continue AI models
 */

export interface ContinueMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface ContinueRequest {
  model: string
  messages: ContinueMessage[]
  temperature?: number
  max_tokens?: number
}

export interface ContinueResponse {
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

const CONTINUE_API_BASE = "https://api.continue.dev/v1"

/**
 * Call Continue API
 */
export async function callContinueAPI(
  apiKey: string,
  request: ContinueRequest
): Promise<ContinueResponse> {
  const response = await fetch(`${CONTINUE_API_BASE}/chat/completions`, {
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
    throw new Error(`Continue API error: ${response.status} - ${error}`)
  }

  return response.json()
}

/**
 * Convert chat messages to Continue format
 */
export function convertToContinueMessages(
  messages: Array<{ role: string; content: string }>
): ContinueMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }))
}

/**
 * Available Continue models
 */
export const CONTINUE_MODELS = [
  {
    id: "continue-codellama",
    name: "Continue CodeLlama",
    description: "Code-optimized Llama model",
    context: 16384,
  },
  {
    id: "continue-mistral",
    name: "Continue Mistral",
    description: "Mistral-based model",
    context: 32768,
  },
  {
    id: "continue-qwen",
    name: "Continue Qwen",
    description: "Qwen-based model",
    context: 32768,
  },
]
