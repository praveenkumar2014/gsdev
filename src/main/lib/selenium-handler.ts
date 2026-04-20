/**
 * Selenium browser automation handler
 * Provides browser automation capabilities using Selenium WebDriver
 */

import { Builder, By, until, type WebDriver, type WebElement } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'

type SeleniumAction =
  | 'goto'
  | 'click'
  | 'fill'
  | 'screenshot'
  | 'text'
  | 'wait'
  | 'execute'
  | 'close'

interface SeleniumRequest {
  action: SeleniumAction
  url?: string
  selector?: string
  text?: string
  value?: string
  timeout?: number
  script?: string
  headless?: boolean
}

interface SeleniumResponse {
  success: boolean
  data?: any
  screenshot?: string
  error?: string
}

class SeleniumHandler {
  private driver: WebDriver | null = null

  async initialize(headless: boolean = true): Promise<void> {
    if (this.driver) return

    try {
      const options = new chrome.Options()
      if (headless) {
        options.addArguments('--headless')
      }
      options.addArguments('--no-sandbox')
      options.addArguments('--disable-dev-shm-usage')
      options.addArguments('--disable-gpu')
      options.addArguments('--window-size=1280,720')

      this.driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build()
    } catch (error) {
      throw new Error(`Failed to initialize Selenium: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async handle(request: SeleniumRequest, maxRetries: number = 3): Promise<SeleniumResponse> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await this.initialize(request.headless ?? true)

        switch (request.action) {
          case 'goto':
            if (!request.url) throw new Error('URL is required for goto action')
            await this.driver!.get(request.url)
            return { success: true, data: { url: await this.driver!.getCurrentUrl() } }

          case 'click':
            if (!request.selector) throw new Error('Selector is required for click action')
            const element = await this.driver!.wait(
              until.elementLocated(By.css(request.selector)),
              request.timeout || 10000
            )
            await element.click()
            return { success: true }

          case 'fill':
            if (!request.selector || request.value === undefined) throw new Error('Selector and value are required for fill action')
            const fillElement = await this.driver!.wait(
              until.elementLocated(By.css(request.selector)),
              request.timeout || 10000
            )
            await fillElement.sendKeys(request.value)
            return { success: true }

          case 'screenshot':
            const screenshot = await this.driver!.takeScreenshot()
            return { success: true, screenshot }

          case 'text':
            if (!request.selector) throw new Error('Selector is required for text action')
            const textElement = await this.driver!.wait(
              until.elementLocated(By.css(request.selector)),
              request.timeout || 10000
            )
            const text = await textElement.getText()
            return { success: true, data: { text } }

          case 'wait':
            if (!request.selector) throw new Error('Selector is required for wait action')
            await this.driver!.wait(
              until.elementLocated(By.css(request.selector)),
              request.timeout || 30000
            )
            return { success: true }

          case 'execute':
            if (!request.script) throw new Error('Script is required for execute action')
            const result = await this.driver!.executeScript(request.script)
            return { success: true, data: { result } }

          case 'close':
            await this.driver!.quit()
            this.driver = null
            return { success: true }

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
    if (this.driver) {
      await this.driver.quit().catch(() => { })
      this.driver = null
    }
  }
}

// Singleton instance
let handler: SeleniumHandler | null = null

export function getSeleniumHandler(): SeleniumHandler {
  if (!handler) {
    handler = new SeleniumHandler()
  }
  return handler
}

export async function cleanupSeleniumHandler(): Promise<void> {
  if (handler) {
    await handler.cleanup()
    handler = null
  }
}
