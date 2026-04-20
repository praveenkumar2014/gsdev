"use client"

import { memo } from "react"
import { cn } from "../../../lib/utils"

export interface AgentMessageMetadata {
  model?: string
  sessionId?: string
  totalCostUsd?: number
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
  finalTextId?: string
  durationMs?: number
  resultSubtype?: string
}

interface AgentUsageChartProps {
  metadata?: AgentMessageMetadata
  isStreaming?: boolean
  isMobile?: boolean
}

export const AgentUsageChart = memo(function AgentUsageChart({
  metadata,
  isStreaming = false,
  isMobile = false,
}: AgentUsageChartProps) {
  if (!metadata || isStreaming) return null

  const {
    inputTokens = 0,
    outputTokens = 0,
    totalTokens = 0,
  } = metadata

  const hasUsage = inputTokens > 0 || outputTokens > 0
  if (!hasUsage) return null

  const displayTokens = totalTokens || inputTokens + outputTokens
  const inputPercent = displayTokens > 0 ? (inputTokens / displayTokens) * 100 : 0
  const outputPercent = displayTokens > 0 ? (outputTokens / displayTokens) * 100 : 0

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-16 h-4 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${inputPercent}%` }}
        />
        <div
          className="absolute left-0 top-0 h-full bg-purple-500 transition-all duration-300"
          style={{ width: `${outputPercent}%`, marginLeft: `${inputPercent}%` }}
        />
      </div>
      <div className="flex gap-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          In: {inputTokens.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full" />
          Out: {outputTokens.toLocaleString()}
        </span>
      </div>
    </div>
  )
})

AgentUsageChart.displayName = "AgentUsageChart"
