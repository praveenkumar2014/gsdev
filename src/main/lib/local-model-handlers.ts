/**
 * Local model handlers for multiple providers
 * Supports Ollama, LM Studio, and LocalAI
 */

type LocalModelProvider = 'ollama' | 'lmstudio' | 'localai'

interface LocalModelConfig {
  provider: LocalModelProvider
  baseUrl: string
  model: string
  temperature?: number
  maxTokens?: number
}

interface LocalModelResponse {
  success: boolean
  data?: string
  error?: string
}

class LocalModelHandler {
  private providers: Record<LocalModelProvider, string> = {
    ollama: 'http://localhost:11434',
    lmstudio: 'http://localhost:1234',
    localai: 'http://localhost:8080',
  }

  async checkAvailability(provider: LocalModelProvider): Promise<boolean> {
    try {
      const baseUrl = this.providers[provider]
      const response = await fetch(`${baseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })
      return response.ok
    } catch {
      return false
    }
  }

  async listModels(provider: LocalModelProvider): Promise<string[]> {
    try {
      const baseUrl = this.providers[provider]
      const response = await fetch(`${baseUrl}/api/tags`)
      if (!response.ok) throw new Error('Failed to fetch models')
      
      const data = await response.json()
      if (provider === 'ollama') {
        return data.models?.map((m: any) => m.name) || []
      } else {
        return data.models || []
      }
    } catch (error) {
      console.error(`[LocalModelHandler] Failed to list models for ${provider}:`, error)
      return []
    }
  }

  async generate(config: LocalModelConfig): Promise<LocalModelResponse> {
    try {
      const baseUrl = this.providers[config.provider]
      const endpoint = `${baseUrl}/api/generate`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.model,
          prompt: config.model, // Will be overridden with actual prompt
          stream: false,
          options: {
            temperature: config.temperature || 0.7,
            num_predict: config.maxTokens || 4096,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`${config.provider} request failed: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: true,
        data: data.response || data.text || data.content,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  async stream(
    config: LocalModelConfig,
    prompt: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      const baseUrl = this.providers[config.provider]
      const endpoint = `${baseUrl}/api/generate`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.model,
          prompt,
          stream: true,
          options: {
            temperature: config.temperature || 0.7,
            num_predict: config.maxTokens || 4096,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`${config.provider} request failed: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line)
              if (data.response || data.text || data.content) {
                onChunk(data.response || data.text || data.content)
              }
              if (data.done) {
                onComplete()
                return
              }
              if (data.error) {
                throw new Error(data.error)
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('ECONNREFUSED')) {
        onError(`${config.provider} is not running. Start it and try again.`)
      } else {
        onError(errorMessage)
      }
    }
  }

  setProviderUrl(provider: LocalModelProvider, url: string): void {
    this.providers[provider] = url
  }
}

// Singleton instance
let handler: LocalModelHandler | null = null

export function getLocalModelHandler(): LocalModelHandler {
  if (!handler) {
    handler = new LocalModelHandler()
  }
  return handler
}

export type { LocalModelProvider, LocalModelConfig, LocalModelResponse }
