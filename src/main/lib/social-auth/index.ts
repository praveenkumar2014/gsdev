/**
 * Social Authentication Module
 * Unified interface for social authentication providers
 */

export * from './google'
export * from './facebook'
export * from './instagram'
export * from './github'

import { GoogleAuthProvider, GoogleAuthConfig, GoogleAuthResult } from './google'
import { FacebookAuthProvider, FacebookAuthConfig, FacebookAuthResult } from './facebook'
import { InstagramAuthProvider, InstagramAuthConfig, InstagramAuthResult } from './instagram'
import { GitHubAuthProvider, GitHubAuthConfig, GitHubAuthResult } from './github'

export type SocialAuthProvider = 'google' | 'facebook' | 'instagram' | 'github'

export interface SocialAuthConfig {
  google?: GoogleAuthConfig
  facebook?: FacebookAuthConfig
  instagram?: InstagramAuthConfig
  github?: GitHubAuthConfig
}

export type SocialAuthResult =
  | GoogleAuthResult
  | FacebookAuthResult
  | InstagramAuthResult
  | GitHubAuthResult

/**
 * Social Authentication Manager
 */
export class SocialAuthManager {
  private configs: SocialAuthConfig
  private providers: Map<SocialAuthProvider, any> = new Map()

  constructor(configs: SocialAuthConfig) {
    this.configs = configs

    // Initialize configured providers
    if (configs.google) {
      this.providers.set('google', new GoogleAuthProvider(configs.google))
    }
    if (configs.facebook) {
      this.providers.set('facebook', new FacebookAuthProvider(configs.facebook))
    }
    if (configs.instagram) {
      this.providers.set('instagram', new InstagramAuthProvider(configs.instagram))
    }
    if (configs.github) {
      this.providers.set('github', new GitHubAuthProvider(configs.github))
    }
  }

  /**
   * Authenticate with a specific provider
   */
  async authenticate(provider: SocialAuthProvider): Promise<SocialAuthResult> {
    const authProvider = this.providers.get(provider)

    if (!authProvider) {
      throw new Error(`Provider ${provider} not configured`)
    }

    return await authProvider.authenticate()
  }

  /**
   * Get list of configured providers
   */
  getConfiguredProviders(): SocialAuthProvider[] {
    return Array.from(this.providers.keys())
  }

  /**
   * Check if a provider is configured
   */
  isProviderConfigured(provider: SocialAuthProvider): boolean {
    return this.providers.has(provider)
  }
}

/**
 * Create social auth manager from environment variables
 */
export function createSocialAuthManager(): SocialAuthManager {
  const configs: SocialAuthConfig = {}

  // Google
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    configs.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8914/callback',
      scopes: ['openid', 'profile', 'email'],
    }
  }

  // Facebook
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    configs.facebook = {
      appId: process.env.FACEBOOK_APP_ID,
      appSecret: process.env.FACEBOOK_APP_SECRET,
      redirectUri: process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:8914/callback',
      scopes: ['email', 'public_profile'],
    }
  }

  // Instagram
  if (process.env.INSTAGRAM_APP_ID && process.env.INSTAGRAM_APP_SECRET) {
    configs.instagram = {
      appId: process.env.INSTAGRAM_APP_ID,
      appSecret: process.env.INSTAGRAM_APP_SECRET,
      redirectUri: process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:8914/callback',
      scopes: ['user_profile'],
    }
  }

  // GitHub
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    configs.github = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      redirectUri: process.env.GITHUB_REDIRECT_URI || 'http://localhost:8914/callback',
      scopes: ['user:email', 'read:user'],
    }
  }

  return new SocialAuthManager(configs)
}
