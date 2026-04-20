import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Book, Code2, GitBranch, Terminal, Users, Settings, Zap, Shield, Database, Cloud, ChevronRight, FileText, Search, ArrowLeft } from "lucide-react"
import { GettingStartedPage, AgentsGuidePage } from "../docs"

export function DocsPage({ darkMode }: { darkMode: boolean }) {
  const [activeSection, setActiveSection] = useState("getting-started")
  const [showSubPage, setShowSubPage] = useState(false)

  const renderSubPage = () => {
    switch (activeSection) {
      case "getting-started":
        return <GettingStartedPage darkMode={darkMode} />
      case "agents":
        return <AgentsGuidePage darkMode={darkMode} />
      default:
        return null
    }
  }

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId)
    setShowSubPage(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToDocs = () => {
    setShowSubPage(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const docsSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Book,
      description: "Quick start guide to get you up and running with GSDEV",
      articles: [
        { title: "Installation", path: "/docs/installation" },
        { title: "Quick Start", path: "/docs/quick-start" },
        { title: "Configuration", path: "/docs/configuration" },
        { title: "First Project", path: "/docs/first-project" }
      ]
    },
    {
      id: "agents",
      title: "AI Agents",
      icon: Code2,
      description: "Learn about the different AI agents and how to use them",
      articles: [
        { title: "Code Agent", path: "/docs/agents/code" },
        { title: "Testing Agent", path: "/docs/agents/testing" },
        { title: "Documentation Agent", path: "/docs/agents/documentation" },
        { title: "Git Agent", path: "/docs/agents/git" },
        { title: "Custom Agents", path: "/docs/agents/custom" }
      ]
    },
    {
      id: "workflows",
      title: "Workflows",
      icon: Zap,
      description: "Common workflows and best practices",
      articles: [
        { title: "Feature Development", path: "/docs/workflows/feature-dev" },
        { title: "Bug Fixing", path: "/docs/workflows/bug-fixing" },
        { title: "Code Review", path: "/docs/workflows/code-review" },
        { title: "Refactoring", path: "/docs/workflows/refactoring" }
      ]
    },
    {
      id: "git-integration",
      title: "Git Integration",
      icon: GitBranch,
      description: "Deep dive into Git features and workflows",
      articles: [
        { title: "Branch Management", path: "/docs/git/branches" },
        { title: "Commit Messages", path: "/docs/git/commits" },
        { title: "Pull Requests", path: "/docs/git/pull-requests" },
        { title: "Conflict Resolution", path: "/docs/git/conflicts" }
      ]
    },
    {
      id: "terminal",
      title: "Terminal",
      icon: Terminal,
      description: "Using the built-in terminal with AI assistance",
      articles: [
        { title: "Terminal Basics", path: "/docs/terminal/basics" },
        { title: "Command Generation", path: "/docs/terminal/commands" },
        { title: "Multi-Terminal", path: "/docs/terminal/multi" },
        { title: "Shell Integration", path: "/docs/terminal/shell" }
      ]
    },
    {
      id: "team",
      title: "Team Collaboration",
      icon: Users,
      description: "Working with teams and collaboration features",
      articles: [
        { title: "Team Setup", path: "/docs/team/setup" },
        { title: "Shared Workspaces", path: "/docs/team/workspaces" },
        { title: "Permissions", path: "/docs/team/permissions" },
        { title: "Activity Feed", path: "/docs/team/activity" }
      ]
    },
    {
      id: "settings",
      title: "Settings & Configuration",
      icon: Settings,
      description: "Configure GSDEV to your preferences",
      articles: [
        { title: "Appearance", path: "/docs/settings/appearance" },
        { title: "Models", path: "/docs/settings/models" },
        { title: "Hotkeys", path: "/docs/settings/hotkeys" },
        { title: "Plugins", path: "/docs/settings/plugins" }
      ]
    },
    {
      id: "api",
      title: "API Reference",
      icon: Database,
      description: "API documentation for developers",
      articles: [
        { title: "Authentication", path: "/docs/api/auth" },
        { title: "Endpoints", path: "/docs/api/endpoints" },
        { title: "Webhooks", path: "/docs/api/webhooks" },
        { title: "Rate Limits", path: "/docs/api/rate-limits" }
      ]
    },
    {
      id: "deployment",
      title: "Deployment",
      icon: Cloud,
      description: "Deploying applications with GSDEV",
      articles: [
        { title: "CI/CD Integration", path: "/docs/deployment/cicd" },
        { title: "Docker", path: "/docs/deployment/docker" },
        { title: "Kubernetes", path: "/docs/deployment/kubernetes" },
        { title: "Vercel/Netlify", path: "/docs/deployment/platforms" }
      ]
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      description: "Security best practices and features",
      articles: [
        { title: "Data Encryption", path: "/docs/security/encryption" },
        { title: "Access Control", path: "/docs/security/access" },
        { title: "Audit Logs", path: "/docs/security/audit" },
        { title: "Compliance", path: "/docs/security/compliance" }
      ]
    }
  ]

  const popularArticles = [
    { title: "Quick Start Guide", path: "/docs/quick-start", views: "12.5K" },
    { title: "Setting Up Your First Project", path: "/docs/first-project", views: "8.3K" },
    { title: "Using the Code Agent", path: "/docs/agents/code", views: "7.2K" },
    { title: "Git Integration Guide", path: "/docs/git/integration", views: "6.1K" },
    { title: "Custom Agent Creation", path: "/docs/agents/custom", views: "5.4K" }
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
          <Badge className="mb-4 bg-orange-500/20 text-orange-500 border-orange-500/30">
            Documentation
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive guides and API reference for GSDEV
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className={`relative ${darkMode ? "bg-gray-900/50" : "bg-white/50"} rounded-lg border border-gray-200 dark:border-gray-800`}>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                className={`w-full pl-12 pr-4 py-3 rounded-lg bg-transparent focus:outline-none ${darkMode ? "text-white" : "text-gray-900"}`}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""} sticky top-24`}>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {docsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${activeSection === section.id
                        ? "bg-blue-500/20 text-blue-500"
                        : darkMode
                          ? "hover:bg-gray-800 text-gray-300"
                          : "hover:bg-gray-100 text-gray-700"
                        }`}
                    >
                      <section.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {showSubPage ? (
              <>
                {/* Back Button */}
                <Button
                  onClick={handleBackToDocs}
                  variant="ghost"
                  className="mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Documentation
                </Button>
                {/* Sub Page */}
                {renderSubPage()}
              </>
            ) : (
              <>
                {/* Active Section */}
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {(() => {
                    const section = docsSections.find((s) => s.id === activeSection)
                    if (!section) return null

                    return (
                      <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""} mb-8`}>
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <section.icon className="w-8 h-8 text-blue-500" />
                            <CardTitle className="text-2xl">{section.title}</CardTitle>
                          </div>
                          <CardDescription>{section.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {section.articles.map((article) => (
                              <button
                                key={article.path}
                                onClick={() => handleSectionClick(section.id)}
                                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-gray-400" />
                                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
                                    {article.title}
                                  </span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })()}
                </motion.div>

                {/* Popular Articles */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
                    <CardHeader>
                      <CardTitle>Popular Articles</CardTitle>
                      <CardDescription>Most viewed documentation pages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {popularArticles.map((article, index) => (
                          <a
                            key={article.path}
                            href={article.path}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 dark:text-gray-300">{article.title}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {article.views}
                            </Badge>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="mt-8 grid md:grid-cols-2 gap-4"
                >
                  <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Book className="w-6 h-6 text-blue-500" />
                        <h3 className="font-semibold">Tutorials</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Step-by-step tutorials for common tasks
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Tutorials
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Code2 className="w-6 h-6 text-purple-500" />
                        <h3 className="font-semibold">Examples</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Code examples and sample projects
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Browse Examples
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Need Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className={`max-w-4xl mx-auto ${darkMode ? "bg-gradient-to-r from-orange-500/20 to-pink-500/20 border-orange-500/30" : "bg-gradient-to-r from-orange-100 to-pink-100 border-orange-200"}`}>
            <CardContent className="p-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Can't find what you're looking for? Our community is here to help.
              </p>
              <div className="flex gap-4 justify-center">
                <Button>Join Discord</Button>
                <Button variant="outline">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
