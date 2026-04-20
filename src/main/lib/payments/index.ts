/**
 * Payment Integration Module
 * Unified interface for payment processing (Stripe & Razorpay)
 */

export * from './stripe'
export * from './razorpay'

import { createCheckoutSession as stripeCreateCheckoutSession } from './stripe'
import { createOrder as razorpayCreateOrder } from './razorpay'

export type PaymentProvider = 'stripe' | 'razorpay'

/**
 * Create a payment session based on provider
 */
export async function createPaymentSession(params: {
  provider: PaymentProvider
  amount: number
  currency?: string
  customerId?: string
  customerEmail?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  if (params.provider === 'stripe') {
    // Stripe uses price IDs, not direct amounts
    // This is a simplified example - in production, you'd have price IDs
    const priceId = params.metadata?.priceId as string
    return stripeCreateCheckoutSession({
      customerId: params.customerId,
      priceId,
      successUrl: params.successUrl,
      cancelUrl: params.cancelUrl,
      metadata: params.metadata,
    })
  } else if (params.provider === 'razorpay') {
    // Razorpay uses direct amounts in paise
    const amountInPaise = params.amount * 100
    return razorpayCreateOrder({
      amount: amountInPaise,
      currency: params.currency || 'INR',
      receipt: params.metadata?.receipt,
      notes: params.metadata,
    })
  }

  throw new Error(`Unsupported payment provider: ${params.provider}`)
}

/**
 * Get supported payment providers
 */
export function getSupportedProviders(): PaymentProvider[] {
  const providers: PaymentProvider[] = []

  if (process.env.STRIPE_SECRET_KEY) {
    providers.push('stripe')
  }

  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    providers.push('razorpay')
  }

  return providers
}
