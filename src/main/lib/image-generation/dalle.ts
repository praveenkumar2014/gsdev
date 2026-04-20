/**
 * DALL-E API client
 * Provides integration with OpenAI's DALL-E image generation
 */

export interface DalleRequest {
  prompt: string
  model: "dall-e-2" | "dall-e-3"
  size?: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792"
  quality?: "standard" | "hd"
  n?: number
}

export interface DalleResponse {
  created: number
  data: Array<{
    url: string
    revised_prompt?: string
  }>
}

const DALLE_API_BASE = "https://api.openai.com/v1"

/**
 * Call DALL-E API to generate an image
 */
export async function callDalle(
  apiKey: string,
  prompt: string,
  options?: {
    model?: "dall-e-2" | "dall-e-3"
    size?: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792"
    quality?: "standard" | "hd"
    n?: number
  }
): Promise<{ url: string; revisedPrompt?: string }> {
  const url = `${DALLE_API_BASE}/images/generations`

  const request: DalleRequest = {
    prompt,
    model: options?.model ?? "dall-e-3",
    size: options?.size ?? "1024x1024",
    quality: options?.quality ?? "standard",
    n: options?.n ?? 1,
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
    throw new Error(`DALL-E API error: ${response.status} - ${error}`)
  }

  const data: DalleResponse = await response.json()

  if (!data.data || data.data.length === 0) {
    throw new Error("DALL-E API returned no images")
  }

  const image = data.data[0]
  return {
    url: image.url,
    revisedPrompt: image.revised_prompt,
  }
}
