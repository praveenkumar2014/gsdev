/**
 * Build capabilities for generating websites, mobile apps, posters, blogs, and images
 * These are skill definitions that can be used by agents to build various content types
 */

export type BuildCapability =
  | "website"
  | "mobile-app"
  | "poster"
  | "blog"
  | "image"
  | "presentation"
  | "video"
  | "document"

export interface BuildCapabilityConfig {
  id: BuildCapability
  name: string
  description: string
  supportedFormats: string[]
  requiresAI: boolean
  tools: string[]
}

export const BUILD_CAPABILITIES: BuildCapabilityConfig[] = [
  {
    id: "website",
    name: "Website Builder",
    description: "Generate responsive websites with HTML, CSS, and JavaScript frameworks",
    supportedFormats: ["html", "react", "vue", "nextjs", "svelte"],
    requiresAI: true,
    tools: ["code-editor", "preview-server", "deployment"],
  },
  {
    id: "mobile-app",
    name: "Mobile App Builder",
    description: "Build mobile applications for iOS and Android",
    supportedFormats: ["react-native", "flutter", "swift", "kotlin"],
    requiresAI: true,
    tools: ["code-editor", "simulator", "build-tools"],
  },
  {
    id: "poster",
    name: "Poster Generator",
    description: "Create visually appealing posters and graphics",
    supportedFormats: ["png", "jpg", "svg", "pdf"],
    requiresAI: true,
    tools: ["canvas-editor", "image-generation", "templates"],
  },
  {
    id: "blog",
    name: "Blog Generator",
    description: "Generate blog posts with SEO optimization",
    supportedFormats: ["markdown", "html", "mdx"],
    requiresAI: true,
    tools: ["text-editor", "seo-analyzer", "content-planner"],
  },
  {
    id: "image",
    name: "Image Generator",
    description: "Generate images using AI models (DALL-E, Midjourney, Stable Diffusion)",
    supportedFormats: ["png", "jpg", "webp"],
    requiresAI: true,
    tools: ["image-generation-api", "image-editor", "upscaler"],
  },
  {
    id: "presentation",
    name: "Presentation Builder",
    description: "Create professional presentations",
    supportedFormats: ["pptx", "pdf", "key"],
    requiresAI: true,
    tools: ["slide-editor", "template-library", "export-tools"],
  },
  {
    id: "video",
    name: "Video Generator",
    description: "Generate video content with AI",
    supportedFormats: ["mp4", "webm", "mov"],
    requiresAI: true,
    tools: ["video-generation", "editor", "export-tools"],
  },
  {
    id: "document",
    name: "Document Generator",
    description: "Generate documents, reports, and papers",
    supportedFormats: ["pdf", "docx", "latex"],
    requiresAI: true,
    tools: ["document-editor", "formatter", "export-tools"],
  },
]

/**
 * Get build capability by ID
 */
export function getBuildCapability(id: BuildCapability): BuildCapabilityConfig | undefined {
  return BUILD_CAPABILITIES.find((cap) => cap.id === id)
}

/**
 * Get all supported formats for a capability
 */
export function getSupportedFormats(id: BuildCapability): string[] {
  const capability = getBuildCapability(id)
  return capability?.supportedFormats || []
}

/**
 * Check if a capability requires AI
 */
export function requiresAI(id: BuildCapability): boolean {
  const capability = getBuildCapability(id)
  return capability?.requiresAI || false
}
