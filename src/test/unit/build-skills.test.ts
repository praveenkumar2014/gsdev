/**
 * Unit tests for build skills
 */

import { describe, it, expect } from 'vitest'
import {
  BUILD_SKILLS,
  getBuildSkill,
  getSkillsByCapability,
  getAllBuildSkillIds,
} from '../../renderer/features/agents/lib/build-skills'
import type { BuildCapability } from '../../renderer/features/agents/lib/build-capabilities'

describe('Build Skills', () => {
  it('should have all required build skills', () => {
    expect(BUILD_SKILLS).toHaveLength(8)
  })

  it('should have website builder skill', () => {
    const websiteSkill = getBuildSkill('website-builder')
    expect(websiteSkill).toBeDefined()
    expect(websiteSkill?.name).toBe('Website Builder')
    expect(websiteSkill?.capability).toBe('website')
  })

  it('should get skills by capability', () => {
    const websiteSkills = getSkillsByCapability('website')
    expect(websiteSkills).toHaveLength(1)
    expect(websiteSkills[0].id).toBe('website-builder')
  })

  it('should get all build skill IDs', () => {
    const skillIds = getAllBuildSkillIds()
    expect(skillIds).toContain('website-builder')
    expect(skillIds).toContain('mobile-app-builder')
    expect(skillIds).toContain('poster-generator')
    expect(skillIds).toContain('blog-generator')
    expect(skillIds).toContain('image-generator')
    expect(skillIds).toContain('presentation-builder')
    expect(skillIds).toContain('video-generator')
    expect(skillIds).toContain('document-generator')
  })

  it('should have proper prompts for each skill', () => {
    BUILD_SKILLS.forEach(skill => {
      expect(skill.prompt).toBeTruthy()
      expect(skill.prompt.length).toBeGreaterThan(100)
      expect(skill.tools).toBeDefined()
      expect(skill.tools.length).toBeGreaterThan(0)
    })
  })

  it('should return undefined for invalid skill ID', () => {
    const invalid = getBuildSkill('invalid-skill')
    expect(invalid).toBeUndefined()
  })
})
