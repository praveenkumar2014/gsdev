/**
 * API Router
 * Provides API endpoints for external integrations
 */

import { z } from "zod"
import { publicProcedure, router } from "../index"
import { connectorManager } from "../../connectors/connector-manager"
import { webhookHandler } from "../../webhooks/webhook-handler"
import { authHooks } from "../../auth/auth-hooks"

export const apiRouter = router({
  /**
   * Get API key generation endpoint
   */
  generateApiKey: publicProcedure
    .input(z.object({ prefix: z.string().optional() }))
    .mutation(({ input }) => {
      const apiKey = authHooks.generateApiKey(input.prefix || "gsdev")
      return { apiKey, createdAt: new Date() }
    }),

  /**
   * Verify API key
   */
  verifyApiKey: publicProcedure
    .input(z.object({ apiKey: z.string() }))
    .mutation(({ input }) => {
      // In production, verify against stored keys
      return { valid: true, verifiedAt: new Date() }
    }),

  /**
   * Register a connector
   */
  registerConnector: publicProcedure
    .input(z.object({
      id: z.string(),
      type: z.enum(["github", "gitlab", "linear", "slack", "jira", "notion"]),
      name: z.string(),
      apiKey: z.string(),
      webhookUrl: z.string().optional(),
      settings: z.record(z.any()).optional()
    }))
    .mutation(({ input }) => {
      const config = {
        ...input,
        settings: input.settings || {}
      }
      connectorManager.registerConnector(config)
      return { success: true, connector: config }
    }),

  /**
   * Test connector connection
   */
  testConnector: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const connector = connectorManager.getConnector(input.id)
      if (!connector) {
        throw new Error("Connector not found")
      }

      const status = await connectorManager.testConnection(connector)
      return status
    }),

  /**
   * Get all connectors
   */
  getConnectors: publicProcedure.query(() => {
    return connectorManager.getAllConnectors()
  }),

  /**
   * Remove a connector
   */
  removeConnector: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const removed = connectorManager.removeConnector(input.id)
      return { success: removed }
    }),

  /**
   * Register a webhook
   */
  registerWebhook: publicProcedure
    .input(z.object({
      id: z.string(),
      url: z.string().url(),
      secret: z.string(),
      events: z.array(z.string()),
      active: z.boolean().default(true)
    }))
    .mutation(({ input }) => {
      webhookHandler.registerWebhook(input)
      return { success: true, webhook: input }
    }),

  /**
   * Get all webhooks
   */
  getWebhooks: publicProcedure.query(() => {
    return webhookHandler.getAllWebhooks()
  }),

  /**
   * Remove a webhook
   */
  removeWebhook: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const removed = webhookHandler.removeWebhook(input.id)
      return { success: removed }
    }),

  /**
   * Get OAuth authorization URL
   */
  getOAuthUrl: publicProcedure
    .input(z.object({
      provider: z.string(),
      state: z.string()
    }))
    .mutation(({ input }) => {
      // In production, this would use registered providers
      const url = authHooks.getAuthorizationUrl(input.provider, input.state)
      return { url }
    }),

  /**
   * Exchange OAuth code for token
   */
  exchangeOAuthCode: publicProcedure
    .input(z.object({
      provider: z.string(),
      code: z.string(),
      state: z.string()
    }))
    .mutation(async ({ input }) => {
      const token = await authHooks.exchangeCodeForToken(
        input.provider,
        input.code,
        input.state
      )
      return { success: true, token }
    })
})
