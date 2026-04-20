/**
 * Social Authentication TRPC Router
 * Provides social authentication endpoints for Google, Facebook, Instagram, and GitHub
 */

import { z } from 'zod'
import { publicProcedure, router } from '../index'
import { createSocialAuthManager, SocialAuthProvider } from '../../social-auth'

/**
 * Get configured social auth providers
 */
export const getProviders = publicProcedure.query(async () => {
  const manager = createSocialAuthManager()
  return {
    providers: manager.getConfiguredProviders(),
  }
})

/**
 * Authenticate with a social provider
 */
export const authenticate = publicProcedure
  .input(
    z.object({
      provider: z.enum(['google', 'facebook', 'instagram', 'github']),
    })
  )
  .mutation(async ({ input }) => {
    const manager = createSocialAuthManager()

    if (!manager.isProviderConfigured(input.provider)) {
      throw new Error(`Provider ${input.provider} is not configured`)
    }

    const result = await manager.authenticate(input.provider)
    return result
  })

/**
 * Check if a provider is configured
 */
export const isProviderConfigured = publicProcedure
  .input(
    z.object({
      provider: z.enum(['google', 'facebook', 'instagram', 'github']),
    })
  )
  .query(async ({ input }) => {
    const manager = createSocialAuthManager()
    return {
      configured: manager.isProviderConfigured(input.provider),
    }
  })

export const socialAuthRouter = router({
  getProviders,
  authenticate,
  isProviderConfigured,
})
