import { useState } from "react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Check, X, Settings } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

interface Connection {
  id: string
  name: string
  type: "github" | "gitlab" | "linear" | "slack" | "jira" | "notion"
  status: "connected" | "disconnected" | "error"
  lastSync?: string
}

export function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([
    { id: "1", name: "GitHub", type: "github", status: "connected", lastSync: "2 min ago" },
    { id: "2", name: "Linear", type: "linear", status: "connected", lastSync: "5 min ago" },
    { id: "3", name: "Slack", type: "slack", status: "disconnected" },
  ])

  const toggleConnection = (id: string) => {
    setConnections(prev =>
      prev.map(conn =>
        conn.id === id
          ? { ...conn, status: conn.status === "connected" ? "disconnected" : "connected" as any }
          : conn
      )
    )
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Connections
        </h1>
        <p className="text-muted-foreground">Manage your external service integrations</p>
      </motion.div>

      <div className="grid gap-6">
        {connections.map((connection, index) => (
          <motion.div
            key={connection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard>
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    connection.status === "connected" ? "bg-green-500/10" : "bg-gray-500/10"
                  )}>
                    {connection.status === "connected" ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : (
                      <X className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{connection.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {connection.status === "connected" ? `Last sync: ${connection.lastSync}` : "Not connected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => toggleConnection(connection.id)}
                    variant={connection.status === "connected" ? "destructive" : "default"}
                  >
                    {connection.status === "connected" ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: connections.length * 0.1 }}
        >
          <GlassCard className="border-dashed border-2">
            <Button variant="ghost" className="w-full h-24 flex-col gap-2">
              <Plus className="w-6 h-6" />
              <span>Add New Connection</span>
            </Button>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
