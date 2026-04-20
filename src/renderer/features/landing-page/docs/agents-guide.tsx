import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cpu, Code2, TestTube, FileText, GitBranch, Zap } from "lucide-react"

export function AgentsGuidePage({ darkMode }: { darkMode: boolean }) {
  const agents = [
    {
      icon: Code2,
      name: "Code Agent",
      description: "Writes, refactors, and debugs code with deep project understanding",
      features: [
        "Context-aware code generation",
        "Multi-file editing",
        "Language-specific best practices",
        "Automated refactoring"
      ]
    },
    {
      icon: TestTube,
      name: "Testing Agent",
      description: "Generates comprehensive tests and ensures code quality",
      features: [
        "Unit test generation",
        "Integration tests",
        "E2E test automation",
        "Test coverage analysis"
      ]
    },
    {
      icon: FileText,
      name: "Documentation Agent",
      description: "Creates and maintains project documentation",
      features: [
        "API documentation",
        "README generation",
        "Inline code comments",
        "Architecture docs"
      ]
    },
    {
      icon: GitBranch,
      name: "Git Agent",
      description: "Manages Git operations and workflows",
      features: [
        "Branch management",
        "Commit message generation",
        "PR creation",
        "Conflict resolution"
      ]
    },
    {
      icon: Zap,
      name: "Performance Agent",
      description: "Optimizes application performance",
      features: [
        "Performance profiling",
        "Bottleneck identification",
        "Caching strategies",
        "Load testing"
      ]
    },
    {
      icon: Cpu,
      name: "Custom Agents",
      description: "Create specialized agents for your specific needs",
      features: [
        "Custom tool integration",
        "Workflow automation",
        "Plugin development",
        "API integration"
      ]
    }
  ]

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 bg-purple-500/20 text-purple-500 border-purple-500/30">
            AI Agents
          </Badge>
          <h1 className="text-4xl font-bold mb-4">AI Agents Guide</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Learn about the specialized AI agents that power GSDEV
          </p>
        </motion.div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`h-full ${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <agent.icon className="w-8 h-8 text-blue-500" />
                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{agent.description}</p>
                  <ul className="space-y-2">
                    {agent.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How to Use */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
            <CardHeader>
              <CardTitle className="text-2xl">How to Use Agents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-semibold">1</div>
                  <div>
                    <p className="font-semibold">Select the appropriate agent</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose the agent that matches your task (Code, Testing, Documentation, etc.)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-semibold">2</div>
                  <div>
                    <p className="font-semibold">Provide clear instructions</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Describe what you want to accomplish in natural language</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-semibold">3</div>
                  <div>
                    <p className="font-semibold">Review and iterate</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Review the agent's work and provide feedback for improvements</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Multi-Agent Workflows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`${darkMode ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30" : "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200"}`}>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Multi-Agent Workflows</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Agents can work together on complex tasks. For example, when building a new feature:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-blue-500/10">
                  <Code2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-semibold">Code Agent</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Writes the implementation</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-500/10">
                  <TestTube className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold">Testing Agent</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generates tests</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-500/10">
                  <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="font-semibold">Documentation Agent</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Creates docs</p>
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
