/**
 * CRM Integration Module
 * Unified interface for CRM operations
 */

export * from './hubspot'

import { trackSignup as hubspotTrackSignup, trackSubscription as hubspotTrackSubscription } from './hubspot'

export type CRMProvider = 'hubspot' | null

/**
 * Get configured CRM provider
 */
export function getCRMProvider(): CRMProvider {
  if (process.env.HUBSPOT_API_KEY) {
    return 'hubspot'
  }
  return null
}

/**
 * Track signup event (provider-agnostic)
 */
export async function trackSignup(params: {
  email: string
  firstName?: string
  lastName?: string
  userId: string
}) {
  const provider = getCRMProvider()

  if (provider === 'hubspot') {
    return hubspotTrackSignup(params)
  }

  console.log('[CRM] No CRM provider configured, skipping signup tracking')
  return null
}

/**
 * Track subscription purchase (provider-agnostic)
 */
export async function trackSubscription(params: {
  email: string
  plan: string
  amount: number
  userId: string
}) {
  const provider = getCRMProvider()

  if (provider === 'hubspot') {
    return hubspotTrackSubscription(params)
  }

  console.log('[CRM] No CRM provider configured, skipping subscription tracking')
  return null
}
