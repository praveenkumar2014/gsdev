import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cpu, Code2, TestTube, FileText, GitBranch, Bug, Wrench, Database, Terminal, Brain, Zap, Shield } from "lucide-react"

export function AgentsPage({ darkMode }: { darkMode: boolean }) {
  const agents = [
    {
      icon: Code2,
      name: "Code Agent",
      description: "Writes, refactors, and debugs code automatically with deep understanding of your project.",
      capabilities: [
        "Feature development from natural language",
        "Bug fixes and error resolution",
        "Code refactoring and optimization",
        "Multi-file editing with context awareness",
        "Language-specific best practices"
      ],
      useCases: ["Building new features", "Fixing bugs", "Refactoring legacy code", "Adding tests"]
    },
    {
      icon: TestTube,
      name: "Testing Agent",
      description: "Generates comprehensive test suites and runs them to ensure code quality.",
      capabilities: [
        "Unit test generation",
        "Integration test creation",
        "E2E test automation",
        "Test coverage analysis",
        "Test failure debugging"
      ],
      useCases: ["Testing new features", "Increasing coverage", "Debugging test failures", "Regression testing"]
    },
    {
      icon: FileText,
      name: "Documentation Agent",
      description: "Creates and maintains documentation for your codebase automatically.",
      capabilities: [
        "API documentation generation",
        "README creation and updates",
        "Inline code documentation",
        "Architecture documentation",
        "Changelog generation"
      ],
      useCases: ["Documenting APIs", "Writing READMEs", "Creating guides", "Maintaining docs"]
    },
    {
      icon: GitBranch,
      name: "Git Agent",
      description: "Manages Git operations including branches, commits, and pull requests.",
      capabilities: [
        "Automatic branch creation",
        "Commit message generation",
        "Pull request creation",
        "Conflict resolution",
        "Code review assistance"
      ],
      useCases: ["Managing branches", "Creating PRs", "Resolving conflicts", "Code reviews"]
    },
    {
      icon: Bug,
      name: "Debug Agent",
      description: "Identifies and fixes bugs by analyzing logs, stack traces, and code behavior.",
      capabilities: [
        "Log analysis",
        "Stack trace interpretation",
        "Root cause analysis",
        "Automated fix suggestions",
        "Performance profiling"
      ],
      useCases: ["Debugging errors", "Performance issues", "Log analysis", "Crash investigation"]
    },
    {
      icon: Wrench,
      name: "Refactoring Agent",
      description: "Improves code quality through intelligent refactoring and optimization.",
      capabilities: [
        "Code smell detection",
        "Design pattern application",
        "Performance optimization",
        "Dead code elimination",
        "Dependency reduction"
      ],
      useCases: ["Improving code quality", "Optimizing performance", "Removing tech debt", "Applying patterns"]
    },
    {
      icon: Database,
      name: "Data Agent",
      description: "Handles database operations, migrations, and query optimization.",
      capabilities: [
        "Schema design",
        "Migration generation",
        "Query optimization",
        "Data seeding",
        "ORM assistance"
      ],
      useCases: ["Database design", "Writing migrations", "Optimizing queries", "Data modeling"]
    },
    {
      icon: Terminal,
      name: "DevOps Agent",
      description: "Automates DevOps tasks including CI/CD, deployment, and infrastructure.",
      capabilities: [
        "CI/CD pipeline configuration",
        "Docker containerization",
        "Kubernetes manifests",
        "Infrastructure as Code",
        "Deployment automation"
      ],
      useCases: ["Setting up CI/CD", "Containerizing apps", "K8s deployments", "IaC templates"]
    },
    {
      icon: Brain,
      name: "Architecture Agent",
      description: "Designs and reviews software architecture for scalability and maintainability.",
      capabilities: [
        "System design",
        "Architecture review",
        "Technology selection",
        "Pattern recommendation",
        "Scalability analysis"
      ],
      useCases: ["System design", "Architecture reviews", "Tech stack decisions", "Scaling strategies"]
    },
    {
      icon: Zap,
      name: "Performance Agent",
      description: "Optimizes application performance through profiling and optimization.",
      capabilities: [
        "Performance profiling",
        "Bottleneck identification",
        "Caching strategies",
        "Load testing",
        "Memory optimization"
      ],
      useCases: ["Improving performance", "Reducing latency", "Optimizing memory", "Load testing"]
    },
    {
      icon: Shield,
      name: "Security Agent",
      description: "Identifies and fixes security vulnerabilities in your codebase.",
      capabilities: [
        "Vulnerability scanning",
        "Security audit",
        "Patch generation",
        "Compliance checking",
        "Threat modeling"
      ],
      useCases: ["Security audits", "Fixing vulnerabilities", "Compliance checks", "Threat modeling"]
    },
    {
      icon: Cpu,
      name: "Custom Agent",
      description: "Create your own specialized agents for specific tasks and workflows.",
      capabilities: [
        "Custom tool integration",
        "Workflow automation",
        "Task-specific training",
        "Plugin development",
        "API integration"
      ],
      useCases: ["Custom workflows", "Specialized tasks", "API integrations", "Tool automation"]
    }
  ]

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-purple-500/20 text-purple-500 border-purple-500/30">
            AI Agents
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Specialized AI Agents
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A team of AI agents working together to handle every aspect of software development
          </p>
        </motion.div>

        {/* Agent Categories */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="px-4 py-2">All Agents</Badge>
            <Badge variant="outline" className="px-4 py-2">Development</Badge>
            <Badge variant="outline" className="px-4 py-2">Testing</Badge>
            <Badge variant="outline" className="px-4 py-2">DevOps</Badge>
            <Badge variant="outline" className="px-4 py-2">Security</Badge>
            <Badge variant="outline" className="px-4 py-2">Custom</Badge>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`h-full ${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <agent.icon className="w-8 h-8 text-blue-500" />
                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                  </div>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Capabilities</h4>
                      <ul className="space-y-1">
                        {agent.capabilities.map((cap) => (
                          <li key={cap} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="text-gray-600 dark:text-gray-400">{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Use Cases</h4>
                      <div className="flex flex-wrap gap-1">
                        {agent.useCases.map((useCase) => (
                          <Badge key={useCase} variant="secondary" className="text-xs">
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Multi-Agent Collaboration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className={`max-w-4xl mx-auto ${darkMode ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30" : "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200"}`}>
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold mb-4">Multi-Agent Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Agents can work together on complex tasks. For example, the Code Agent can write code, 
                the Testing Agent can generate tests, and the Documentation Agent can create docs - all in parallel.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-blue-500/10">
                  <div className="text-2xl font-bold text-blue-500">12+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Specialized Agents</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-500/10">
                  <div className="text-2xl font-bold text-green-500">Parallel</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Execution</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-500/10">
                  <div className="text-2xl font-bold text-purple-500">Custom</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Agent Builder</div>
                </div>
              </div>
              <Button className="w-full">Learn About Agent Workflows</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
