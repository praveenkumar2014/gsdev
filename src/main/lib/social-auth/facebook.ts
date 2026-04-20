/**
 * Facebook OAuth Authentication
 * Handles Facebook OAuth 2.0 authentication flow
 */

import { BrowserWindow } from 'electron'
import { createHash, randomBytes } from 'crypto'

export interface FacebookAuthConfig {
  appId: string
  appSecret: string
  redirectUri: string
  scopes: string[]
}

export interface FacebookAuthResult {
  accessToken: string
  expiresAt: number
  userInfo?: {
    id: string
    email: string
    name: string
    picture?: string
  }
}

export class FacebookAuthProvider {
  private config: FacebookAuthConfig
  private authWindow: BrowserWindow | null = null

  constructor(config: FacebookAuthConfig) {
    this.config = config
  }

  /**
   * Start Facebook OAuth flow
   */
  async authenticate(): Promise<FacebookAuthResult> {
    return new Promise((resolve, reject) => {
      // Generate state for security
      const state = randomBytes(16).toString('hex')

      // Build authorization URL
      const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
      authUrl.searchParams.append('client_id', this.config.appId)
      authUrl.searchParams.append('redirect_uri', this.config.redirectUri)
      authUrl.searchParams.append('response_type', 'token')
      authUrl.searchParams.append('scope', this.config.scopes.join(','))
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
    resolve: (value: FacebookAuthResult) => void,
    reject: (reason: any) => void
  ) {
    try {
      // Parse callback URL (Facebook uses fragment for token)
      const urlObj = new URL(url)
      const fragment = urlObj.hash.substring(1)
      const params = new URLSearchParams(fragment)

      const accessToken = params.get('access_token')
      const state = params.get('state')
      const expiresIn = params.get('expires_in')
      const error = params.get('error')

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

      if (!accessToken) {
        reject(new Error('No access token received'))
        this.authWindow?.close()
        return
      }

      // Get user info
      const userInfo = await this.getUserInfo(accessToken)

      // Close auth window
      this.authWindow?.close()

      resolve({
        accessToken,
        expiresAt: Date.now() + (parseInt(expiresIn || '0') * 1000),
        userInfo,
      })
    } catch (error) {
      reject(error)
      this.authWindow?.close()
    }
  }

  /**
   * Get user info from Facebook
   */
  private async getUserInfo(accessToken: string): Promise<{
    id: string
    email: string
    name: string
    picture?: string
  }> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,email,name,picture&access_token=${accessToken}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch user info')
    }

    const data = await response.json()

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture?.data?.url,
    }
  }
}
