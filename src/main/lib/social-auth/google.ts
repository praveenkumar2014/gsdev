/**
 * Google OAuth Authentication
 * Handles Google OAuth 2.0 authentication flow
 */

import { BrowserWindow } from 'electron'
import { createHash, randomBytes } from 'crypto'

export interface GoogleAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
}

export interface GoogleAuthResult {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  idToken: string
  userInfo?: {
    id: string
    email: string
    name: string
    picture?: string
  }
}

export class GoogleAuthProvider {
  private config: GoogleAuthConfig
  private authWindow: BrowserWindow | null = null

  constructor(config: GoogleAuthConfig) {
    this.config = config
  }

  /**
   * Start Google OAuth flow
   */
  async authenticate(): Promise<GoogleAuthResult> {
    return new Promise((resolve, reject) => {
      // Generate state for security
      const state = randomBytes(16).toString('hex')
      const codeVerifier = randomBytes(32).toString('base64url')
      const codeChallenge = createHash('sha256')
        .update(codeVerifier)
        .digest('base64url')

      // Build authorization URL
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      authUrl.searchParams.append('client_id', this.config.clientId)
      authUrl.searchParams.append('redirect_uri', this.config.redirectUri)
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('scope', this.config.scopes.join(' '))
      authUrl.searchParams.append('state', state)
      authUrl.searchParams.append('code_challenge', codeChallenge)
      authUrl.searchParams.append('code_challenge_method', 'S256')

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
          this.handleCallback(url, state, codeVerifier, resolve, reject)
        }
      })

      // Handle navigation
      this.authWindow.webContents.on('did-navigate', (event, url) => {
        if (url.startsWith(this.config.redirectUri)) {
          this.handleCallback(url, state, codeVerifier, resolve, reject)
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
    codeVerifier: string,
    resolve: (value: GoogleAuthResult) => void,
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
      const tokens = await this.exchangeCodeForTokens(code, codeVerifier)

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
    code: string,
    codeVerifier: string
  ): Promise<Omit<GoogleAuthResult, 'userInfo'>> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: this.config.redirectUri,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token exchange failed: ${error}`)
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    }
  }

  /**
   * Get user info from Google
   */
  private async getUserInfo(accessToken: string): Promise<{
    id: string
    email: string
    name: string
    picture?: string
  }> {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
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
      email: data.email,
      name: data.name,
      picture: data.picture,
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string
    expiresAt: number
  }> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!response.ok) {
      throw new Error('Token refresh failed')
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    }
  }
}
