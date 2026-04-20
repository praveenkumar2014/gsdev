/**
 * Playwright browser automation handler
 * Provides browser automation capabilities using Playwright
 */

import { chromium, type Browser, type Page, type BrowserContext } from 'playwright'

type PlaywrightAction =
  | 'goto'
  | 'click'
  | 'fill'
  | 'screenshot'
  | 'text'
  | 'wait'
  | 'evaluate'
  | 'close'
  | 'startRecording'
  | 'stopRecording'

interface PlaywrightRequest {
  action: PlaywrightAction
  url?: string
  selector?: string
  text?: string
  value?: string
  timeout?: number
  script?: string
  headless?: boolean
}

interface PlaywrightResponse {
  success: boolean
  data?: any
  screenshot?: string
  error?: string
}

class PlaywrightHandler {
  private browser: Browser | null = null
  private context: BrowserContext | null = null
  private pages: Map<string, Page> = new Map()
  private recordings: Map<string, any> = new Map()

  async initialize(headless: boolean = true): Promise<void> {
    if (this.browser) return

    try {
      this.browser = await chromium.launch({ headless })
      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        recordVideo: headless ? { dir: './videos' } : undefined
      })
    } catch (error) {
      throw new Error(`Failed to initialize Playwright: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async handle(request: PlaywrightRequest, sessionId: string = 'default', maxRetries: number = 3): Promise<PlaywrightResponse> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await this.initialize(request.headless ?? true)

        let page = this.pages.get(sessionId)
        if (!page) {
          page = await this.context!.newPage()
          this.pages.set(sessionId, page)
        }

        switch (request.action) {
          case 'goto':
            if (!request.url) throw new Error('URL is required for goto action')
            await page.goto(request.url, { timeout: request.timeout || 30000 })
            return { success: true, data: { url: page.url() } }

          case 'click':
            if (!request.selector) throw new Error('Selector is required for click action')
            await page.click(request.selector, { timeout: request.timeout || 10000 })
            return { success: true }

          case 'fill':
            if (!request.selector || request.value === undefined) throw new Error('Selector and value are required for fill action')
            await page.fill(request.selector, request.value, { timeout: request.timeout || 10000 })
            return { success: true }

          case 'screenshot':
            const screenshot = await page.screenshot({ fullPage: false })
            return { success: true, screenshot: screenshot.toString('base64') }

          case 'text':
            if (!request.selector) throw new Error('Selector is required for text action')
            const text = await page.textContent(request.selector)
            return { success: true, data: { text } }

          case 'wait':
            if (!request.selector) throw new Error('Selector is required for wait action')
            await page.waitForSelector(request.selector, { timeout: request.timeout || 30000 })
            return { success: true }

          case 'evaluate':
            if (!request.script) throw new Error('Script is required for evaluate action')
            const result = await page.evaluate(request.script)
            return { success: true, data: { result } }

          case 'close':
            await page.close()
            this.pages.delete(sessionId)
            return { success: true }

          case 'startRecording':
            if (!request.headless) {
              // Video recording only works in headless mode
              throw new Error('Video recording requires headless mode')
            }
            try {
              const video = page.video()
              if (!video) {
                throw new Error('Video recording not available')
              }
              const recording = await video.path()
              if (!recording) {
                throw new Error('Failed to get recording path')
              }
              this.recordings.set(sessionId, recording)
              return { success: true, data: { recordingPath: recording } }
            } catch (error) {
              throw new Error(`Video recording failed: ${error instanceof Error ? error.message : String(error)}`)
            }

          case 'stopRecording':
            const recordingPath = this.recordings.get(sessionId)
            if (!recordingPath) {
              throw new Error('No recording in progress')
            }
            this.recordings.delete(sessionId)
            return { success: true, data: { recordingPath } }

          default:
            throw new Error(`Unknown action: ${request.action}`)
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1))) // Exponential backoff
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Failed after retries'
    }
  }

  async cleanup(): Promise<void> {
    for (const page of this.pages.values()) {
      await page.close().catch(() => { })
    }
    this.pages.clear()

    if (this.context) {
      await this.context.close().catch(() => { })
      this.context = null
    }

    if (this.browser) {
      await this.browser.close().catch(() => { })
      this.browser = null
    }
  }
}

// Singleton instance
let handler: PlaywrightHandler | null = null

export function getPlaywrightHandler(): PlaywrightHandler {
  if (!handler) {
    handler = new PlaywrightHandler()
  }
  return handler
}

export async function cleanupPlaywrightHandler(): Promise<void> {
  if (handler) {
    await handler.cleanup()
    handler = null
  }
}
