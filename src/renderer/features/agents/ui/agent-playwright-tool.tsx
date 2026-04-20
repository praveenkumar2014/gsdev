"use client"

import { Globe } from "lucide-react"
import { GlobeIcon } from "../../../components/ui/icons"
import { ToolMeta, getToolStatus } from "./agent-tool-registry"

export const PlaywrightToolMeta: ToolMeta = {
  icon: GlobeIcon,
  title: (part) => {
    const isPending =
      part.state !== "output-available" && part.state !== "output-error"
    const isInputStreaming = part.state === "input-streaming"
    if (isInputStreaming) return "Preparing browser"
    if (isPending) return "Running Playwright"

    const action = part.input?.action || "action"
    return `Playwright: ${action}`
  },
  subtitle: (part) => {
    if (part.state === "input-streaming") return ""
    const url = part.input?.url || ""
    return url.length > 40 ? url.slice(0, 37) + "..." : url
  },
  variant: "simple",
}

export function AgentPlaywrightTool({ part, projectPath }: { part: any; projectPath?: string }) {
  const { isPending, isError, isSuccess } = getToolStatus(part)

  const action = part.input?.action || "action"
  const url = part.input?.url || ""
  const output = part.output || {}

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium">Playwright: {action}</span>
      </div>

      {url && (
        <div className="text-xs text-muted-foreground font-mono">
          {url}
        </div>
      )}

      {isPending && (
        <div className="text-xs text-muted-foreground animate-pulse">
          Executing browser automation...
        </div>
      )}

      {isSuccess && output.screenshot && (
        <div className="mt-2">
          <img
            src={`data:image/png;base64,${output.screenshot}`}
            alt="Screenshot"
            className="max-w-full h-auto rounded border"
          />
        </div>
      )}

      {isError && output.error && (
        <div className="text-xs text-red-500 mt-1">
          {output.error}
        </div>
      )}
    </div>
  )
}
