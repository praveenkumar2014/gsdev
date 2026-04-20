/**
 * Stable Diffusion API client
 * Provides integration with Stable Diffusion image generation
 */

export interface StableDiffusionRequest {
  prompt: string
  negative_prompt?: string
  width?: number
  height?: number
  steps?: number
  cfg_scale?: number
  seed?: number
}

export interface StableDiffusionResponse {
  images: Array<{
    base64: string
    seed: number
  }>
}

const STABLE_DIFFUSION_API_BASE = "https://api.stability.ai/v1"

/**
 * Call Stable Diffusion API to generate an image
 */
export async function callStableDiffusion(
  apiKey: string,
  prompt: string,
  options?: {
    negativePrompt?: string
    width?: number
    height?: number
    steps?: number
    cfgScale?: number
    seed?: number
  }
): Promise<{ base64: string; seed: number }> {
  const url = `${STABLE_DIFFUSION_API_BASE}/generation/stable-diffusion-xl-1024-v1-0/text-to-image`

  const request: StableDiffusionRequest = {
    prompt,
    negative_prompt: options?.negativePrompt,
    width: options?.width ?? 1024,
    height: options?.height ?? 1024,
    steps: options?.steps ?? 30,
    cfg_scale: options?.cfgScale ?? 7.0,
    seed: options?.seed,
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
    throw new Error(`Stable Diffusion API error: ${response.status} - ${error}`)
  }

  const data: StableDiffusionResponse = await response.json()

  if (!data.images || data.images.length === 0) {
    throw new Error("Stable Diffusion API returned no images")
  }

  const image = data.images[0]
  return {
    base64: image.base64,
    seed: image.seed,
  }
}
