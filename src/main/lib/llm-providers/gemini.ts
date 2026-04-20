/**
 * Gemini API client
 * Provides integration with Google's Gemini AI models
 */

import { z } from "zod"

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"

export interface GeminiMessage {
  role: "user" | "model"
  parts: Array<{ text: string }>
}

export interface GeminiRequest {
  contents: GeminiMessage[]
  generationConfig?: {
    temperature?: number
    topK?: number
    topP?: number
    maxOutputTokens?: number
  }
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>
      role: string
    }
    finishReason: string
    index: number
  }>
  usageMetadata: {
    promptTokenCount: number
    candidatesTokenCount: number
    totalTokenCount: number
  }
}

/**
 * Call Gemini API
 */
export async function callGemini(
  apiKey: string,
  model: string,
  messages: GeminiMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`

  const request: GeminiRequest = {
    contents: messages,
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 8192,
    },
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${error}`)
  }

  const data: GeminiResponse = await response.json()

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("Gemini API returned no candidates")
  }

  const candidate = data.candidates[0]
  const text = candidate.content.parts[0]?.text || ""

  if (candidate.finishReason !== "STOP") {
    console.warn(`Gemini generation finished with reason: ${candidate.finishReason}`)
  }

  return text
}

/**
 * Convert chat messages to Gemini format
 */
export function toGeminiMessages(messages: Array<{ role: string; content: string }>): GeminiMessage[] {
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }))
}
