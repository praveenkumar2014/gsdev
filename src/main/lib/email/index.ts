/**
 * Email Integration Module
 * Unified interface for email operations
 */

export * from './sendgrid'

import {
  sendWelcomeEmail as sendgridWelcomeEmail,
  sendSubscriptionReceipt as sendgridReceipt,
  sendPasswordResetEmail as sendgridPasswordReset,
  sendPaymentFailedEmail as sendgridPaymentFailed,
  sendCancellationEmail as sendgridCancellation,
} from './sendgrid'

export type EmailProvider = 'sendgrid' | null

/**
 * Get configured email provider
 */
export function getEmailProvider(): EmailProvider {
  if (process.env.SENDGRID_API_KEY) {
    return 'sendgrid'
  }
  return null
}

/**
 * Send welcome email (provider-agnostic)
 */
export async function sendWelcomeEmail(params: {
  to: string
  firstName?: string
}) {
  const provider = getEmailProvider()

  if (provider === 'sendgrid') {
    return sendgridWelcomeEmail(params)
  }

  console.log('[Email] No email provider configured, skipping welcome email')
  return null
}

/**
 * Send subscription receipt (provider-agnostic)
 */
export async function sendSubscriptionReceipt(params: {
  to: string
  plan: string
  amount: number
  billingDate: Date
}) {
  const provider = getEmailProvider()

  if (provider === 'sendgrid') {
    return sendgridReceipt(params)
  }

  console.log('[Email] No email provider configured, skipping receipt email')
  return null
}

/**
 * Send password reset email (provider-agnostic)
 */
export async function sendPasswordResetEmail(params: {
  to: string
  resetToken: string
  resetUrl: string
}) {
  const provider = getEmailProvider()

  if (provider === 'sendgrid') {
    return sendgridPasswordReset(params)
  }

  console.log('[Email] No email provider configured, skipping password reset email')
  return null
}

/**
 * Send payment failed notification (provider-agnostic)
 */
export async function sendPaymentFailedEmail(params: {
  to: string
  plan: string
  amount: number
  retryDate: Date
}) {
  const provider = getEmailProvider()

  if (provider === 'sendgrid') {
    return sendgridPaymentFailed(params)
  }

  console.log('[Email] No email provider configured, skipping payment failed email')
  return null
}

/**
 * Send cancellation confirmation (provider-agnostic)
 */
export async function sendCancellationEmail(params: {
  to: string
  plan: string
  cancellationDate: Date
}) {
  const provider = getEmailProvider()

  if (provider === 'sendgrid') {
    return sendgridCancellation(params)
  }

  console.log('[Email] No email provider configured, skipping cancellation email')
  return null
}
