/**
 * Unit tests for voice language support
 */

import { describe, it, expect } from 'vitest'
import { VOICE_LANGUAGES } from '../../renderer/lib/atoms'

describe('Voice Languages', () => {
  it('should have English, Hindi, and Telugu support', () => {
    expect(VOICE_LANGUAGES.length).toBeGreaterThanOrEqual(3)
  })

  it('should have correct language codes', () => {
    const codes = VOICE_LANGUAGES.map(l => l.code)
    expect(codes).toContain('en-US')
    expect(codes).toContain('hi-IN')
    expect(codes).toContain('te-IN')
  })

  it('should have correct language names', () => {
    const names = VOICE_LANGUAGES.map(l => l.name)
    expect(names).toContain('English')
    expect(names).toContain('Hindi')
    expect(names).toContain('Telugu')
  })

  it('should have English as first language', () => {
    expect(VOICE_LANGUAGES[0].code).toBe('en-US')
    expect(VOICE_LANGUAGES[0].name).toBe('English')
  })
})
