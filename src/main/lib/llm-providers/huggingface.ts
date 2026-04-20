/**
 * Hugging Face Inference API client
 * Provides integration with Hugging Face's model inference platform
 */

export interface HuggingFaceMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface HuggingFaceRequest {
  model: string
  messages: HuggingFaceMessage[]
  temperature?: number
  max_tokens?: number
  top_p?: number
  stream?: boolean
}

export interface HuggingFaceResponse {
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

const HF_API_BASE = "https://api-inference.huggingface.co/v1"

/**
 * Call Hugging Face Inference API
 */
export async function callHuggingFace(
  apiKey: string,
  model: string,
  messages: HuggingFaceMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const url = `${HF_API_BASE}/chat/completions`

  const request: HuggingFaceRequest = {
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
    throw new Error(`Hugging Face API error: ${response.status} - ${error}`)
  }

  const data: HuggingFaceResponse = await response.json()

  if (!data.choices || data.choices.length === 0) {
    throw new Error("Hugging Face API returned no choices")
  }

  const choice = data.choices[0]
  return choice.message.content
}

/**
 * Convert chat messages to Hugging Face format
 */
export function toHuggingFaceMessages(messages: Array<{ role: string; content: string }>): HuggingFaceMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }))
}

/**
 * Popular Hugging Face models (all open source)
 */
export const HUGGINGFACE_MODELS = [
  {
    id: "meta-llama/Llama-3.3-70B-Instruct",
    name: "LLaMA 3.3 70B",
    description: "Meta's latest 70B model",
    context: 128000,
    isOpenSource: true,
  },
  {
    id: "meta-llama/Llama-3.1-70B-Instruct",
    name: "LLaMA 3.1 70B",
    description: "Meta's 70B model",
    context: 128000,
    isOpenSource: true,
  },
  {
    id: "mistralai/Mistral-7B-Instruct-v0.3",
    name: "Mistral 7B",
    description: "Mistral's efficient 7B model",
    context: 32768,
    isOpenSource: true,
  },
  {
    id: "Qwen/Qwen2.5-72B-Instruct",
    name: "Qwen 2.5 72B",
    description: "Alibaba's 72B model",
    context: 131072,
    isOpenSource: true,
  },
  {
    id: "google/gemma-2-27b-it",
    name: "Gemma 2 27B",
    description: "Google's 27B model",
    context: 8192,
    isOpenSource: true,
  },
]
