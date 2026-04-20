/**
 * HubSpot CRM Integration
 * Handles contact management, deal tracking, and activity logging
 */

// HubSpot Node.js SDK would be installed via: npm install @hubspot/api-client
// For now, we'll use direct API calls

const HUBSPOT_BASE_URL = 'https://api.hubapi.com'

/**
 * Create or update a contact
 */
export async function createOrUpdateContact(params: {
  email: string
  firstName?: string
  lastName?: string
  userId?: string
  metadata?: Record<string, string>
}) {
  if (!process.env.HUBSPOT_API_KEY) {
    console.warn('[HubSpot] HUBSPOT_API_KEY not configured')
    return null
  }

  // First, try to find existing contact by email
  const existingContact = await getContactByEmail(params.email)

  const contactData = {
    properties: {
      email: params.email,
      firstname: params.firstName || '',
      lastname: params.lastName || '',
      gsdev_user_id: params.userId || '',
      ...params.metadata,
    },
  }

  let contact

  if (existingContact) {
    // Update existing contact
    const response = await fetch(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/${existingContact.id}?hapikey=${process.env.HUBSPOT_API_KEY}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update HubSpot contact')
    }

    contact = await response.json()
  } else {
    // Create new contact
    const response = await fetch(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts?hapikey=${process.env.HUBSPOT_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to create HubSpot contact')
    }

    contact = await response.json()
  }

  return contact
}

/**
 * Get contact by email
 */
export async function getContactByEmail(email: string) {
  if (!process.env.HUBSPOT_API_KEY) {
    return null
  }

  const response = await fetch(
    `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/${email}?idProperty=email&hapikey=${process.env.HUBSPOT_API_KEY}`
  )

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error('Failed to fetch HubSpot contact')
  }

  const contact = await response.json()
  return contact
}

/**
 * Create a deal
 */
export async function createDeal(params: {
  contactId: string
  dealName: string
  amount?: number
  dealStage?: string
  subscriptionPlan?: string
  metadata?: Record<string, string>
}) {
  if (!process.env.HUBSPOT_API_KEY) {
    console.warn('[HubSpot] HUBSPOT_API_KEY not configured')
    return null
  }

  const dealData = {
    properties: {
      dealname: params.dealName,
      amount: params.amount ? params.amount.toString() : '0',
      dealstage: params.dealStage || 'appointmentscheduled',
      subscription_plan: params.subscriptionPlan || '',
      ...params.metadata,
    },
    associations: [
      {
        to: {
          id: params.contactId,
        },
        types: [
          {
            associationCategory: 'HUBSPOT_ASSOCIATION',
            associationTypeId: 3, // Contact to Deal association type
          },
        ],
      },
    ],
  }

  const response = await fetch(
    `${HUBSPOT_BASE_URL}/crm/v3/objects/deals?hapikey=${process.env.HUBSPOT_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dealData),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to create HubSpot deal')
  }

  const deal = await response.json()
  return deal
}

/**
 * Log an activity
 */
export async function logActivity(params: {
  contactId?: string
  dealId?: string
  activityType: string
  title: string
  body?: string
  metadata?: Record<string, string>
}) {
  if (!process.env.HUBSPOT_API_KEY) {
    console.warn('[HubSpot] HUBSPOT_API_KEY not configured')
    return null
  }

  const activityData = {
    activityTypeId: params.activityType,
    engagement: {
      active: true,
      type: 'NOTE',
      metadata: params.metadata,
    },
    associations: {
      contactIds: params.contactId ? [params.contactId] : [],
      dealIds: params.dealId ? [params.dealId] : [],
    },
    body: params.body || '',
  }

  const response = await fetch(
    `${HUBSPOT_BASE_URL}/crm/v3/objects/engagements?hapikey=${process.env.HUBSPOT_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to log HubSpot activity')
  }

  const activity = await response.json()
  return activity
}

/**
 * Update deal stage
 */
export async function updateDealStage(params: {
  dealId: string
  dealStage: string
  amount?: number
}) {
  if (!process.env.HUBSPOT_API_KEY) {
    console.warn('[HubSpot] HUBSPOT_API_KEY not configured')
    return null
  }

  const dealData = {
    properties: {
      dealstage: params.dealStage,
      ...(params.amount && { amount: params.amount.toString() }),
    },
  }

  const response = await fetch(
    `${HUBSPOT_BASE_URL}/crm/v3/objects/deals/${params.dealId}?hapikey=${process.env.HUBSPOT_API_KEY}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dealData),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to update HubSpot deal')
  }

  const deal = await response.json()
  return deal
}

/**
 * Track signup event
 */
export async function trackSignup(params: {
  email: string
  firstName?: string
  lastName?: string
  userId: string
}) {
  // Create or update contact
  const contact = await createOrUpdateContact({
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName,
    userId: params.userId,
  })

  if (contact) {
    // Log signup activity
    await logActivity({
      contactId: contact.id,
      activityType: 'NOTE',
      title: 'User Signup',
      body: `User signed up for GSDEV`,
      metadata: {
        userId: params.userId,
        timestamp: new Date().toISOString(),
      },
    })
  }

  return contact
}

/**
 * Track subscription purchase
 */
export async function trackSubscription(params: {
  email: string
  plan: string
  amount: number
  userId: string
}) {
  // Get or create contact
  const contact = await createOrUpdateContact({
    email: params.email,
    userId: params.userId,
  })

  if (contact) {
    // Create deal
    const deal = await createDeal({
      contactId: contact.id,
      dealName: `${params.plan} Subscription`,
      amount: params.amount,
      dealStage: 'closedwon',
      subscriptionPlan: params.plan,
    })

    // Log purchase activity
    await logActivity({
      contactId: contact.id,
      dealId: deal?.id,
      activityType: 'NOTE',
      title: 'Subscription Purchased',
      body: `User purchased ${params.plan} subscription for ${params.amount}`,
      metadata: {
        plan: params.plan,
        amount: params.amount.toString(),
        userId: params.userId,
        timestamp: new Date().toISOString(),
      },
    })
  }

  return contact
}
