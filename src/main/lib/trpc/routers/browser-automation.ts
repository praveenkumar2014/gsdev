/**
 * Browser Automation TRPC Router
 * Provides Playwright and Selenium browser automation capabilities
 */

import { z } from 'zod'
import { publicProcedure, router } from '../index'
import { getPlaywrightHandler } from '../../playwright-handler'
import { getSeleniumHandler } from '../../selenium-handler'

/**
 * Execute browser automation action
 */
export const executeAction = publicProcedure
  .input(
    z.object({
      action: z.enum(['goto', 'click', 'fill', 'screenshot', 'text', 'wait', 'evaluate', 'close']),
      url: z.string().optional(),
      selector: z.string().optional(),
      text: z.string().optional(),
      value: z.string().optional(),
      timeout: z.number().optional(),
      script: z.string().optional(),
      provider: z.enum(['playwright', 'selenium']).default('playwright'),
      headless: z.boolean().default(true),
    })
  )
  .mutation(async ({ input }) => {
    const handler = input.provider === 'playwright'
      ? getPlaywrightHandler()
      : getSeleniumHandler()

    const result = await handler.handle({
      action: input.action,
      headless: input.headless,
      url: input.url,
      selector: input.selector,
      text: input.text,
      value: input.value,
      timeout: input.timeout,
      script: input.script,
    })

    return result
  })

/**
 * Get browser automation configuration
 */
export const getConfig = publicProcedure.query(async () => {
  return {
    headless: true,
    defaultProvider: 'playwright' as const,
    timeout: 30000,
    retryAttempts: 3,
  }
})

/**
 * Cleanup browser resources
 */
export const cleanup = publicProcedure.mutation(async () => {
  await getPlaywrightHandler().cleanup()
  await getSeleniumHandler().cleanup()
  return { success: true }
})

export const browserAutomationRouter = router({
  executeAction,
  getConfig,
  cleanup,
})
