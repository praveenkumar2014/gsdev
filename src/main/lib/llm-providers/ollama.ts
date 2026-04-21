/**
 * Ollama LLM Provider
 * Integration with local Ollama models
 * https://ollama.ai/
 */

export interface OllamaMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface OllamaRequest {
  model: string
  messages: OllamaMessage[]
  stream?: boolean
  options?: {
    temperature?: number
    num_predict?: number
    top_k?: number
    top_p?: number
  }
}

export interface OllamaResponse {
  model: string
  created_at: string
  message: {
    role: "assistant"
    content: string
  }
  done: boolean
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

const OLLAMA_DEFAULT_BASE = "http://localhost:11434"

/**
 * Call Ollama API
 */
export async function callOllamaAPI(
  request: OllamaRequest,
  baseUrl: string = OLLAMA_DEFAULT_BASE
): Promise<OllamaResponse> {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages,
      stream: request.stream || false,
      options: request.options,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Ollama API error: ${response.status} - ${error}`)
  }

  return response.json()
}

/**
 * List available Ollama models
 */
export async function listOllamaModels(
  baseUrl: string = OLLAMA_DEFAULT_BASE
): Promise<{ name: string; modified_at: string; size: number }[]> {
  const response = await fetch(`${baseUrl}/api/tags`, {
    method: "GET",
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Ollama API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.models || []
}

/**
 * Check if Ollama is running
 */
export async function checkOllamaHealth(
  baseUrl: string = OLLAMA_DEFAULT_BASE
): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      method: "GET",
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Convert chat messages to Ollama format
 */
export function convertToOllamaMessages(
  messages: Array<{ role: string; content: string }>
): OllamaMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }))
}

/**
 * Available Ollama models
 */
export const OLLAMA_AVAILABLE_MODELS = [
  {
    id: "llama3.3",
    name: "LLaMA 3.3 70B",
    description: "Meta's latest LLaMA model",
    context: 128000,
  },
  {
    id: "llama3.1",
    name: "LLaMA 3.1 70B",
    description: "Meta's LLaMA 3.1 model",
    context: 128000,
  },
  {
    id: "llama3.1:8b",
    name: "LLaMA 3.1 8B",
    description: "Meta's LLaMA 3.1 8B model",
    context: 128000,
  },
  {
    id: "mistral",
    name: "Mistral 7B",
    description: "Mistral AI's 7B model",
    context: 32768,
  },
  {
    id: "qwen2.5",
    name: "Qwen 2.5 72B",
    description: "Alibaba's Qwen 2.5 model",
    context: 131072,
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek Coder",
    description: "DeepSeek's coding model",
    context: 16384,
  },
]
