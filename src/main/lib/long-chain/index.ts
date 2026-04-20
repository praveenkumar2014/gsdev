/**
 * Long-Chain Workflow Module
 * Enables multi-step agent workflows that can span multiple sessions
 */

export * from './workflow-engine'

import { WorkflowEngine, Workflow, WorkflowStep } from './workflow-engine'

/**
 * Workflow templates
 */
export const workflowTemplates: Record<
  string,
  {
    name: string
    description: string
    steps: Omit<WorkflowStep, 'id' | 'status'>[]
  }
> = {
  'code-review': {
    name: 'Code Review Workflow',
    description: 'Automated code review with multiple checks',
    steps: [
      {
        agent: 'claude',
        prompt: 'Review the code for security vulnerabilities',
        dependencies: [],
      },
      {
        agent: 'claude',
        prompt: 'Review the code for performance issues',
        dependencies: [],
      },
      {
        agent: 'claude',
        prompt: 'Review the code for best practices and style',
        dependencies: [],
      },
      {
        agent: 'claude',
        prompt: 'Generate a summary report of all findings',
        dependencies: [],
      },
    ],
  },
  'feature-development': {
    name: 'Feature Development Workflow',
    description: 'Complete feature development from requirements to testing',
    steps: [
      {
        agent: 'claude',
        prompt: 'Analyze requirements and create technical specification',
        dependencies: [],
      },
      {
        agent: 'claude',
        prompt: 'Implement the feature according to specification',
        dependencies: [],
      },
      {
        agent: 'claude',
        prompt: 'Write unit tests for the implemented feature',
        dependencies: [],
      },
      {
        agent: 'claude',
        prompt: 'Run tests and fix any failures',
        dependencies: [],
      },
      {
        agent: 'claude',
        prompt: 'Generate documentation for the feature',
        dependencies: [],
      },
    ],
  },
  'bug-fix': {
    name: 'Bug Fix Workflow',
    description: 'Systematic bug fixing process',
    steps: [
      {
        agent: 'claude',
        prompt: 'Analyze the bug and identify root cause',
        dependencies: [],
      },
      {
        agent: 'claude',
        prompt: 'Propose and implement a fix',
        dependencies: [],
      },
      {
        agent: 'claude',
        prompt: 'Write regression tests',
        dependencies: [],
      },
      {
        agent: 'claude',
        prompt: 'Verify the fix resolves the issue',
        dependencies: [],
      },
    ],
  },
}

/**
 * Create workflow from template
 */
export function createWorkflowFromTemplate(
  templateId: string,
  context?: Record<string, any>
): Workflow {
  const template = workflowTemplates[templateId]

  if (!template) {
    throw new Error(`Template ${templateId} not found`)
  }

  const engine = getWorkflowEngine()
  return engine.createWorkflow({
    name: template.name,
    description: template.description,
    steps: template.steps,
    context,
  })
}

/**
 * List available templates
 */
export function listWorkflowTemplates() {
  return Object.keys(workflowTemplates).map((key) => ({
    id: key,
    ...workflowTemplates[key],
  }))
}
