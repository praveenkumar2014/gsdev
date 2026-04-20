/**
 * Webhook Server
 * Express server for handling webhook events from external services
 */

import express from 'express'
import crypto from 'crypto'
import { handleWebhookEvent, verifyWebhookSignature as verifyStripeSignature } from '../payments/stripe'
import { verifyPaymentSignature as verifyRazorpaySignature } from '../payments/razorpay'

const app = express()
const PORT = process.env.WEBHOOK_PORT || 3001

// Middleware to parse JSON
app.use(express.raw({ type: 'application/json' }))

/**
 * Verify webhook signature
 */
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const digest = hmac.digest('hex')
  return digest === signature
}

/**
 * Stripe webhook endpoint
 */
app.post('/webhooks/stripe', async (req, res) => {
  const payload = req.body.toString()
  const signature = req.headers['stripe-signature'] as string

  if (!signature) {
    return res.status(400).json({ error: 'Missing signature' })
  }

  const event = verifyStripeSignature(payload, signature)

  if (!event) {
    return res.status(400).json({ error: 'Invalid signature' })
  }

  try {
    await handleWebhookEvent(event)
    res.json({ received: true })
  } catch (error) {
    console.error('[Webhook] Error handling Stripe webhook:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

/**
 * Razorpay webhook endpoint
 */
app.post('/webhooks/razorpay', async (req, res) => {
  const payload = req.body.toString()
  const signature = req.headers['x-razorpay-signature'] as string

  if (!signature) {
    return res.status(400).json({ error: 'Missing signature' })
  }

  if (!process.env.WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Webhook secret not configured' })
  }

  const isValid = verifySignature(payload, signature, process.env.WEBHOOK_SECRET)

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid signature' })
  }

  try {
    const data = JSON.parse(payload)

    // Verify Razorpay payment signature
    if (data.payment && data.order) {
      const isValidPayment = verifyRazorpaySignature({
        orderId: data.order.id,
        paymentId: data.payment.id,
        signature: data.payment.signature,
      })

      if (!isValidPayment) {
        return res.status(400).json({ error: 'Invalid payment signature' })
      }
    }

    // TODO: Handle Razorpay webhook event
    console.log('[Webhook] Razorpay webhook received:', data)

    res.json({ received: true })
  } catch (error) {
    console.error('[Webhook] Error handling Razorpay webhook:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

/**
 * GitHub webhook endpoint
 */
app.post('/webhooks/github', async (req, res) => {
  const payload = req.body.toString()
  const signature = req.headers['x-hub-signature-256'] as string

  if (!signature) {
    return res.status(400).json({ error: 'Missing signature' })
  }

  if (!process.env.GITHUB_WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'GitHub webhook secret not configured' })
  }

  const isValid = verifySignature(payload, signature, process.env.GITHUB_WEBHOOK_SECRET)

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid signature' })
  }

  try {
    const data = JSON.parse(payload)

    // TODO: Handle GitHub webhook event
    console.log('[Webhook] GitHub webhook received:', data)

    res.json({ received: true })
  } catch (error) {
    console.error('[Webhook] Error handling GitHub webhook:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

/**
 * Linear webhook endpoint
 */
app.post('/webhooks/linear', async (req, res) => {
  const signature = req.headers['linear-signature'] as string

  if (!signature) {
    return res.status(400).json({ error: 'Missing signature' })
  }

  if (!process.env.LINEAR_API_KEY) {
    return res.status(500).json({ error: 'Linear API key not configured' })
  }

  // TODO: Implement Linear signature verification
  console.log('[Webhook] Linear webhook received')

  try {
    const data = req.body

    // TODO: Handle Linear webhook event
    console.log('[Webhook] Linear webhook data:', data)

    res.json({ received: true })
  } catch (error) {
    console.error('[Webhook] Error handling Linear webhook:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

/**
 * Slack webhook endpoint
 */
app.post('/webhooks/slack', async (req, res) => {
  const signature = req.headers['x-slack-signature'] as string
  const timestamp = req.headers['x-slack-request-timestamp'] as string

  if (!signature || !timestamp) {
    return res.status(400).json({ error: 'Missing signature or timestamp' })
  }

  if (!process.env.SLACK_SIGNING_SECRET) {
    return res.status(500).json({ error: 'Slack signing secret not configured' })
  }

  // TODO: Implement Slack signature verification
  console.log('[Webhook] Slack webhook received')

  try {
    const data = req.body

    // TODO: Handle Slack webhook event
    console.log('[Webhook] Slack webhook data:', data)

    res.json({ received: true })
  } catch (error) {
    console.error('[Webhook] Error handling Slack webhook:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

/**
 * Generic webhook endpoint
 */
app.post('/webhooks/generic', async (req, res) => {
  const signature = req.headers['x-webhook-signature'] as string

  if (!signature) {
    return res.status(400).json({ error: 'Missing signature' })
  }

  if (!process.env.WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Webhook secret not configured' })
  }

  const payload = req.body.toString()
  const isValid = verifySignature(payload, signature, process.env.WEBHOOK_SECRET)

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid signature' })
  }

  try {
    const data = JSON.parse(payload)

    // TODO: Handle generic webhook event
    console.log('[Webhook] Generic webhook received:', data)

    res.json({ received: true })
  } catch (error) {
    console.error('[Webhook] Error handling generic webhook:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/**
 * Start webhook server
 */
export function startWebhookServer() {
  app.listen(PORT, () => {
    console.log(`[Webhook] Server running on port ${PORT}`)
  })
}

/**
 * Express app (for testing or custom mounting)
 */
export { app as webhookApp }
