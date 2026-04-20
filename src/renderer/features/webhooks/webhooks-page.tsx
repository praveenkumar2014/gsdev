import { useState } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus, Copy, Trash2, Play, Pause } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  status: "active" | "paused"
  lastTriggered?: string
}

export function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: "1",
      name: "Deploy Notification",
      url: "https://api.example.com/webhook/deploy",
      events: ["deployment.success", "deployment.failed"],
      status: "active",
      lastTriggered: "10 min ago"
    },
    {
      id: "2",
      name: "Error Alert",
      url: "https://api.example.com/webhook/errors",
      events: ["error.occurred"],
      status: "paused"
    }
  ])

  const toggleWebhook = (id: string) => {
    setWebhooks(prev =>
      prev.map(webhook =>
        webhook.id === id
          ? { ...webhook, status: webhook.status === "active" ? "paused" : "active" }
          : webhook
      )
    )
  }

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== id))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Webhooks
        </h1>
        <p className="text-muted-foreground">Configure webhook endpoints for real-time notifications</p>
      </motion.div>

      <div className="grid gap-6">
        {webhooks.map((webhook, index) => (
          <motion.div
            key={webhook.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{webhook.name}</h3>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        webhook.status === "active" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                      )}>
                        {webhook.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">{webhook.url}</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(webhook.url)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleWebhook(webhook.id)}
                    >
                      {webhook.status === "active" ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteWebhook(webhook.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Events</p>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map(event => (
                      <span key={event} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {webhook.lastTriggered && (
                  <p className="text-xs text-muted-foreground">Last triggered: {webhook.lastTriggered}</p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: webhooks.length * 0.1 }}
        >
          <GlassCard className="border-dashed border-2">
            <Button variant="ghost" className="w-full h-24 flex-col gap-2">
              <Plus className="w-6 h-6" />
              <span>Create Webhook</span>
            </Button>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
