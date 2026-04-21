/**
 * Devin Cloud AI Provider
 * Integration with Devin's AI software engineer platform
 * https://devin.ai/
 */

export interface DevinMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: string
}

export interface DevinRequest {
  messages: DevinMessage[]
  session_id?: string
  context?: {
    repository?: string
    branch?: string
    files?: string[]
  }
  options?: {
    temperature?: number
    max_tokens?: number
    tools?: string[]
  }
}

export interface DevinResponse {
  id: string
  session_id: string
  message: {
    role: "assistant"
    content: string
    reasoning?: string
  }
  metadata: {
    model: string
    tokens_used: number
    processing_time: number
  }
  tools_used?: string[]
}

export interface DevinSession {
  id: string
  created_at: string
  status: "active" | "completed" | "error"
  messages: DevinMessage[]
  context: {
    repository?: string
    branch?: string
  }
}

const DEVIN_API_BASE = "https://api.devin.ai/v3"

/**
 * Call Devin Cloud API
 */
export async function callDevinAPI(
  apiKey: string,
  request: DevinRequest,
  organizationId?: string
): Promise<DevinResponse> {
  const baseUrl = organizationId
    ? `${DEVIN_API_BASE}/organizations/${organizationId}`
    : DEVIN_API_BASE

  const response = await fetch(`${baseUrl}/sessions/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages: request.messages,
      context: request.context,
      options: {
        temperature: request.options?.temperature || 0.7,
        max_tokens: request.options?.max_tokens || 4096,
        tools: request.options?.tools || [],
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Devin API error: ${response.status} - ${error}`)
  }

  return response.json()
}

/**
 * Create a new Devin session
 */
export async function createDevinSession(
  apiKey: string,
  organizationId?: string,
  context?: {
    repository?: string
    branch?: string
  }
): Promise<DevinSession> {
  const baseUrl = organizationId
    ? `${DEVIN_API_BASE}/organizations/${organizationId}`
    : DEVIN_API_BASE

  const response = await fetch(`${baseUrl}/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      context,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Devin API error: ${response.status} - ${error}`)
  }

  return response.json()
}

/**
 * Get Devin session details
 */
export async function getDevinSession(
  apiKey: string,
  sessionId: string,
  organizationId?: string
): Promise<DevinSession> {
  const baseUrl = organizationId
    ? `${DEVIN_API_BASE}/organizations/${organizationId}`
    : DEVIN_API_BASE

  const response = await fetch(`${baseUrl}/sessions/${sessionId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Devin API error: ${response.status} - ${error}`)
  }

  return response.json()
}

/**
 * List available repositories
 */
export async function listDevinRepos(
  apiKey: string,
  organizationId?: string
): Promise<{ id: string; name: string; url: string }[]> {
  const baseUrl = organizationId
    ? `${DEVIN_API_BASE}/organizations/${organizationId}`
    : DEVIN_API_BASE

  const response = await fetch(`${baseUrl}/repos`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Devin API error: ${response.status} - ${error}`)
  }

  return response.json()
}

/**
 * Convert chat messages to Devin format
 */
export function convertToDevinMessages(messages: Array<{ role: string; content: string }>): DevinMessage[] {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }))
}

/**
 * Available Devin models
 */
export const DEVIN_MODELS = [
  {
    id: "devin-codex-v1",
    name: "Devin Codex v1",
    description: "Devin's specialized coding model",
    contextLength: 128000,
    capabilities: ["code", "debugging", "refactoring"],
  },
  {
    id: "devin-architect-v1",
    name: "Devin Architect v1",
    description: "Architecture and system design specialist",
    contextLength: 128000,
    capabilities: ["architecture", "design", "planning"],
  },
  {
    id: "devin-analyst-v1",
    name: "Devin Analyst v1",
    description: "Code analysis and review specialist",
    contextLength: 128000,
    capabilities: ["analysis", "review", "optimization"],
  },
  {
    id: "devin-auto-v1",
    name: "Devin Auto v1",
    description: "Autonomous task execution model",
    contextLength: 128000,
    capabilities: ["automation", "tasks", "workflow"],
  },
]
