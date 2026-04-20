/**
 * Webhook Handler
 * Processes incoming webhooks from external services
 */

import crypto from "crypto"

export interface WebhookEvent {
  id: string
  source: "github" | "gitlab" | "linear" | "slack"
  type: string
  payload: any
  timestamp: Date
  signature?: string
}

export interface WebhookConfig {
  id: string
  url: string
  secret: string
  events: string[]
  active: boolean
}

class WebhookHandler {
  private webhooks: Map<string, WebhookConfig> = new Map()

  /**
   * Register a webhook
   */
  registerWebhook(config: WebhookConfig): void {
    this.webhooks.set(config.id, config)
  }

  /**
   * Get a webhook by ID
   */
  getWebhook(id: string): WebhookConfig | undefined {
    return this.webhooks.get(id)
  }

  /**
   * Get all webhooks
   */
  getAllWebhooks(): WebhookConfig[] {
    return Array.from(this.webhooks.values())
  }

  /**
   * Remove a webhook
   */
  removeWebhook(id: string): boolean {
    return this.webhooks.delete(id)
  }

  /**
   * Verify webhook signature
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const hmac = crypto.createHmac("sha256", secret)
    hmac.update(payload)
    const digest = hmac.digest("hex")
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
  }

  /**
   * Process incoming webhook
   */
  async processWebhook(event: WebhookEvent): Promise<boolean> {
    const activeWebhooks = this.getAllWebhooks().filter(w => w.active)

    for (const webhook of activeWebhooks) {
      // Check if this webhook is interested in this event
      if (!webhook.events.includes(event.type)) {
        continue
      }

      // Verify signature if provided
      if (event.signature && webhook.secret) {
        const isValid = this.verifySignature(
          JSON.stringify(event.payload),
          event.signature,
          webhook.secret
        )
        if (!isValid) {
          console.error(`Invalid signature for webhook ${webhook.id}`)
          continue
        }
      }

      // Send webhook to configured URL
      try {
        await fetch(webhook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Source": event.source,
            "X-Webhook-Event": event.type,
            "X-Webhook-ID": event.id
          },
          body: JSON.stringify({
            event: event.type,
            source: event.source,
            payload: event.payload,
            timestamp: event.timestamp
          })
        })
      } catch (error) {
        console.error(`Failed to send webhook to ${webhook.url}:`, error)
      }
    }

    return true
  }

  /**
   * Handle GitHub webhook
   */
  async handleGitHubWebhook(payload: any, signature: string): Promise<void> {
    const event: WebhookEvent = {
      id: crypto.randomUUID(),
      source: "github",
      type: payload.action || "unknown",
      payload,
      timestamp: new Date(),
      signature
    }

    await this.processWebhook(event)
  }

  /**
   * Handle GitLab webhook
   */
  async handleGitLabWebhook(payload: any, signature: string): Promise<void> {
    const event: WebhookEvent = {
      id: crypto.randomUUID(),
      source: "gitlab",
      type: payload.object_kind || "unknown",
      payload,
      timestamp: new Date(),
      signature
    }

    await this.processWebhook(event)
  }

  /**
   * Handle Linear webhook
   */
  async handleLinearWebhook(payload: any, signature: string): Promise<void> {
    const event: WebhookEvent = {
      id: crypto.randomUUID(),
      source: "linear",
      type: payload.action || "unknown",
      payload,
      timestamp: new Date(),
      signature
    }

    await this.processWebhook(event)
  }
}

export const webhookHandler = new WebhookHandler()
