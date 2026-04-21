import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useAtom, useSetAtom } from "jotai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Code2,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Menu,
  X,
  ShoppingCart,
  Check,
  Star,
  Users,
  Cpu,
  Lock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Home,
  ArrowLeft
} from "lucide-react"
import { landingPageRouteAtom, type LandingPageRoute } from "@/lib/atoms"
import { FeaturesPage, AgentsPage, PricingPage, DocsPage } from "./pages"
import { AiChatInput, AiChat, PromptInput, type Message } from "@/components/ai"
import { VideoBackground } from "@/components/video/video-background"

// ============================================
// THEME PROVIDER
// ============================================
export function LandingPage() {
  // Apply Google Fonts to document
  useEffect(() => {
    document.body.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  }, [])
  const [darkMode, setDarkMode] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false) // Disabled for testing
  const [authStep, setAuthStep] = useState<"left" | "right" | "done">("left")
  const [currentRoute, setCurrentRoute] = useAtom(landingPageRouteAtom)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI coding assistant. I can help you write code, debug issues, and build features. What would you like to work on today?",
      timestamp: new Date(),
      metadata: {
        model: "Claude 3.5 Sonnet",
        tokens: 45,
      },
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const navigateTo = (route: LandingPageRoute) => {
    setCurrentRoute(route)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
    switch (currentRoute) {
      case "features":
        return <FeaturesPage darkMode={darkMode} />
      case "agents":
        return <AgentsPage darkMode={darkMode} />
      case "pricing":
        return <PricingPage darkMode={darkMode} />
      case "docs":
        return <DocsPage darkMode={darkMode} />
      default:
        return null // Render home page content inline
    }
  }

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    }
    setMessages([...messages, userMessage])
    setIsProcessing(true)

    // Simulate AI response with more realistic responses based on message content
    setTimeout(() => {
      let responseContent = ""
      let thinking = ""

      if (message.toLowerCase().includes("react") || message.toLowerCase().includes("component")) {
        thinking = "Analyzing React component requirements..."
        responseContent = "I can help you build a React component! Here's a simple example:\n\n```tsx\nimport React from 'react'\n\ninterface Props {\n  title: string\n  children: React.ReactNode\n}\n\nexport function Card({ title, children }: Props) {\n  return (\n    <div className=\"p-4 border rounded-lg\">\n      <h2 className=\"text-xl font-bold\">{title}</h2>\n      {children}\n    </div>\n  )\n}\n```\n\nWould you like me to customize this further?"
      } else if (message.toLowerCase().includes("python") || message.toLowerCase().includes("function")) {
        thinking = "Generating Python function..."
        responseContent = "Here's a Python function example:\n\n```python\ndef process_data(data: list) -> dict:\n    \"\"\"Process and analyze data\"\"\"\n    return {\n        'count': len(data),\n        'sum': sum(data) if all(isinstance(x, (int, float)) for x in data) else 0\n    }\n```\n\nLet me know if you need any modifications!"
      } else if (message.toLowerCase().includes("help")) {
        thinking = "Understanding how to assist..."
        responseContent = "I'm your AI coding assistant! I can help you with:\n\n• Writing code in various languages\n• Debugging issues\n• Explaining concepts\n• Refactoring code\n• Building features\n\nJust tell me what you'd like to work on!"
      } else {
        thinking = "Processing the request..."
        responseContent = "I understand you want help with: " + message + "\n\nLet me provide a solution. In a production environment, this would connect to the actual AI backend (Claude, GPT, etc.) to generate a more specific response.\n\nFor now, I can help you with:\n- React/Next.js development\n- Python scripting\n- Database queries\n- API integration\n\nWhat would you like to focus on?"
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        metadata: {
          model: "Claude 3.5 Sonnet",
          tokens: Math.floor(responseContent.length / 4),
          thinking: thinking,
        },
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsProcessing(false)
    }, 1500)
  }

  const handleStopGeneration = () => {
    setIsProcessing(false)
  }

  const handlePromptGenerate = (prompt: string) => {
    handleSendMessage(prompt)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-950 text-white" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}>
      {/* Full-screen HLS Video Background with Dark/Light Gradients */}
      <VideoBackground
        src="/videos/landing-video.m3u8"
        poster="/images/landing-poster.jpg"
        darkMode={darkMode}
        overlayOpacity={0.5}
      />

      {/* Fixed Background Motion with Waves */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-xy" />

        {/* Wave Animation */}
        <div className="absolute bottom-0 left-0 right-0 h-96 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 w-[200%] h-full"
            style={{
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.2)'} 25%, 
                ${darkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.2)'} 50%, 
                ${darkMode ? 'rgba(236, 72, 153, 0.1)' : 'rgba(236, 72, 153, 0.2)'} 75%, 
                transparent 100%)`,
              backgroundSize: '50% 100%',
            }}
            animate={{
              x: ['-100%', '0%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[200%] h-full"
            style={{
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${darkMode ? 'rgba(236, 72, 153, 0.08)' : 'rgba(236, 72, 153, 0.15)'} 25%, 
                ${darkMode ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.15)'} 50%, 
                ${darkMode ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.15)'} 75%, 
                transparent 100%)`,
              backgroundSize: '50% 100%',
            }}
            animate={{
              x: ['0%', '-100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
              delay: 2,
            }}
          />
        </div>

        {/* Floating Blobs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        setAuthModalOpen={setAuthModalOpen}
        currentRoute={currentRoute}
        navigateTo={navigateTo}
      />

      {/* Collapsible Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <Sidebar
            darkMode={darkMode}
            onClose={() => setSidebarOpen(false)}
            onAuthClick={() => {
              setSidebarOpen(false)
              setAuthModalOpen(true)
            }}
          />
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {cartOpen && (
          <CartModal
            darkMode={darkMode}
            onClose={() => setCartOpen(false)}
            onProceedToAuth={() => {
              setCartOpen(false)
              window.location.href = "/editor"
            }}
          />
        )}
      </AnimatePresence>

      {/* Auth Modal - Disabled for testing */}
      {/* <AnimatePresence>
        {authModalOpen && (
          <AuthModal
            darkMode={darkMode}
            onClose={() => setAuthModalOpen(false)}
            step={authStep}
            setStep={setAuthStep}
          />
        )}
      </AnimatePresence> */}

      {/* Main Content - Fixed Width/Height Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentRoute === "home" ? (
          <>
            {/* Section 1: Hero */}
            <HeroSection
              darkMode={darkMode}
              onStartAuth={() => window.location.href = "/editor"}
              messages={messages}
              isProcessing={isProcessing}
              onSendMessage={handleSendMessage}
              onStop={handleStopGeneration}
            />

            {/* Section 2: Features */}
            <FeaturesSection
              darkMode={darkMode}
              onNavigateToFeatures={() => navigateTo("features")}
              onPromptGenerate={handlePromptGenerate}
            />

            {/* Section 3: Agents Documentation */}
            <AgentsSection darkMode={darkMode} onNavigateToAgents={() => navigateTo("agents")} />

            {/* Section 4: Platform Support */}
            <PlatformSection darkMode={darkMode} />

            {/* Section 5: Social Integration */}
            <SocialSection darkMode={darkMode} />

            {/* Section 6: User Dashboard Preview */}
            <DashboardSection darkMode={darkMode} />

            {/* Section 7: Models Documentation */}
            <ModelsSection darkMode={darkMode} />

            {/* Section 8: Pricing */}
            <PricingSection darkMode={darkMode} onOpenCart={() => setCartOpen(true)} onNavigateToPricing={() => navigateTo("pricing")} />

            {/* Section 9: Mobile App */}
            <MobileSection darkMode={darkMode} />

            {/* Section 10: CTA */}
            <CTASection darkMode={darkMode} onStartAuth={() => window.location.href = "/editor"} />
          </>
        ) : (
          renderPage()
        )}
      </div>

      {/* Footer */}
      <Footer darkMode={darkMode} />
    </div>
  )
}

// ============================================
// HEADER COMPONENT
// ============================================
function Header({
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
  cartOpen,
  setCartOpen,
  setAuthModalOpen,
  currentRoute,
  navigateTo,
}: {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  cartOpen: boolean
  setCartOpen: (value: boolean) => void
  setAuthModalOpen: (value: boolean) => void
  currentRoute: LandingPageRoute
  navigateTo: (route: LandingPageRoute) => void
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/10 dark:bg-black/10 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {currentRoute !== "home" && (
            <button
              onClick={() => navigateTo("home")}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>
          )}
          <div className="font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            GSDEV
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigateTo("home")}
            className={`text-sm font-medium transition-colors ${currentRoute === "home"
              ? "text-blue-500"
              : "hover:text-blue-500 dark:hover:text-blue-400"
              }`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo("features")}
            className={`text-sm font-medium transition-colors ${currentRoute === "features"
              ? "text-blue-500"
              : "hover:text-blue-500 dark:hover:text-blue-400"
              }`}
          >
            Features
          </button>
          <button
            onClick={() => navigateTo("agents")}
            className={`text-sm font-medium transition-colors ${currentRoute === "agents"
              ? "text-blue-500"
              : "hover:text-blue-500 dark:hover:text-blue-400"
              }`}
          >
            Agents
          </button>
          <button
            onClick={() => navigateTo("pricing")}
            className={`text-sm font-medium transition-colors ${currentRoute === "pricing"
              ? "text-blue-500"
              : "hover:text-blue-500 dark:hover:text-blue-400"
              }`}
          >
            Pricing
          </button>
          <button
            onClick={() => navigateTo("docs")}
            className={`text-sm font-medium transition-colors ${currentRoute === "docs"
              ? "text-blue-500"
              : "hover:text-blue-500 dark:hover:text-blue-400"
              }`}
          >
            Docs
          </button>
          <a
            href="/editor"
            className={`text-sm font-medium transition-colors ${"hover:text-blue-500 dark:hover:text-blue-400"
              }`}
          >
            Editor
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
              0
            </span>
          </button>

          <Button onClick={() => window.location.href = "/editor"} className="hidden sm:inline-flex">Go to Editor</Button>

          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

// ============================================
// SIDEBAR COMPONENT
// ============================================
function Sidebar({
  darkMode,
  onClose,
  onAuthClick,
}: {
  darkMode: boolean
  onClose: () => void
  onAuthClick: () => void
}) {
  const [userRole, setUserRole] = useState<"developer" | "designer" | "manager">("developer")

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", damping: 25 }}
      className={`fixed top-0 left-0 h-full w-80 z-50 ${darkMode ? "bg-gray-900" : "bg-white"
        } border-r border-gray-200 dark:border-gray-800 shadow-xl`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Selector */}
        <div className="mb-6">
          <Label className="text-sm mb-2 block">User Role</Label>
          <div className="flex gap-2">
            {(["developer", "designer", "manager"] as const).map((role) => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize ${userRole === role
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Items */}
        <nav className="space-y-2">
          {[
            { icon: Code2, label: "Projects", count: 12 },
            { icon: Users, label: "Team", count: 5 },
            { icon: Cpu, label: "Agents", count: 3 },
            { icon: Shield, label: "Security", count: 0 },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}
          <a
            href="/editor"
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Code2 className="w-5 h-5" />
              <span>Editor</span>
            </div>
          </a>
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Button onClick={() => window.location.href = "/editor"} className="w-full">
            View Full Dashboard
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection({ darkMode, onStartAuth, messages, isProcessing, onSendMessage, onStop }: {
  darkMode: boolean
  onStartAuth: () => void
  messages: Message[]
  isProcessing: boolean
  onSendMessage: (message: string) => void
  onStop: () => void
}) {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Badge className="mb-4 bg-blue-500/20 text-blue-500 border-blue-500/30">
            AI-Powered Development
          </Badge>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Build Faster with AI Agents
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            The ultimate AI-powered development platform. Write, refactor, and debug code with intelligent AI assistance.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 justify-center mb-12"
        >
          <Button onClick={onStartAuth} size="lg" className="bg-blue-500 hover:bg-blue-600">
            Get Started Free
          </Button>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </motion.div>

        {/* AI Chat Demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl border-2 ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} p-6 shadow-2xl max-w-4xl mx-auto`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <Badge variant="secondary" className="text-xs">Live Demo</Badge>
          </div>
          <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-gray-100"}`} style={{ height: "400px" }}>
            <AiChat
              messages={messages}
              onSendMessage={onSendMessage}
              isProcessing={isProcessing}
              onStop={onStop}
              showThinking
              showSources
              showActions
              className="h-full"
            />
          </div>
          <div className="mt-4">
            <AiChatInput
              onSend={onSendMessage}
              onStop={onStop}
              isProcessing={isProcessing}
              placeholder="Try asking: 'Help me build a React component'"
              showAttach
              showVoice
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================
// FEATURES SECTION
// ============================================
function FeaturesSection({ darkMode, onNavigateToFeatures, onPromptGenerate }: {
  darkMode: boolean
  onNavigateToFeatures?: () => void
  onPromptGenerate?: (prompt: string) => void
}) {
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
      description: "Instant code generation and real-time collaboration with your team.",
      details: [
        "Sub-second response times",
        "Real-time collaboration",
        "Instant code suggestions",
        "Optimized for speed"
      ]
    },
    {
      icon: Shield,
      title: "Secure by Default",
      description: "Enterprise-grade security with end-to-end encryption for all your code.",
      details: [
        "End-to-end encryption",
        "SOC 2 compliant",
        "Role-based access control",
        "Audit logging"
      ]
    },
    {
      icon: Globe,
      title: "Global Collaboration",
      description: "Work with teams across the world in real-time with built-in collaboration tools.",
      details: [
        "Real-time collaboration",
        "Multi-region deployment",
        "Team workspaces",
        "Shareable projects"
      ]
    }
  ]

  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-500/20 text-blue-500 border-blue-500/30">Features</Badge>
          <h2 className={`text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Everything You Need to Build</h2>
          <p className={`text-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Powerful features designed for modern development teams
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`h-full ${darkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200"}`}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${darkMode ? "bg-blue-500/20" : "bg-blue-100"} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${darkMode ? "text-blue-500" : "text-blue-600"}`} />
                  </div>
                  <CardTitle className={`text-xl ${darkMode ? "text-white" : ""}`}>{feature.title}</CardTitle>
                  <CardDescription className={darkMode ? "text-gray-400" : ""}>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2">
                        <Check className={`w-4 h-4 ${darkMode ? "text-blue-500" : "text-blue-600"} flex-shrink-0 mt-0.5`} />
                        <span className={darkMode ? "text-gray-300" : "text-gray-600"}>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {onNavigateToFeatures && (
          <div className="text-center mt-12">
            <Button onClick={onNavigateToFeatures} size="lg">
              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Learn More About Features</span>
            </Button>
          </div>
        )}

        {/* AI Prompt Generator Demo */}
        {onPromptGenerate && (
          <div className="mt-16">
            <h3 className={`text-3xl font-bold text-center mb-8 ${darkMode ? "text-white" : "text-gray-900"}`}>Try AI Prompt Generation</h3>
            <PromptInput
              onGenerate={onPromptGenerate}
              placeholder="Describe what you want to build with AI..."
              suggestions={[
                "Create a React component for a user profile card with avatar and bio",
                "Generate a Python function to sort a list of dictionaries",
                "Write a SQL query to find duplicate records in a table",
                "Create a CSS animation for a loading spinner",
              ]}
              showSuggestions
            />
          </div>
        )}
      </div>
    </section>
  )
}

// ============================================
// AGENTS SECTION
// ============================================
function AgentsSection({ darkMode, onNavigateToAgents }: { darkMode: boolean; onNavigateToAgents?: () => void }) {
  const agents = [
    {
      name: "Code Agent",
      description: "Writes, refactors, and debugs code automatically",
      useCases: ["Feature development", "Bug fixes", "Code refactoring"],
    },
    {
      name: "Design Agent",
      description: "Creates UI components and design systems",
      useCases: ["Component library", "Design tokens", "Responsive layouts"],
    },
    {
      name: "Testing Agent",
      description: "Generates and runs comprehensive tests",
      useCases: ["Unit tests", "Integration tests", "E2E tests"],
    },
  ]

  return (
    <section id="agents" className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">AI Agents</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Specialized agents for every development task
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full ${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-blue-500" />
                  {agent.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{agent.description}</CardDescription>
                <div>
                  <Label className="text-sm">Use Cases:</Label>
                  <ul className="mt-2 space-y-1">
                    {agent.useCases.map((useCase) => (
                      <li key={useCase} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500" />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {onNavigateToAgents && (
        <div className="text-center mt-12">
          <Button onClick={onNavigateToAgents} size="lg">
            Explore All Agents
          </Button>
        </div>
      )}
    </section>
  )
}

// ============================================
// PLATFORM SECTION
// ============================================
function PlatformSection({ darkMode }: { darkMode: boolean }) {
  const platforms = [
    { icon: Monitor, name: "Desktop", description: "Windows, macOS, Linux" },
    { icon: Smartphone, name: "Mobile", description: "iOS, Android apps" },
    { icon: Globe, name: "Web", description: "Browser-based access" },
  ]

  return (
    <section className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Available Everywhere</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Use GSDEV on any platform
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`text-center ${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
              <CardHeader>
                <platform.icon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>{platform.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{platform.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ============================================
// SOCIAL SECTION
// ============================================
function SocialSection({ darkMode }: { darkMode: boolean }) {
  const socialPlatforms = [
    { icon: Github, name: "GitHub", link: "#" },
    { icon: Twitter, name: "Twitter", link: "#" },
    { icon: Facebook, name: "Facebook", link: "#" },
    { icon: Linkedin, name: "LinkedIn", link: "#" },
  ]

  return (
    <section className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Connect With Us</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Join our community on social media
        </p>
      </div>

      <div className="flex justify-center gap-6">
        {socialPlatforms.map((platform, index) => (
          <motion.a
            key={platform.name}
            href={platform.link}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            className={`p-4 rounded-xl ${darkMode ? "bg-gray-900/50 hover:bg-gray-800" : "bg-white hover:bg-gray-100"
              } border border-gray-200 dark:border-gray-800 transition-colors`}
          >
            <platform.icon className="w-8 h-8 text-blue-500" />
          </motion.a>
        ))}
      </div>
    </section>
  )
}

// ============================================
// DASHBOARD SECTION
// ============================================
function DashboardSection({ darkMode }: { darkMode: boolean }) {
  return (
    <section className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Powerful Dashboard</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Manage your projects and agents in one place
        </p>
      </div>

      <Card className={`max-w-4xl mx-auto ${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-blue-500/10">
              <div className="text-3xl font-bold text-blue-500">12</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <div className="text-3xl font-bold text-green-500">45</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500/10">
              <div className="text-3xl font-bold text-purple-500">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Agents</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5" />
                <span>E-commerce Platform</span>
              </div>
              <Badge>In Progress</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5" />
                <span>Mobile App</span>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

// ============================================
// MODELS SECTION
// ============================================
function ModelsSection({ darkMode }: { darkMode: boolean }) {
  const models = [
    { name: "Claude 3.5 Sonnet", provider: "Anthropic", description: "Best for coding and reasoning" },
    { name: "GPT-4", provider: "OpenAI", description: "Versatile and powerful" },
    { name: "Codex", provider: "OpenAI", description: "Specialized for code generation" },
  ]

  return (
    <section id="docs" className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Supported Models</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Use the best AI models for your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {models.map((model, index) => (
          <motion.div
            key={model.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full ${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>{model.name}</CardTitle>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <Badge variant="outline">{model.provider}</Badge>
              </CardHeader>
              <CardContent>
                <CardDescription>{model.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ============================================
// PRICING SECTION
// ============================================
function PricingSection({ darkMode, onOpenCart, onNavigateToPricing }: { darkMode: boolean; onOpenCart: () => void; onNavigateToPricing?: () => void }) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["Basic AI agents", "5 projects", "Community support"],
      cta: "Get Started",
    },
    {
      name: "Pro",
      price: "$29",
      features: ["All AI agents", "Unlimited projects", "Priority support", "API access"],
      cta: "Subscribe",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Custom solutions", "Dedicated support", "SLA", "White-label"],
      cta: "Contact Sales",
    },
  ]

  return (
    <section id="pricing" className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Choose the plan that fits your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full ${plan.popular ? "border-blue-500 border-2" : ""} ${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
              {plan.popular && (
                <div className="bg-blue-500 text-white text-center py-1 text-sm">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-4xl font-bold">{plan.price}</div>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button onClick={onOpenCart} className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* UPI Integration */}
      <div className="mt-12 text-center">
        <Card className={`max-w-md mx-auto ${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
          <CardHeader>
            <CardTitle>Pay with UPI</CardTitle>
            <CardDescription>Quick and secure payments via UPI</CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder="Enter UPI ID" className="mb-4" />
            <Button className="w-full">Pay Now</Button>
          </CardContent>
        </Card>
      </div>

      {onNavigateToPricing && (
        <div className="text-center mt-12">
          <Button onClick={onNavigateToPricing} size="lg" variant="outline">
            View All Pricing Plans
          </Button>
        </div>
      )}
    </section>
  )
}

// ============================================
// MOBILE SECTION
// ============================================
function MobileSection({ darkMode }: { darkMode: boolean }) {
  return (
    <section className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Mobile Apps</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Take GSDEV with you anywhere
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
          <CardHeader>
            <Smartphone className="w-12 h-12 text-blue-500 mb-4" />
            <CardTitle>iOS App</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Native iOS app with full feature parity
            </CardDescription>
            <Button className="w-full">Download on App Store</Button>
          </CardContent>
        </Card>

        <Card className={`${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
          <CardHeader>
            <Smartphone className="w-12 h-12 text-green-500 mb-4" />
            <CardTitle>Android App</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Native Android app with full feature parity
            </CardDescription>
            <Button className="w-full">Download on Play Store</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ============================================
// CTA SECTION
// ============================================
function CTASection({ darkMode, onStartAuth }: { darkMode: boolean; onStartAuth: () => void }) {
  return (
    <section className="py-24">
      <Card className={`max-w-4xl mx-auto ${darkMode ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30" : "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200"}`}>
        <CardContent className="p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Anything?</h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
            Join thousands of developers using GSDEV
          </p>
          <Button size="lg" onClick={onStartAuth} className="text-lg px-12 py-6">
            Start Building Now
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

// ============================================
// RULES SECTION
// ============================================
function RulesSection({ darkMode }: { darkMode: boolean }) {
  const rules = [
    { title: "Code of Conduct", description: "Be respectful and collaborative" },
    { title: "Privacy Policy", description: "Your data is secure and private" },
    { title: "Terms of Service", description: "Fair usage and guidelines" },
    { title: "Security", description: "Enterprise-grade security measures" },
  ]

  return (
    <section className="py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Rules & Responsibilities</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Guidelines for using GSDEV responsibly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rules.map((rule, index) => (
          <motion.div
            key={rule.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full ${darkMode ? "bg-gray-900/50 border-gray-800" : ""}`}>
              <CardHeader>
                <Shield className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle className="text-lg">{rule.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{rule.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ============================================
// FOOTER
// ============================================
function Footer({ darkMode }: { darkMode: boolean }) {
  return (
    <footer className={`py-12 border-t border-gray-200 dark:border-gray-800 ${darkMode ? "bg-gray-900/50" : "bg-gray-100"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-6 h-6 text-blue-500" />
              <span className="font-bold">GSDEV</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Build anything with AI-powered development
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><button onClick={() => console.log('Navigate to features')} className="hover:text-blue-500 transition-colors">Features</button></li>
              <li><button onClick={() => console.log('Navigate to pricing')} className="hover:text-blue-500 transition-colors">Pricing</button></li>
              <li><button onClick={() => console.log('Navigate to documentation')} className="hover:text-blue-500 transition-colors">Documentation</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><button onClick={() => console.log('Navigate to about')} className="hover:text-blue-500 transition-colors">About</button></li>
              <li><button onClick={() => console.log('Navigate to blog')} className="hover:text-blue-500 transition-colors">Blog</button></li>
              <li><button onClick={() => console.log('Navigate to careers')} className="hover:text-blue-500 transition-colors">Careers</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><button onClick={() => console.log('Navigate to privacy')} className="hover:text-blue-500 transition-colors">Privacy</button></li>
              <li><button onClick={() => console.log('Navigate to terms')} className="hover:text-blue-500 transition-colors">Terms</button></li>
              <li><button onClick={() => console.log('Navigate to security')} className="hover:text-blue-500 transition-colors">Security</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2026 GSDEV. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

// ============================================
// CART MODAL
// ============================================
function CartModal({
  darkMode,
  onClose,
  onProceedToAuth,
}: {
  darkMode: boolean
  onClose: () => void
  onProceedToAuth: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md p-6 rounded-xl ${darkMode ? "bg-gray-900" : "bg-white"} shadow-xl`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div>
              <div className="font-bold">Pro Plan</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Monthly subscription</div>
            </div>
            <div className="text-xl font-bold">$29</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 text-lg font-bold">
          <span>Total</span>
          <span>$29</span>
        </div>

        <div className="space-y-3">
          <Button onClick={onProceedToAuth} className="w-full">
            Proceed to Payment
          </Button>
          <Button onClick={onClose} variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// AUTH MODAL
// ============================================
function AuthModal({
  darkMode,
  onClose,
  step,
  setStep,
}: {
  darkMode: boolean
  onClose: () => void
  step: "left" | "right" | "done"
  setStep: (step: "left" | "right" | "done") => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [upiId, setUpiId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep("right")
    }, 1000)
  }

  const handlePayment = async () => {
    if (!upiId) {
      setError("Please enter your UPI ID")
      return
    }
    setIsLoading(true)
    setError("")

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false)
      setStep("done")
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md p-6 rounded-xl ${darkMode ? "bg-gray-900" : "bg-white"} shadow-xl`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {step === "left" && "Sign In"}
            {step === "right" && "Complete Payment"}
            {step === "done" && "Welcome!"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        {step === "left" && (
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                className="mt-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="mt-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleSignIn} className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account? <button className="text-blue-500 hover:underline">Sign up</button>
            </div>
          </div>
        )}

        {step === "right" && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">Pro Plan</span>
                <span className="font-bold">$29</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Monthly subscription</div>
            </div>
            <div>
              <Label>UPI ID</Label>
              <Input
                placeholder="yourname@upi"
                className="mt-2"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              You'll receive a payment request on your UPI app
            </div>
            <Button onClick={handlePayment} className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Pay with UPI"}
            </Button>
            <Button onClick={() => setStep("left")} variant="outline" className="w-full">
              Back to Sign In
            </Button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                You now have access to all Pro features
              </p>
            </div>
            <Button
              onClick={() => {
                onClose()
                // Navigate to editor - this would normally use the app's routing
                window.location.href = "/editor"
              }}
              className="w-full"
            >
              Start Using GSDEV
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
