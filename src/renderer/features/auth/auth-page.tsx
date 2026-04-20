import { useState } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Shield, Key, Lock, Check, Copy } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

export function AuthPage() {
  const [apiKey, setApiKey] = useState("")
  const [generatedKey, setGeneratedKey] = useState("")
  const [copied, setCopied] = useState(false)

  const generateApiKey = () => {
    const newKey = `gsdev_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`
    setGeneratedKey(newKey)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Authentication
        </h1>
        <p className="text-muted-foreground">Manage API keys and authentication settings</p>
      </motion.div>

      <div className="grid gap-6 max-w-3xl">
        <GlassCard>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">API Key Generation</h2>
                <p className="text-sm text-muted-foreground">Generate secure API keys for your applications</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Generate New API Key</label>
                <Button onClick={generateApiKey} className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Generate API Key
                </Button>
              </div>

              {generatedKey && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium block">Your API Key</label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedKey}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Store this key securely. You won't be able to see it again.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">OAuth Providers</h2>
                <p className="text-sm text-muted-foreground">Configure OAuth authentication providers</p>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                { name: "GitHub", icon: "🐙", connected: true },
                { name: "Google", icon: "🔍", connected: false },
                { name: "GitLab", icon: "🦊", connected: false },
              ].map((provider, index) => (
                <motion.div
                  key={provider.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <span className="font-medium">{provider.name}</span>
                    </div>
                    <Button variant={provider.connected ? "outline" : "default"}>
                      {provider.connected ? "Connected" : "Connect"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Security Settings</h2>
                <p className="text-sm text-muted-foreground">Configure security options for your account</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">IP Whitelist</p>
                  <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">Set session expiration time</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
