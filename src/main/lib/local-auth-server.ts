/**
 * Local Authentication Server
 * Provides a simple local auth page for development when gsdev.dev is not accessible
 */

import { createServer, type Server, type IncomingMessage, type ServerResponse } from 'http'
import { readFile } from 'fs'
import { join } from 'path'

const AUTH_SERVER_PORT = 21323

/**
 * Create a simple local auth server for development
 */
export function createLocalAuthServer(): Server {
  const server = createServer((req, res) => {
    if (req.url === '/auth/desktop') {
      // Serve a simple auth page
      const authPage = `
<!DOCTYPE html>
<html>
<head>
  <title>GSDEV Authentication</title>
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
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
      max-width: 400px;
    }
    h1 { margin: 0 0 1rem 0; }
    p { margin: 0 0 1.5rem 0; opacity: 0.9; }
    button {
      background: white;
      color: #667eea;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      margin: 0.5rem;
      transition: transform 0.2s;
    }
    button:hover {
      transform: scale(1.05);
    }
    .social-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>GSDEV Authentication</h1>
    <p>Choose your authentication method</p>
    <div class="social-buttons">
      <button onclick="authenticate('google')">Continue with Google</button>
      <button onclick="authenticate('github')">Continue with GitHub</button>
      <button onclick="authenticate('facebook')">Continue with Facebook</button>
      <button onclick="authenticate('instagram')">Continue with Instagram</button>
    </div>
    <p style="margin-top: 1.5rem; font-size: 0.875rem;">
      Local Development Mode
    </p>
  </div>
  <script>
    function authenticate(provider) {
      // Notify main process to start social auth
      if (window.electronAPI) {
        window.electronAPI.startSocialAuth(provider);
      } else {
        alert('Social auth not configured. Please configure OAuth credentials in .env');
      }
    }
  </script>
</body>
</html>
      `
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(authPage)
    } else if (req.url === '/auth/callback') {
      // Handle OAuth callback
      const url = new URL(req.url || '', `http://localhost:${AUTH_SERVER_PORT}`)
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')

      if (code) {
        // Successfully received auth code
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(`
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
    }
    h1 { margin: 0 0 1rem 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>✓ Authentication Successful</h1>
    <p>You can close this window now.</p>
  </div>
</body>
</html>
        `)
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.end('Authentication failed')
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
    }
  })

  return server
}

/**
 * Start the local auth server
 */
export function startLocalAuthServer(): Server {
  const server = createLocalAuthServer()
  server.listen(AUTH_SERVER_PORT, () => {
    console.log(`[LocalAuth] Server running on port ${AUTH_SERVER_PORT}`)
  })
  return server
}
