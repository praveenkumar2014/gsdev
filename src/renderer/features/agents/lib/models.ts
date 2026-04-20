export const CLAUDE_MODELS = [
  { id: "opus", name: "Opus", version: "4.6" },
  { id: "sonnet", name: "Sonnet", version: "4.6" },
  { id: "haiku", name: "Haiku", version: "4.5" },
]

export type CodexThinkingLevel = "low" | "medium" | "high" | "xhigh"

export const CODEX_MODELS = [
  {
    id: "gpt-5.3-codex",
    name: "Codex 5.3",
    thinkings: ["low", "medium", "high", "xhigh"] as CodexThinkingLevel[],
  },
  {
    id: "gpt-5.2-codex",
    name: "Codex 5.2",
    thinkings: ["low", "medium", "high", "xhigh"] as CodexThinkingLevel[],
  },
  {
    id: "gpt-5.1-codex-max",
    name: "Codex 5.1 Max",
    thinkings: ["low", "medium", "high", "xhigh"] as CodexThinkingLevel[],
  },
  {
    id: "gpt-5.1-codex-mini",
    name: "Codex 5.1 Mini",
    thinkings: ["medium", "high"] as CodexThinkingLevel[],
  },
]

// Additional LLM integrations
export const GEMINI_MODELS = [
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", version: "latest" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", version: "latest" },
  { id: "gemini-2.0-pro", name: "Gemini 2.0 Pro", version: "latest" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", version: "latest" },
]

export const OPENROUTER_MODELS = [
  { id: "anthropic/claude-3.7-sonnet", name: "Claude 3.7 Sonnet", provider: "OpenRouter" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "OpenRouter" },
  { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5", provider: "OpenRouter" },
  { id: "meta-llama/llama-3.3-70b", name: "Llama 3.3 70B", provider: "OpenRouter" },
]

export const NANO_MODELS = [
  { id: "nano-1b", name: "Nano 1B", version: "latest" },
  { id: "nano-3b", name: "Nano 3B", version: "latest" },
]

export const BANANA_MODELS = [
  { id: "banana-small", name: "Banana Small", version: "latest" },
  { id: "banana-medium", name: "Banana Medium", version: "latest" },
  { id: "banana-large", name: "Banana Large", version: "latest" },
]

export const OPENCODE_MODELS = [
  { id: "opencode-codex", name: "OpenCode Codex", version: "latest" },
  { id: "opencode-gpt4", name: "OpenCode GPT-4", version: "latest" },
]

// All models grouped by provider for easy access
export const ALL_MODELS = {
  claude: CLAUDE_MODELS,
  codex: CODEX_MODELS,
  gemini: GEMINI_MODELS,
  openrouter: OPENROUTER_MODELS,
  nano: NANO_MODELS,
  banana: BANANA_MODELS,
  opencode: OPENCODE_MODELS,
}

export type ModelProvider = keyof typeof ALL_MODELS

export function formatCodexThinkingLabel(thinking: CodexThinkingLevel): string {
  if (thinking === "xhigh") return "Extra High"
  return thinking.charAt(0).toUpperCase() + thinking.slice(1)
}
