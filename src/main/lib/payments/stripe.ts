/**
 * Stripe Payment Integration
 * Handles subscription billing, payment processing, and webhook events
 */

import Stripe from 'stripe'

// Initialize Stripe client
let stripeClient: Stripe | null = null

export function getStripeClient(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('[Stripe] STRIPE_SECRET_KEY not configured')
    return null
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  }

  return stripeClient
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(params: {
  customerId?: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  const stripe = getStripeClient()
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    customer: params.customerId,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  })

  return session
}

/**
 * Create a customer
 */
export async function createCustomer(params: {
  email: string
  name?: string
  metadata?: Record<string, string>
}) {
  const stripe = getStripeClient()
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata,
  })

  return customer
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  const stripe = getStripeClient()
  if (!stripe) {
    return null
  }

  const customers = await stripe.customers.list({
    email,
    limit: 1,
  })

  return customers.data[0] || null
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  const stripe = getStripeClient()
  if (!stripe) {
    return null
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const stripe = getStripeClient()
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      return handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)

    case 'customer.subscription.created':
      return handleSubscriptionCreated(event.data.object as Stripe.Subscription)

    case 'customer.subscription.updated':
      return handleSubscriptionUpdated(event.data.object as Stripe.Subscription)

    case 'customer.subscription.deleted':
      return handleSubscriptionDeleted(event.data.object as Stripe.Subscription)

    case 'invoice.payment_succeeded':
      return handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)

    case 'invoice.payment_failed':
      return handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)

    default:
      console.log(`[Stripe] Unhandled event type: ${event.type}`)
      return { received: true }
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('[Stripe] Checkout completed:', session.id)
  // TODO: Update user subscription status in database
  // TODO: Send welcome email
  return { received: true }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('[Stripe] Subscription created:', subscription.id)
  // TODO: Store subscription in database
  return { received: true }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('[Stripe] Subscription updated:', subscription.id)
  // TODO: Update subscription in database
  return { received: true }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('[Stripe] Subscription deleted:', subscription.id)
  // TODO: Update user subscription status in database
  // TODO: Send cancellation email
  return { received: true }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('[Stripe] Invoice payment succeeded:', invoice.id)
  // TODO: Send receipt email
  return { received: true }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('[Stripe] Invoice payment failed:', invoice.id)
  // TODO: Send payment failed notification
  // TODO: Update subscription status
  return { received: true }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): Stripe.Event | null {
  const stripe = getStripeClient()
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return null
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
    return event
  } catch (error) {
    console.error('[Stripe] Webhook signature verification failed:', error)
    return null
  }
}

/**
 * Get available pricing plans
 */
export async function getPricingPlans() {
  const stripe = getStripeClient()
  if (!stripe) {
    return []
  }

  const prices = await stripe.prices.list({
    active: true,
    expand: ['data.product'],
  })

  return prices.data.map((price) => ({
    id: price.id,
    productId: price.product as string,
    amount: price.unit_amount || 0,
    currency: price.currency,
    interval: price.recurring?.interval || 'month',
    productName: typeof price.product === 'object' ? price.product.name : 'Unknown',
  }))
}
