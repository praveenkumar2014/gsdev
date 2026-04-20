/**
 * Unit tests for build capabilities
 */

import { describe, it, expect } from 'vitest'
import {
  BUILD_CAPABILITIES,
  getBuildCapability,
  getSupportedFormats,
  requiresAI,
  type BuildCapability,
} from '../../renderer/features/agents/lib/build-capabilities'

describe('Build Capabilities', () => {
  it('should have all required capabilities', () => {
    const expectedCapabilities: BuildCapability[] = [
      'website',
      'mobile-app',
      'poster',
      'blog',
      'image',
      'presentation',
      'video',
      'document',
    ]
    expect(BUILD_CAPABILITIES.map(c => c.id)).toEqual(expectedCapabilities)
  })

  it('should get build capability by ID', () => {
    const website = getBuildCapability('website')
    expect(website).toBeDefined()
    expect(website?.name).toBe('Website Builder')
    expect(website?.requiresAI).toBe(true)
  })

  it('should return undefined for invalid capability', () => {
    const invalid = getBuildCapability('invalid' as BuildCapability)
    expect(invalid).toBeUndefined()
  })

  it('should get supported formats for capability', () => {
    const websiteFormats = getSupportedFormats('website')
    expect(websiteFormats).toContain('html')
    expect(websiteFormats).toContain('react')
    expect(websiteFormats).toContain('vue')
  })

  it('should check if capability requires AI', () => {
    expect(requiresAI('website')).toBe(true)
    expect(requiresAI('image')).toBe(true)
  })

  it('should have correct supported formats for each capability', () => {
    const website = getBuildCapability('website')
    expect(website?.supportedFormats).toContain('html')
    expect(website?.supportedFormats).toContain('react')

    const mobile = getBuildCapability('mobile-app')
    expect(mobile?.supportedFormats).toContain('react-native')
    expect(mobile?.supportedFormats).toContain('flutter')

    const image = getBuildCapability('image')
    expect(image?.supportedFormats).toContain('png')
    expect(image?.supportedFormats).toContain('jpg')
  })
})
