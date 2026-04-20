/**
 * Razorpay Payment Integration
 * Handles UPI payments for India
 */

import crypto from 'crypto'

// Razorpay SDK would be installed via: npm install razorpay
// For now, we'll use direct API calls

const RAZORPAY_BASE_URL = 'https://api.razorpay.com/v1'

/**
 * Create a Razorpay order
 */
export async function createOrder(params: {
  amount: number // Amount in paise (1 INR = 100 paise)
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay not configured')
  }

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString('base64')

  const response = await fetch(`${RAZORPAY_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency || 'INR',
      receipt: params.receipt,
      notes: params.notes,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create Razorpay order')
  }

  const order = await response.json()
  return order
}

/**
 * Verify Razorpay payment signature
 */
export function verifyPaymentSignature(params: {
  orderId: string
  paymentId: string
  signature: string
}): boolean {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return false
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest('hex')

  return generatedSignature === params.signature
}

/**
 * Get payment details
 */
export async function getPayment(paymentId: string) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay not configured')
  }

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString('base64')

  const response = await fetch(`${RAZORPAY_BASE_URL}/payments/${paymentId}`, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch payment details')
  }

  const payment = await response.json()
  return payment
}

/**
 * Create UPI payment link
 */
export async function createUpiLink(params: {
  amount: number
  description: string
  customerId?: string
  customerEmail?: string
  customerContact?: string
}) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay not configured')
  }

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString('base64')

  const response = await fetch(`${RAZORPAY_BASE_URL}/payment_links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: 'INR',
      accept_upi: true,
      description: params.description,
      customer: {
        name: params.customerId,
        email: params.customerEmail,
        contact: params.customerContact,
      },
      notes: {
        type: 'subscription',
      },
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create UPI payment link')
  }

  const paymentLink = await response.json()
  return paymentLink
}

/**
 * Get Razorpay key ID (for frontend)
 */
export function getRazorpayKeyId(): string | null {
  return process.env.RAZORPAY_KEY_ID || null
}
