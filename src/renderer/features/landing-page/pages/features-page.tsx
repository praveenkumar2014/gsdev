import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code2, Zap, Shield, Globe, Cpu, Lock, GitBranch, Database, Cloud, Terminal, Puzzle, Users } from "lucide-react"
import { AiChat, type Message } from "@/components/ai"

export function FeaturesPage({ darkMode }: { darkMode: boolean }) {
  const [messages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "This is a demo of the AI chat component in action. Try it out!",
      timestamp: new Date(),
      metadata: {
        model: "Claude 3.5 Sonnet",
        tokens: 20,
      },
    },
  ])

  const handleSendMessage = (message: string) => {
    // Demo function - in real app, this would call the AI backend
    console.log("Message sent:", message)
  }
  const features = [
    {
      icon: Code2,
      title: "AI-Powered Coding",
      description: "Write, refactor, and debug code with intelligent AI assistance that understands your project context.",
      details: [
        "Context-aware code generation",
        "Automated refactoring suggestions",
        "Real-time error detection and fixes",
        "Multi-language support (TypeScript, Python, Go, Rust, and more)"
      ]
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant code generation and real-time collaboration with sub-second response times.",
      details: [
        "Parallel agent execution",
        "Streaming responses for immediate feedback",
        "Optimized for large codebases",
        "Local caching for faster repeated operations"
      ]
    },
    {
      icon: Shield,
      title: "Secure by Default",
      description: "Enterprise-grade security with end-to-end encryption and local-first architecture.",
      details: [
        "End-to-end encryption",
        "Local-first data storage",
        "SOC 2 Type II compliant",
        "GDPR ready"
      ]
    },
    {
      icon: Globe,
      title: "Global Collaboration",
      description: "Work with teams across the world in real-time with built-in collaboration features.",
      details: [
        "Real-time sync across devices",
        "Team workspaces",
        "Shared agent configurations",
        "Activity feeds and notifications"
      ]
    },
    {
      icon: Cpu,
      title: "Multi-Agent System",
      description: "Specialized AI agents for different tasks - coding, testing, documentation, and more.",
      details: [
        "Code Agent for development",
        "Testing Agent for test generation",
        "Documentation Agent for docs",
        "Custom agent creation"
      ]
    },
    {
      icon: GitBranch,
      title: "Git Integration",
      description: "Seamless integration with Git workflows including branch management and PR creation.",
      details: [
        "Automatic branch creation",
        "Commit message generation",
        "Pull request creation",
        "Conflict resolution assistance"
      ]
    },
    {
      icon: Database,
      title: "Project Intelligence",
      description: "Understands your entire project structure, dependencies, and coding patterns.",
      details: [
        "Full codebase indexing",
        "Dependency graph analysis",
        "Pattern recognition",
        "Smart context selection"
      ]
    },
    {
      icon: Cloud,
      title: "Hybrid Deployment",
      description: "Choose between cloud-based AI or run locally with Ollama for offline capabilities.",
      details: [
        "Cloud AI (Claude, GPT-4, etc.)",
        "Local Ollama integration",
        "Automatic fallback to offline mode",
        "Custom model support"
      ]
    },
    {
      icon: Terminal,
      title: "Terminal Integration",
      description: "Built-in terminal with AI-powered command generation and execution.",
      details: [
        "Natural language to shell commands",
        "Command history and suggestions",
        "Multi-terminal support",
        "Safe execution with confirmation"
      ]
    },
    {
      icon: Puzzle,
      title: "Extensible Plugin System",
      description: "Build custom plugins and integrations to extend GSDEV capabilities.",
      details: [
        "MCP server support",
        "Custom tool development",
        "Plugin marketplace",
        "API for custom workflows"
      ]
    },
    {
      icon: Lock,
      title: "Access Control",
      description: "Fine-grained permissions and role-based access control for teams.",
      details: [
        "User roles and permissions",
        "Workspace-level access",
        "Audit logs",
        "SSO integration"
      ]
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Organize teams, assign projects, and collaborate effectively.",
      details: [
        "Team workspaces",
        "Project assignment",
        "Review and approval workflows",
        "Performance analytics"
      ]
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
          <Badge className="mb-4 bg-blue-500/20 text-blue-500 border-blue-500/30">
            Features
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to build amazing software with AI assistance
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`h-full ${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-gray-600 dark:text-gray-400">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className={`max-w-4xl mx-auto ${darkMode ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30" : "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200"}`}>
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Supercharge Your Development?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Join thousands of developers building faster with GSDEV
              </p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Get Started Free
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Chat Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Try AI Chat</h2>
          <Card className={`max-w-4xl mx-auto ${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
            <CardContent className="p-6">
              <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-100"}`} style={{ height: "300px" }}>
                <AiChat
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  showThinking
                  showActions
                  className="h-full"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
