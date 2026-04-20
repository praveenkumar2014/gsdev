/**
 * Connector Manager
 * Manages external service connections (GitHub, GitLab, Linear, Slack, etc.)
 */

export interface ConnectorConfig {
  id: string
  type: "github" | "gitlab" | "linear" | "slack" | "jira" | "notion"
  name: string
  apiKey: string
  webhookUrl?: string
  settings: Record<string, any>
}

export interface ConnectorStatus {
  connected: boolean
  lastSync?: Date
  error?: string
}

class ConnectorManager {
  private connectors: Map<string, ConnectorConfig> = new Map()

  /**
   * Register a new connector
   */
  registerConnector(config: ConnectorConfig): void {
    this.connectors.set(config.id, config)
  }

  /**
   * Get a connector by ID
   */
  getConnector(id: string): ConnectorConfig | undefined {
    return this.connectors.get(id)
  }

  /**
   * Get all connectors
   */
  getAllConnectors(): ConnectorConfig[] {
    return Array.from(this.connectors.values())
  }

  /**
   * Remove a connector
   */
  removeConnector(id: string): boolean {
    return this.connectors.delete(id)
  }

  /**
   * Test connection to a service
   */
  async testConnection(config: ConnectorConfig): Promise<ConnectorStatus> {
    try {
      switch (config.type) {
        case "github":
          return await this.testGitHubConnection(config)
        case "gitlab":
          return await this.testGitLabConnection(config)
        case "linear":
          return await this.testLinearConnection(config)
        case "slack":
          return await this.testSlackConnection(config)
        default:
          throw new Error(`Unsupported connector type: ${config.type}`)
      }
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  /**
   * Test GitHub connection
   */
  private async testGitHubConnection(config: ConnectorConfig): Promise<ConnectorStatus> {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "User-Agent": "GSDEV"
      }
    })

    if (response.ok) {
      return {
        connected: true,
        lastSync: new Date()
      }
    }

    throw new Error(`GitHub API error: ${response.status}`)
  }

  /**
   * Test GitLab connection
   */
  private async testGitLabConnection(config: ConnectorConfig): Promise<ConnectorStatus> {
    const response = await fetch(`${config.settings.baseUrl || "https://gitlab.com"}/api/v4/user`, {
      headers: {
        "PRIVATE-TOKEN": config.apiKey
      }
    })

    if (response.ok) {
      return {
        connected: true,
        lastSync: new Date()
      }
    }

    throw new Error(`GitLab API error: ${response.status}`)
  }

  /**
   * Test Linear connection
   */
  private async testLinearConnection(config: ConnectorConfig): Promise<ConnectorStatus> {
    const response = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        Authorization: config.apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: "{ viewer { id } }"
      })
    })

    if (response.ok) {
      return {
        connected: true,
        lastSync: new Date()
      }
    }

    throw new Error(`Linear API error: ${response.status}`)
  }

  /**
   * Test Slack connection
   */
  private async testSlackConnection(config: ConnectorConfig): Promise<ConnectorStatus> {
    const response = await fetch("https://slack.com/api/auth.test", {
      headers: {
        Authorization: `Bearer ${config.apiKey}`
      }
    })

    const data = await response.json()

    if (data.ok) {
      return {
        connected: true,
        lastSync: new Date()
      }
    }

    throw new Error(`Slack API error: ${data.error}`)
  }

  /**
   * Sync data from a connector
   */
  async syncConnector(id: string): Promise<any> {
    const connector = this.getConnector(id)
    if (!connector) {
      throw new Error("Connector not found")
    }

    // Implement sync logic based on connector type
    // This would fetch data from the external service
    return { success: true, syncedAt: new Date() }
  }
}

export const connectorManager = new ConnectorManager()
