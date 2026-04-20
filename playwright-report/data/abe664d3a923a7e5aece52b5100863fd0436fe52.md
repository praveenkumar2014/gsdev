# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> GSDEV App >> app launches successfully
- Location: src/test/e2e/app.spec.ts:21:2

# Error details

```
"beforeAll" hook timeout of 30000ms exceeded.
```

```
TypeError: undefined is not an object (evaluating 'app.close')
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { _electron as electron } from 'playwright'
  3  | 
  4  | test.describe('GSDEV App', () => {
  5  |   let app
  6  |   let window
  7  | 
  8  |   test.beforeAll(async () => {
  9  |     // Launch Electron app
  10 |     app = await electron.launch({
  11 |       args: ['.'],
  12 |       executablePath: process.env.ELECTRON_PATH || undefined,
  13 |     })
  14 |     window = await app.firstWindow()
  15 |   })
  16 | 
  17 |   test.afterAll(async () => {
> 18 |     await app.close()
     |          ^ TypeError: undefined is not an object (evaluating 'app.close')
  19 |   })
  20 | 
  21 |   test('app launches successfully', async () => {
  22 |     expect(await window.title()).toBe('GSDEV')
  23 |   })
  24 | 
  25 |   test('window has correct dimensions', async () => {
  26 |     const size = window.viewportSize()
  27 |     expect(size.width).toBeGreaterThanOrEqual(500)
  28 |     expect(size.height).toBeGreaterThanOrEqual(600)
  29 |   })
  30 | 
  31 |   test('DevTools can be opened in development', async () => {
  32 |     if (process.env.NODE_ENV !== 'production') {
  33 |       await window.keyboard.press('F12')
  34 |       // DevTools should open (this is a basic check)
  35 |       expect(await window.locator('body').count()).toBeGreaterThanOrEqual(0)
  36 |     }
  37 |   })
  38 | })
  39 | 
```