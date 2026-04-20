/**
 * Webhook Integration Module
 * Unified interface for webhook operations
 */

export * from './server'
export { startWebhookServer, webhookApp } from './server'

/**
 * Webhook event types
 */
export type WebhookEvent =
  | 'stripe.checkout.completed'
  | 'stripe.subscription.created'
  | 'stripe.subscription.updated'
  | 'stripe.subscription.deleted'
  | 'stripe.invoice.payment_succeeded'
  | 'stripe.invoice.payment_failed'
  | 'razorpay.payment.captured'
  | 'razorpay.payment.failed'
  | 'github.push'
  | 'github.pull_request'
  | 'linear.issue.created'
  | 'linear.issue.updated'
  | 'slack.message'
  | 'generic'

/**
 * Webhook event handler interface
 */
export interface WebhookHandler {
  eventType: WebhookEvent
  handler: (data: any) => Promise<void>
}

/**
 * Register webhook handler
 */
const handlers: Map<WebhookEvent, WebhookHandler[]> = new Map()

export function registerWebhookHandler(handler: WebhookHandler) {
  const existing = handlers.get(handler.eventType) || []
  existing.push(handler)
  handlers.set(handler.eventType, existing)
}

/**
 * Dispatch webhook event to handlers
 */
export async function dispatchWebhookEvent(eventType: WebhookEvent, data: any) {
  const eventHandlers = handlers.get(eventType) || []

  for (const handler of eventHandlers) {
    try {
      await handler.handler(data)
    } catch (error) {
      console.error(`[Webhook] Error in handler for ${eventType}:`, error)
    }
  }
}

/**
 * Get registered handlers
 */
export function getRegisteredHandlers(): WebhookHandler[] {
  const allHandlers: WebhookHandler[] = []

  for (const handlersArray of handlers.values()) {
    allHandlers.push(...handlersArray)
  }

  return allHandlers
}
