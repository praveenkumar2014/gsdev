/**
 * Authentication Hooks
 * Provides authentication utilities for OAuth and API key management
 */

import crypto from "crypto"

export interface OAuthProvider {
  name: string
  clientId: string
  clientSecret: string
  redirectUri: string
  authorizationUrl: string
  tokenUrl: string
  scopes: string[]
}

export interface OAuthToken {
  accessToken: string
  refreshToken?: string
  expiresAt?: Date
}

class AuthHooks {
  private providers: Map<string, OAuthProvider> = new Map()
  private tokens: Map<string, OAuthToken> = new Map()

  /**
   * Register an OAuth provider
   */
  registerProvider(provider: OAuthProvider): void {
    this.providers.set(provider.name, provider)
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthorizationUrl(providerName: string, state: string): string {
    const provider = this.providers.get(providerName)
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`)
    }

    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: provider.redirectUri,
      scope: provider.scopes.join(" "),
      state,
      response_type: "code"
    })

    return `${provider.authorizationUrl}?${params.toString()}`
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(
    providerName: string,
    code: string,
    state: string
  ): Promise<OAuthToken> {
    const provider = this.providers.get(providerName)
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`)
    }

    const response = await fetch(provider.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: provider.clientId,
        client_secret: provider.clientSecret,
        code,
        redirect_uri: provider.redirectUri,
        grant_type: "authorization_code"
      })
    })

    const data = await response.json()

    const token: OAuthToken = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined
    }

    this.tokens.set(`${providerName}:${state}`, token)
    return token
  }

  /**
   * Refresh access token
   */
  async refreshToken(providerName: string, state: string): Promise<OAuthToken> {
    const token = this.tokens.get(`${providerName}:${state}`)
    if (!token || !token.refreshToken) {
      throw new Error("No refresh token available")
    }

    const provider = this.providers.get(providerName)
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`)
    }

    const response = await fetch(provider.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: provider.clientId,
        client_secret: provider.clientSecret,
        refresh_token: token.refreshToken,
        grant_type: "refresh_token"
      })
    })

    const data = await response.json()

    const newToken: OAuthToken = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || token.refreshToken,
      expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined
    }

    this.tokens.set(`${providerName}:${state}`, newToken)
    return newToken
  }

  /**
   * Get stored token
   */
  getToken(providerName: string, state: string): OAuthToken | undefined {
    return this.tokens.get(`${providerName}:${state}`)
  }

  /**
   * Generate API key
   */
  generateApiKey(prefix: string = "gsdev"): string {
    const randomPart = crypto.randomBytes(32).toString("hex")
    return `${prefix}_${randomPart.substring(0, 16)}_${randomPart.substring(16, 32)}`
  }

  /**
   * Verify API key
   */
  verifyApiKey(key: string, storedKey: string): boolean {
    return crypto.timingSafeEqual(
      Buffer.from(key),
      Buffer.from(storedKey)
    )
  }

  /**
   * Generate secure state parameter for OAuth
   */
  generateState(): string {
    return crypto.randomBytes(32).toString("hex")
  }
}

export const authHooks = new AuthHooks()
