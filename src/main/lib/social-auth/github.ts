/**
 * GitHub OAuth Authentication
 * Handles GitHub OAuth 2.0 authentication flow
 */

import { BrowserWindow } from 'electron'
import { createHash, randomBytes } from 'crypto'

export interface GitHubAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
}

export interface GitHubAuthResult {
  accessToken: string
  userInfo?: {
    id: string
    login: string
    email: string
    name: string
    avatar_url?: string
  }
}

export class GitHubAuthProvider {
  private config: GitHubAuthConfig
  private authWindow: BrowserWindow | null = null

  constructor(config: GitHubAuthConfig) {
    this.config = config
  }

  /**
   * Start GitHub OAuth flow
   */
  async authenticate(): Promise<GitHubAuthResult> {
    return new Promise((resolve, reject) => {
      // Generate state for security
      const state = randomBytes(16).toString('hex')

      // Build authorization URL
      const authUrl = new URL('https://github.com/login/oauth/authorize')
      authUrl.searchParams.append('client_id', this.config.clientId)
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
    resolve: (value: GitHubAuthResult) => void,
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
  ): Promise<Omit<GitHubAuthResult, 'userInfo'>> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: this.config.redirectUri,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token exchange failed: ${error}`)
    }

    const data = await response.json()

    // GitHub tokens don't expire by default
    return {
      accessToken: data.access_token,
    }
  }

  /**
   * Get user info from GitHub
   */
  private async getUserInfo(accessToken: string): Promise<{
    id: string
    login: string
    email: string
    name: string
    avatar_url?: string
  }> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user info')
    }

    const data = await response.json()

    // Get primary email if not included
    let email = data.email
    if (!email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      })
      const emails = await emailResponse.json()
      const primaryEmail = emails.find((e: any) => e.primary)
      email = primaryEmail?.email
    }

    return {
      id: data.id.toString(),
      login: data.login,
      email: email || '',
      name: data.name || data.login,
      avatar_url: data.avatar_url,
    }
  }
}
