import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Download, Play, Settings, Terminal } from "lucide-react"

export function GettingStartedPage({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 bg-blue-500/20 text-blue-500 border-blue-500/30">
            Getting Started
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Getting Started with GSDEV</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Get up and running with GSDEV in minutes
          </p>
        </motion.div>

        {/* Installation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Download className="w-6 h-6 text-blue-500" />
                <CardTitle className="text-2xl">1. Installation</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Download and install GSDEV for your platform:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download for macOS
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download for Windows
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download for Linux
                </Button>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  # Or install via Homebrew (macOS)<br/>
                  brew install --cask gsdev
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Play className="w-6 h-6 text-green-500" />
                <CardTitle className="text-2xl">2. Quick Start</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Launch GSDEV and complete the onboarding process:
              </p>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="font-semibold">Sign in or create account</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Use your email or sign in with GitHub</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-semibold">Choose your AI provider</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Select Claude, OpenAI, or use your own API key</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="font-semibold">Select or create a project</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Connect to a Git repository or start fresh</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <p className="font-semibold">Start building</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ask the AI agent to help you build features</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </motion.div>

        {/* Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-6 h-6 text-purple-500" />
                <CardTitle className="text-2xl">3. Configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Customize GSDEV to your preferences:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Choose your preferred AI model</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Set up custom hotkeys</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Configure theme and appearance</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Enable offline mode with Ollama</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* First Project */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Terminal className="w-6 h-6 text-orange-500" />
                <CardTitle className="text-2xl">4. Your First Project</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Create your first project with AI assistance:
              </p>
              <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mb-2">
                  Example prompt:
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  "Create a React component for a user profile page with avatar, name, email, and bio fields. Use TypeScript and Tailwind CSS."
                </p>
              </div>
              <Button className="w-full">Create Your First Project</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Card className={`${darkMode ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30" : "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200"}`}>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Next Steps</h3>
              <div className="space-y-3">
                <a href="/docs/features" className="block p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <p className="font-semibold">Explore Features</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learn about all the powerful features</p>
                </a>
                <a href="/docs/agents" className="block p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <p className="font-semibold">Meet the Agents</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Discover specialized AI agents</p>
                </a>
                <a href="/docs/workflows" className="block p-3 rounded-lg hover:bg-white/10 transition-colors">
                  <p className="font-semibold">Learn Workflows</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Common development workflows</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
