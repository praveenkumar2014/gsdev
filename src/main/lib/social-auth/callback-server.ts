/**
 * OAuth Callback Server
 * Local HTTP server to handle OAuth callbacks from social providers
 */

import { createServer, type Server, type IncomingMessage, type ServerResponse } from 'http'

export interface CallbackHandler {
  (params: URLSearchParams): void
}

export class OAuthCallbackServer {
  private server: Server | null = null
  private port: number
  private handlers: Map<string, CallbackHandler> = new Map()

  constructor(port: number = 8914) {
    this.port = port
  }

  /**
   * Register a callback handler for a specific path
   */
  on(path: string, handler: CallbackHandler): void {
    this.handlers.set(path, handler)
  }

  /**
   * Start the callback server
   */
  start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = createServer((req, res) => {
        const url = new URL(req.url || '', `http://localhost:${this.port}`)
        const handler = this.handlers.get(url.pathname)

        if (handler) {
          handler(url.searchParams)
          this.sendSuccessResponse(res)
        } else {
          this.sendNotFoundResponse(res)
        }
      })

      this.server.listen(this.port, () => {
        console.log(`[OAuthCallbackServer] Server running on port ${this.port}`)
        resolve()
      })
    })
  }

  /**
   * Stop the callback server
   */
  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('[OAuthCallbackServer] Server stopped')
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  /**
   * Send success response
   */
  private sendSuccessResponse(res: ServerResponse): void {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Authentication Successful</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      backdrop-filter: blur(10px);
    }
    h1 { margin: 0 0 1rem 0; }
    p { margin: 0; opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <h1>✓ Authentication Successful</h1>
    <p>You can close this window now.</p>
  </div>
</body>
</html>
    `
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
  }

  /**
   * Send not found response
   */
  private sendNotFoundResponse(res: ServerResponse): void {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
  }
}

// Singleton instance
let callbackServerInstance: OAuthCallbackServer | null = null

export function getCallbackServer(): OAuthCallbackServer {
  if (!callbackServerInstance) {
    callbackServerInstance = new OAuthCallbackServer()
  }
  return callbackServerInstance
}
