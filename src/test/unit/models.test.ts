/**
 * Unit tests for LLM models
 */

import { describe, it, expect } from 'vitest'
import {
  CLAUDE_MODELS,
  CODEX_MODELS,
  GEMINI_MODELS,
  OPENROUTER_MODELS,
  NANO_MODELS,
  BANANA_MODELS,
  OPENCODE_MODELS,
  ALL_MODELS,
  type ModelProvider,
} from '../../renderer/features/agents/lib/models'

describe('LLM Models', () => {
  it('should have Claude models', () => {
    expect(CLAUDE_MODELS).toHaveLength(3)
    expect(CLAUDE_MODELS[0].id).toBe('opus')
    expect(CLAUDE_MODELS[1].id).toBe('sonnet')
    expect(CLAUDE_MODELS[2].id).toBe('haiku')
  })

  it('should have Codex models', () => {
    expect(CODEX_MODELS).toHaveLength(4)
    expect(CODEX_MODELS[0].id).toBe('gpt-5.3-codex')
  })

  it('should have Gemini models', () => {
    expect(GEMINI_MODELS).toHaveLength(4)
    expect(GEMINI_MODELS[0].id).toBe('gemini-2.5-pro')
  })

  it('should have OpenRouter models', () => {
    expect(OPENROUTER_MODELS).toHaveLength(4)
    expect(OPENROUTER_MODELS[0].provider).toBe('OpenRouter')
  })

  it('should have Nano models', () => {
    expect(NANO_MODELS).toHaveLength(2)
    expect(NANO_MODELS[0].id).toBe('nano-1b')
  })

  it('should have Banana models', () => {
    expect(BANANA_MODELS).toHaveLength(3)
    expect(BANANA_MODELS[0].id).toBe('banana-small')
  })

  it('should have OpenCode models', () => {
    expect(OPENCODE_MODELS).toHaveLength(2)
    expect(OPENCODE_MODELS[0].id).toBe('opencode-codex')
  })

  it('should have ALL_MODELS grouping', () => {
    const providers: ModelProvider[] = ['claude', 'codex', 'gemini', 'openrouter', 'nano', 'banana', 'opencode']
    expect(Object.keys(ALL_MODELS)).toEqual(providers)
  })

  it('should have correct model counts in ALL_MODELS', () => {
    expect(ALL_MODELS.claude).toHaveLength(3)
    expect(ALL_MODELS.codex).toHaveLength(4)
    expect(ALL_MODELS.gemini).toHaveLength(4)
    expect(ALL_MODELS.openrouter).toHaveLength(4)
    expect(ALL_MODELS.nano).toHaveLength(2)
    expect(ALL_MODELS.banana).toHaveLength(3)
    expect(ALL_MODELS.opencode).toHaveLength(2)
  })
})
