/**
 * Unit tests for LLM provider API clients
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { callGemini, toGeminiMessages } from '../../main/lib/llm-providers/gemini'
import { callOpenRouter, toOpenRouterMessages } from '../../main/lib/llm-providers/openrouter'
import { callNano, toNanoMessages } from '../../main/lib/llm-providers/nano'
import { callBanana, toBananaMessages } from '../../main/lib/llm-providers/banana'
import { callOpenCode, toOpenCodeMessages } from '../../main/lib/llm-providers/opencode'

// Mock fetch globally
global.fetch = vi.fn()

describe('Gemini API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should convert messages to Gemini format', () => {
    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there' },
    ]
    const result = toGeminiMessages(messages)
    expect(result).toEqual([
      { role: 'user', parts: [{ text: 'Hello' }] },
      { role: 'model', parts: [{ text: 'Hi there' }] },
    ])
  })

  it('should call Gemini API successfully', async () => {
    const mockResponse = {
      candidates: [{
        content: { parts: [{ text: 'Test response' }], role: 'model' },
        finishReason: 'STOP',
        index: 0,
      }],
      usageMetadata: {
        promptTokenCount: 10,
        candidatesTokenCount: 5,
        totalTokenCount: 15,
      },
    }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await callGemini('test-key', 'gemini-pro', [
      { role: 'user', parts: [{ text: 'Hello' }] },
    ])
    expect(result).toBe('Test response')
  })

  it('should handle Gemini API errors', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      text: async () => 'API Error',
    })

    await expect(
      callGemini('test-key', 'gemini-pro', [{ role: 'user', parts: [{ text: 'Hello' }] }])
    ).rejects.toThrow('Gemini API error')
  })
})

describe('OpenRouter API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should convert messages to OpenRouter format', () => {
    const messages = [
      { role: 'system', content: 'You are helpful' },
      { role: 'user', content: 'Hello' },
    ]
    const result = toOpenRouterMessages(messages)
    expect(result).toEqual(messages)
  })

  it('should call OpenRouter API successfully', async () => {
    const mockResponse = {
      id: 'test-id',
      model: 'test-model',
      choices: [{
        index: 0,
        message: { role: 'assistant', content: 'Test response' },
        finish_reason: 'stop',
      }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
      },
    }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await callOpenRouter('test-key', 'test-model', [
      { role: 'user', content: 'Hello' },
    ])
    expect(result).toBe('Test response')
  })

  it('should handle OpenRouter API errors', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      text: async () => 'API Error',
    })

    await expect(
      callOpenRouter('test-key', 'test-model', [{ role: 'user', content: 'Hello' }])
    ).rejects.toThrow('OpenRouter API error')
  })
})

describe('Nano API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should convert messages to Nano format', () => {
    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi' },
    ]
    const result = toNanoMessages(messages)
    expect(result).toEqual(messages)
  })

  it('should call Nano API successfully', async () => {
    const mockResponse = {
      id: 'test-id',
      object: 'chat.completion',
      created: 123456,
      model: 'nano-1b',
      choices: [{
        index: 0,
        message: { role: 'assistant', content: 'Test response' },
        finish_reason: 'stop',
      }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
      },
    }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await callNano('test-key', 'nano-1b', [
      { role: 'user', content: 'Hello' },
    ])
    expect(result).toBe('Test response')
  })
})

describe('Banana API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should convert messages to Banana format', () => {
    const messages = [
      { role: 'user', content: 'Hello' },
    ]
    const result = toBananaMessages(messages)
    expect(result).toEqual(messages)
  })

  it('should call Banana API successfully', async () => {
    const mockResponse = {
      id: 'test-id',
      object: 'chat.completion',
      created: 123456,
      model: 'banana-small',
      choices: [{
        index: 0,
        message: { role: 'assistant', content: 'Test response' },
        finish_reason: 'stop',
      }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
      },
    }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await callBanana('test-key', 'banana-small', [
      { role: 'user', content: 'Hello' },
    ])
    expect(result).toBe('Test response')
  })
})

describe('OpenCode API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should convert messages to OpenCode format', () => {
    const messages = [
      { role: 'user', content: 'Write code' },
    ]
    const result = toOpenCodeMessages(messages)
    expect(result).toEqual(messages)
  })

  it('should call OpenCode API successfully', async () => {
    const mockResponse = {
      id: 'test-id',
      object: 'chat.completion',
      created: 123456,
      model: 'opencode-codex',
      choices: [{
        index: 0,
        message: { role: 'assistant', content: 'function test() {}' },
        finish_reason: 'stop',
      }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
      },
    }
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await callOpenCode('test-key', 'opencode-codex', [
      { role: 'user', content: 'Write code' },
    ])
    expect(result).toBe('function test() {}')
  })
})
