/**
 * SendGrid Email Integration
 * Handles transactional emails
 */

// SendGrid SDK would be installed via: npm install @sendgrid/mail
// For now, we'll use direct API calls

const SENDGRID_BASE_URL = 'https://api.sendgrid.com/v3'

/**
 * Send an email
 */
export async function sendEmail(params: {
  to: string
  subject: string
  htmlContent?: string
  textContent?: string
  templateId?: string
  dynamicTemplateData?: Record<string, any>
}) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('[SendGrid] SENDGRID_API_KEY not configured')
    return null
  }

  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@gsdev.dev'

  const body: any = {
    personalizations: [
      {
        to: [{ email: params.to }],
        subject: params.subject,
        ...(params.dynamicTemplateData && {
          dynamic_template_data: params.dynamicTemplateData,
        }),
      },
    ],
    from: { email: fromEmail },
    subject: params.subject,
  }

  if (params.templateId) {
    body.template_id = params.templateId
  } else {
    body.content = []
    if (params.htmlContent) {
      body.content.push({
        type: 'text/html',
        value: params.htmlContent,
      })
    }
    if (params.textContent) {
      body.content.push({
        type: 'text/plain',
        value: params.textContent,
      })
    }
  }

  const response = await fetch(`${SENDGRID_BASE_URL}/mail/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to send email: ${error}`)
  }

  return { success: true, messageId: response.headers.get('x-message-id') }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(params: {
  to: string
  firstName?: string
}) {
  return sendEmail({
    to: params.to,
    subject: 'Welcome to GSDEV!',
    templateId: 'd-welcome-template-id', // Replace with actual template ID
    dynamicTemplateData: {
      firstName: params.firstName || 'there',
      loginUrl: 'https://gsdev.dev/login',
    },
  })
}

/**
 * Send subscription receipt
 */
export async function sendSubscriptionReceipt(params: {
  to: string
  plan: string
  amount: number
  billingDate: Date
}) {
  return sendEmail({
    to: params.to,
    subject: 'Your GSDEV Subscription Receipt',
    templateId: 'd-receipt-template-id', // Replace with actual template ID
    dynamicTemplateData: {
      plan: params.plan,
      amount: params.amount.toFixed(2),
      billingDate: params.billingDate.toISOString().split('T')[0],
      invoiceUrl: 'https://gsdev.dev/invoices',
    },
  })
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(params: {
  to: string
  resetToken: string
  resetUrl: string
}) {
  return sendEmail({
    to: params.to,
    subject: 'Reset Your GSDEV Password',
    templateId: 'd-password-reset-template-id', // Replace with actual template ID
    dynamicTemplateData: {
      resetUrl: `${params.resetUrl}?token=${params.resetToken}`,
      expiryHours: 24,
    },
  })
}

/**
 * Send payment failed notification
 */
export async function sendPaymentFailedEmail(params: {
  to: string
  plan: string
  amount: number
  retryDate: Date
}) {
  return sendEmail({
    to: params.to,
    subject: 'Payment Failed - Action Required',
    templateId: 'd-payment-failed-template-id', // Replace with actual template ID
    dynamicTemplateData: {
      plan: params.plan,
      amount: params.amount.toFixed(2),
      retryDate: params.retryDate.toISOString().split('T')[0],
      updatePaymentUrl: 'https://gsdev.dev/settings/billing',
    },
  })
}

/**
 * Send subscription cancellation confirmation
 */
export async function sendCancellationEmail(params: {
  to: string
  plan: string
  cancellationDate: Date
}) {
  return sendEmail({
    to: params.to,
    subject: 'Your GSDEV Subscription Has Been Cancelled',
    templateId: 'd-cancellation-template-id', // Replace with actual template ID
    dynamicTemplateData: {
      plan: params.plan,
      cancellationDate: params.cancellationDate.toISOString().split('T')[0],
      reactivateUrl: 'https://gsdev.dev/settings/billing',
    },
  })
}
