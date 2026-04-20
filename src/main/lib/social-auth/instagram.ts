/**
 * Instagram OAuth Authentication
 * Handles Instagram Basic Display API OAuth 2.0 authentication flow
 */

import { BrowserWindow } from 'electron'
import { createHash, randomBytes } from 'crypto'

export interface InstagramAuthConfig {
  appId: string
  appSecret: string
  redirectUri: string
  scopes: string[]
}

export interface InstagramAuthResult {
  accessToken: string
  expiresAt: number
  userInfo?: {
    id: string
    username: string
    accountType?: string
  }
}

export class InstagramAuthProvider {
  private config: InstagramAuthConfig
  private authWindow: BrowserWindow | null = null

  constructor(config: InstagramAuthConfig) {
    this.config = config
  }

  /**
   * Start Instagram OAuth flow
   */
  async authenticate(): Promise<InstagramAuthResult> {
    return new Promise((resolve, reject) => {
      // Generate state for security
      const state = randomBytes(16).toString('hex')

      // Build authorization URL
      const authUrl = new URL('https://api.instagram.com/oauth/authorize')
      authUrl.searchParams.append('client_id', this.config.appId)
      authUrl.searchParams.append('redirect_uri', this.config.redirectUri)
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('scope', this.config.scopes.join(' '))
      authUrl.searchParams.append('state', state)

      // Create auth window
      this.authWindow = new BrowserWindow({
        width: 500,
        height: 600,
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
        },
      })

      // Load auth URL
      this.authWindow.loadURL(authUrl.toString())

      // Show window when ready
      this.authWindow.once('ready-to-show', () => {
        this.authWindow?.show()
      })

      // Handle redirect
      this.authWindow.webContents.on('will-redirect', (event, url) => {
        if (url.startsWith(this.config.redirectUri)) {
          event.preventDefault()
          this.handleCallback(url, state, resolve, reject)
        }
      })

      // Handle navigation
      this.authWindow.webContents.on('did-navigate', (event, url) => {
        if (url.startsWith(this.config.redirectUri)) {
          this.handleCallback(url, state, resolve, reject)
        }
      })

      // Handle window close (user cancelled)
      this.authWindow.on('closed', () => {
        reject(new Error('Authentication cancelled by user'))
      })
    })
  }

  /**
   * Handle OAuth callback
   */
  private async handleCallback(
    url: string,
    expectedState: string,
    resolve: (value: InstagramAuthResult) => void,
    reject: (reason: any) => void
  ) {
    try {
      // Parse callback URL
      const urlObj = new URL(url)
      const code = urlObj.searchParams.get('code')
      const state = urlObj.searchParams.get('state')
      const error = urlObj.searchParams.get('error')

      // Check for errors
      if (error) {
        reject(new Error(`OAuth error: ${error}`))
        this.authWindow?.close()
        return
      }

      // Verify state
      if (state !== expectedState) {
        reject(new Error('State mismatch - possible CSRF attack'))
        this.authWindow?.close()
        return
      }

      if (!code) {
        reject(new Error('No authorization code received'))
        this.authWindow?.close()
        return
      }

      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(code)

      // Get user info
      const userInfo = await this.getUserInfo(tokens.accessToken)

      // Close auth window
      this.authWindow?.close()

      resolve({
        ...tokens,
        userInfo,
      })
    } catch (error) {
      reject(error)
      this.authWindow?.close()
    }
  }

  /**
   * Exchange authorization code for tokens
   */
  private async exchangeCodeForTokens(
    code: string
  ): Promise<Omit<InstagramAuthResult, 'userInfo'>> {
    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.appId,
        client_secret: this.config.appSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token exchange failed: ${error}`)
    }

    const data = await response.json()

    // Instagram tokens expire in 1 hour by default
    return {
      accessToken: data.access_token,
      expiresAt: Date.now() + 3600 * 1000,
    }
  }

  /**
   * Get user info from Instagram
   */
  private async getUserInfo(accessToken: string): Promise<{
    id: string
    username: string
    accountType?: string
  }> {
    const response = await fetch(
      'https://graph.instagram.com/me?fields=id,username,account_type',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch user info')
    }

    const data = await response.json()

    return {
      id: data.id,
      username: data.username,
      accountType: data.account_type,
    }
  }

  /**
   * Refresh access token (Instagram tokens are long-lived but can be refreshed)
   */
  async refreshAccessToken(accessToken: string): Promise<{
    accessToken: string
    expiresAt: number
  }> {
    const response = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`
    )

    if (!response.ok) {
      throw new Error('Token refresh failed')
    }

    const data = await response.json()

    // Long-lived tokens expire in 60 days
    return {
      accessToken: data.access_token,
      expiresAt: Date.now() + 60 * 24 * 3600 * 1000,
    }
  }
}
