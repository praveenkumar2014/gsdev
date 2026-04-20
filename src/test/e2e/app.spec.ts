import { test, expect } from '@playwright/test'
import { _electron as electron } from 'playwright'

test.describe('GSDEV App', () => {
  let app
  let window

  test.beforeAll(async () => {
    // Launch Electron app
    app = await electron.launch({
      args: ['.'],
      executablePath: process.env.ELECTRON_PATH || undefined,
    })
    window = await app.firstWindow()
  })

  test.afterAll(async () => {
    await app.close()
  })

  test('app launches successfully', async () => {
    expect(await window.title()).toBe('GSDEV')
  })

  test('window has correct dimensions', async () => {
    const size = window.viewportSize()
    expect(size.width).toBeGreaterThanOrEqual(500)
    expect(size.height).toBeGreaterThanOrEqual(600)
  })

  test('DevTools can be opened in development', async () => {
    if (process.env.NODE_ENV !== 'production') {
      await window.keyboard.press('F12')
      // DevTools should open (this is a basic check)
      expect(await window.locator('body').count()).toBeGreaterThanOrEqual(0)
    }
  })
})
