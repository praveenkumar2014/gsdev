/**
 * MCP Server for Browser Automation
 * Provides Model Context Protocol server for Playwright and Selenium
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { getPlaywrightHandler } from './playwright-handler'
import { getSeleniumHandler } from './selenium-handler'

const server = new Server(
  {
    name: 'browser-automation',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'playwright_navigate',
        description: 'Navigate to a URL using Playwright',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to navigate to',
            },
            headless: {
              type: 'boolean',
              description: 'Run in headless mode',
              default: true,
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'playwright_click',
        description: 'Click an element using Playwright',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector for the element',
            },
            timeout: {
              type: 'number',
              description: 'Timeout in milliseconds',
              default: 10000,
            },
          },
          required: ['selector'],
        },
      },
      {
        name: 'playwright_fill',
        description: 'Fill a form field using Playwright',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector for the element',
            },
            value: {
              type: 'string',
              description: 'Value to fill',
            },
            timeout: {
              type: 'number',
              description: 'Timeout in milliseconds',
              default: 10000,
            },
          },
          required: ['selector', 'value'],
        },
      },
      {
        name: 'playwright_screenshot',
        description: 'Take a screenshot using Playwright',
        inputSchema: {
          type: 'object',
          properties: {
            fullPage: {
              type: 'boolean',
              description: 'Capture full page',
              default: false,
            },
          },
        },
      },
      {
        name: 'playwright_text',
        description: 'Extract text from an element using Playwright',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector for the element',
            },
          },
          required: ['selector'],
        },
      },
      {
        name: 'selenium_navigate',
        description: 'Navigate to a URL using Selenium',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to navigate to',
            },
            headless: {
              type: 'boolean',
              description: 'Run in headless mode',
              default: true,
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'selenium_click',
        description: 'Click an element using Selenium',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector for the element',
            },
            timeout: {
              type: 'number',
              description: 'Timeout in milliseconds',
              default: 10000,
            },
          },
          required: ['selector'],
        },
      },
      {
        name: 'selenium_fill',
        description: 'Fill a form field using Selenium',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector for the element',
            },
            value: {
              type: 'string',
              description: 'Value to fill',
            },
            timeout: {
              type: 'number',
              description: 'Timeout in milliseconds',
              default: 10000,
            },
          },
          required: ['selector', 'value'],
        },
      },
      {
        name: 'selenium_screenshot',
        description: 'Take a screenshot using Selenium',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'selenium_text',
        description: 'Extract text from an element using Selenium',
        inputSchema: {
          type: 'object',
          properties: {
            selector: {
              type: 'string',
              description: 'CSS selector for the element',
            },
          },
          required: ['selector'],
        },
      },
    ],
  }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case 'playwright_navigate': {
        const handler = getPlaywrightHandler()
        const result = await handler.handle({
          action: 'goto',
          url: args.url as string,
          headless: args.headless as boolean,
        })
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }

      case 'playwright_click': {
        const handler = getPlaywrightHandler()
        const result = await handler.handle({
          action: 'click',
          selector: args.selector as string,
          timeout: args.timeout as number,
        })
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }

      case 'playwright_fill': {
        const handler = getPlaywrightHandler()
        const result = await handler.handle({
          action: 'fill',
          selector: args.selector as string,
          value: args.value as string,
          timeout: args.timeout as number,
        })
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }

      case 'playwright_screenshot': {
        const handler = getPlaywrightHandler()
        const result = await handler.handle({
          action: 'screenshot',
        })
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }

      case 'playwright_text': {
        const handler = getPlaywrightHandler()
        const result = await handler.handle({
          action: 'text',
          selector: args.selector as string,
        })
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }

      case 'selenium_navigate': {
        const handler = getSeleniumHandler()
        const result = await handler.handle({
          action: 'goto',
          url: args.url as string,
          headless: args.headless as boolean,
        })
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }

      case 'selenium_click': {
        const handler = getSeleniumHandler()
        const result = await handler.handle({
          action: 'click',
          selector: args.selector as string,
          timeout: args.timeout as number,
        })
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }

      case 'selenium_fill': {
        const handler = getSeleniumHandler()
        const result = await handler.handle({
          action: 'fill',
          selector: args.selector as string,
          value: args.value as string,
          timeout: args.timeout as number,
        })
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }

      case 'selenium_screenshot': {
        const handler = getSeleniumHandler()
        const result = await handler.handle({
          action: 'screenshot',
        })
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }

      case 'selenium_text': {
        const handler = getSeleniumHandler()
        const result = await handler.handle({
          action: 'text',
          selector: args.selector as string,
        })
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result),
            },
          ],
        }
      }

      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : String(error),
          }),
        },
      ],
      isError: true,
    }
  }
})

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Browser Automation MCP Server running')
}

main().catch((error) => {
  console.error('Failed to start MCP server:', error)
  process.exit(1)
})
