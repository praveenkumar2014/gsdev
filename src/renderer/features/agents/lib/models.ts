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

// New open source providers
export const META_MODELS = [
  { id: "meta-llama-3.1-405b-instruct", name: "LLaMA 3.1 405B", provider: "Meta", isOpenSource: true, context: 128000 },
  { id: "meta-llama-3.1-70b-instruct", name: "LLaMA 3.1 70B", provider: "Meta", isOpenSource: true, context: 128000 },
  { id: "meta-llama-3.1-8b-instruct", name: "LLaMA 3.1 8B", provider: "Meta", isOpenSource: true, context: 128000 },
  { id: "meta-llama-3-70b-instruct", name: "LLaMA 3 70B", provider: "Meta", isOpenSource: true, context: 8192 },
  { id: "meta-llama-3-8b-instruct", name: "LLaMA 3 8B", provider: "Meta", isOpenSource: true, context: 8192 },
]

export const GROQ_MODELS = [
  { id: "llama-3.3-70b-versatile", name: "LLaMA 3.3 70B Versatile", provider: "Groq", isOpenSource: true, context: 128000 },
  { id: "llama-3.1-70b-versatile", name: "LLaMA 3.1 70B Versatile", provider: "Groq", isOpenSource: true, context: 128000 },
  { id: "llama-3.1-8b-instant", name: "LLaMA 3.1 8B Instant", provider: "Groq", isOpenSource: true, context: 131072 },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", provider: "Groq", isOpenSource: true, context: 32768 },
  { id: "gemma2-9b-it", name: "Gemma 2 9B", provider: "Groq", isOpenSource: true, context: 8192 },
]

export const TOGETHER_MODELS = [
  { id: "meta-llama/Llama-3.3-70B-Instruct-Turbo", name: "LLaMA 3.3 70B Turbo", provider: "Together", isOpenSource: true, context: 128000 },
  { id: "meta-llama/Llama-3.1-70B-Instruct-Turbo", name: "LLaMA 3.1 70B Turbo", provider: "Together", isOpenSource: true, context: 128000 },
  { id: "meta-llama/Llama-3.1-8B-Instruct-Turbo", name: "LLaMA 3.1 8B Turbo", provider: "Together", isOpenSource: true, context: 128000 },
  { id: "mistralai/Mixtral-8x7B-Instruct-v0.1", name: "Mixtral 8x7B", provider: "Together", isOpenSource: true, context: 32768 },
  { id: "Qwen/Qwen2.5-72B-Instruct-Turbo", name: "Qwen 2.5 72B", provider: "Together", isOpenSource: true, context: 131072 },
  { id: "deepseek-ai/DeepSeek-V3", name: "DeepSeek V3", provider: "Together", isOpenSource: true, context: 64000 },
]

export const HUGGINGFACE_MODELS = [
  { id: "meta-llama/Llama-3.3-70B-Instruct", name: "LLaMA 3.3 70B", provider: "Hugging Face", isOpenSource: true, context: 128000 },
  { id: "meta-llama/Llama-3.1-70B-Instruct", name: "LLaMA 3.1 70B", provider: "Hugging Face", isOpenSource: true, context: 128000 },
  { id: "mistralai/Mistral-7B-Instruct-v0.3", name: "Mistral 7B", provider: "Hugging Face", isOpenSource: true, context: 32768 },
  { id: "Qwen/Qwen2.5-72B-Instruct", name: "Qwen 2.5 72B", provider: "Hugging Face", isOpenSource: true, context: 131072 },
  { id: "google/gemma-2-27b-it", name: "Gemma 2 27B", provider: "Hugging Face", isOpenSource: true, context: 8192 },
]

// Ollama local models
export const OLLAMA_MODELS = [
  { id: "llama3.3", name: "LLaMA 3.3 70B", provider: "Ollama", isOpenSource: true, isLocal: true },
  { id: "llama3.1", name: "LLaMA 3.1 70B", provider: "Ollama", isOpenSource: true, isLocal: true },
  { id: "llama3.1:8b", name: "LLaMA 3.1 8B", provider: "Ollama", isOpenSource: true, isLocal: true },
  { id: "mistral", name: "Mistral 7B", provider: "Ollama", isOpenSource: true, isLocal: true },
  { id: "qwen2.5", name: "Qwen 2.5 72B", provider: "Ollama", isOpenSource: true, isLocal: true },
  { id: "deepseek-coder", name: "DeepSeek Coder", provider: "Ollama", isOpenSource: true, isLocal: true },
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
  meta: META_MODELS,
  groq: GROQ_MODELS,
  together: TOGETHER_MODELS,
  huggingface: HUGGINGFACE_MODELS,
  ollama: OLLAMA_MODELS,
}

// Open source models (prioritized)
export const OPENSOURCE_MODELS = [
  ...META_MODELS,
  ...GROQ_MODELS,
  ...TOGETHER_MODELS,
  ...HUGGINGFACE_MODELS,
  ...OLLAMA_MODELS,
]

export type ModelProvider = keyof typeof ALL_MODELS

export function formatCodexThinkingLabel(thinking: CodexThinkingLevel): string {
  if (thinking === "xhigh") return "Extra High"
  return thinking.charAt(0).toUpperCase() + thinking.slice(1)
}
