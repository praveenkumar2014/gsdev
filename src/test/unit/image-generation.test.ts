/**
 * Unit tests for image generation API clients
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { callDalle } from '../../main/lib/image-generation/dalle'
import { callStableDiffusion } from '../../main/lib/image-generation/stable-diffusion'

// Mock fetch globally
global.fetch = vi.fn()

describe('DALL-E API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call DALL-E API successfully', async () => {
    const mockResponse = {
      created: 123456,
      data: [{
        url: 'https://example.com/image.png',
        revised_prompt: 'Enhanced prompt',
      }],
    }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await callDalle('test-key', 'A beautiful sunset', {
      model: 'dall-e-3',
      size: '1024x1024',
    })
    expect(result.url).toBe('https://example.com/image.png')
    expect(result.revisedPrompt).toBe('Enhanced prompt')
  })

  it('should handle DALL-E API errors', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      text: async () => 'API Error',
    })

    await expect(
      callDalle('test-key', 'A beautiful sunset')
    ).rejects.toThrow('DALL-E API error')
  })

  it('should handle no images returned', async () => {
    const mockResponse = {
      created: 123456,
      data: [],
    }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    await expect(
      callDalle('test-key', 'A beautiful sunset')
    ).rejects.toThrow('DALL-E API returned no images')
  })
})

describe('Stable Diffusion API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call Stable Diffusion API successfully', async () => {
    const mockResponse = {
      images: [{
        base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        seed: 12345,
      }],
    }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await callStableDiffusion('test-key', 'A beautiful sunset', {
      width: 1024,
      height: 1024,
    })
    expect(result.base64).toBeTruthy()
    expect(result.seed).toBe(12345)
  })

  it('should handle Stable Diffusion API errors', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      text: async () => 'API Error',
    })

    await expect(
      callStableDiffusion('test-key', 'A beautiful sunset')
    ).rejects.toThrow('Stable Diffusion API error')
  })

  it('should handle no images returned', async () => {
    const mockResponse = {
      images: [],
    }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    await expect(
      callStableDiffusion('test-key', 'A beautiful sunset')
    ).rejects.toThrow('Stable Diffusion API returned no images')
  })
})
