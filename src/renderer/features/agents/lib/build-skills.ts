/**
 * Build skills for website, mobile app, poster, blog, and image generation
 * These skills can be used by agents to build various content types
 */

import type { BuildCapability } from "./build-capabilities"

export interface BuildSkill {
  id: string
  name: string
  description: string
  capability: BuildCapability
  prompt: string
  tools: string[]
}

export const BUILD_SKILLS: BuildSkill[] = [
  {
    id: "website-builder",
    name: "Website Builder",
    description: "Build responsive websites from natural language descriptions",
    capability: "website",
    prompt: `You are an expert web developer. When asked to build a website:
1. Analyze the requirements and choose the best framework (HTML, React, Vue, Next.js, or Svelte)
2. Create a complete, responsive website with modern design
3. Include proper HTML structure, CSS styling, and JavaScript functionality
4. Ensure mobile responsiveness and accessibility
5. Add appropriate meta tags and SEO optimization
6. Provide the complete code in a single file or organized structure`,
    tools: ["code-editor", "preview-server", "deployment"],
  },
  {
    id: "mobile-app-builder",
    name: "Mobile App Builder",
    description: "Build mobile applications for iOS and Android",
    capability: "mobile-app",
    prompt: `You are an expert mobile app developer. When asked to build a mobile app:
1. Analyze the requirements and choose the best framework (React Native, Flutter, Swift, or Kotlin)
2. Create a complete mobile application with modern UI/UX
3. Implement all requested features and functionality
4. Ensure proper navigation, state management, and data handling
5. Add proper error handling and user feedback
6. Provide complete, runnable code with setup instructions`,
    tools: ["code-editor", "simulator", "build-tools"],
  },
  {
    id: "poster-generator",
    name: "Poster Generator",
    description: "Create visually appealing posters and graphics",
    capability: "poster",
    prompt: `You are an expert graphic designer. When asked to create a poster:
1. Analyze the purpose and target audience
2. Design a visually appealing layout with proper hierarchy
3. Choose appropriate colors, fonts, and imagery
4. Include all necessary information in a clear, readable format
5. Ensure the design is professional and eye-catching
6. Provide the design in the requested format (PNG, JPG, SVG, or PDF)`,
    tools: ["canvas-editor", "image-generation", "templates"],
  },
  {
    id: "blog-generator",
    name: "Blog Generator",
    description: "Generate SEO-optimized blog posts",
    capability: "blog",
    prompt: `You are an expert content writer and SEO specialist. When asked to write a blog post:
1. Analyze the topic and target audience
2. Create an engaging title and compelling introduction
3. Structure the content with clear headings and subheadings
4. Include relevant examples, statistics, and insights
5. Optimize for SEO with appropriate keywords and meta descriptions
6. Add a strong conclusion with call-to-action
7. Provide the content in the requested format (Markdown, HTML, or MDX)`,
    tools: ["text-editor", "seo-analyzer", "content-planner"],
  },
  {
    id: "image-generator",
    name: "Image Generator",
    description: "Generate images using AI models",
    capability: "image",
    prompt: `You are an expert image generation specialist. When asked to generate an image:
1. Analyze the requirements and create a detailed prompt
2. Choose the best AI model (DALL-E 3, Midjourney, or Stable Diffusion)
3. Optimize the prompt for the best results
4. Specify the desired style, mood, and composition
5. Request the appropriate size and format
6. Provide the generated image or instructions for generation`,
    tools: ["image-generation-api", "image-editor", "upscaler"],
  },
  {
    id: "presentation-builder",
    name: "Presentation Builder",
    description: "Create professional presentations",
    capability: "presentation",
    prompt: `You are an expert presentation designer. When asked to create a presentation:
1. Analyze the topic and purpose
2. Create a clear structure with introduction, main content, and conclusion
3. Design visually appealing slides with proper balance
4. Use appropriate charts, diagrams, and visuals
5. Ensure consistent branding and professional appearance
6. Add speaker notes if requested
7. Provide the presentation in the requested format (PPTX, PDF, or Key)`,
    tools: ["slide-editor", "template-library", "export-tools"],
  },
  {
    id: "video-generator",
    name: "Video Generator",
    description: "Generate video content with AI",
    capability: "video",
    prompt: `You are an expert video creator. When asked to generate video content:
1. Analyze the requirements and target audience
2. Create a script and storyboard
3. Generate or source appropriate visuals and audio
4. Ensure proper pacing and engagement
5. Add captions and accessibility features
6. Provide the video in the requested format (MP4, WebM, or MOV)`,
    tools: ["video-generation", "editor", "export-tools"],
  },
  {
    id: "document-generator",
    name: "Document Generator",
    description: "Generate documents, reports, and papers",
    capability: "document",
    prompt: `You are an expert document creator. When asked to generate a document:
1. Analyze the document type and requirements
2. Create a professional structure with proper formatting
3. Include all necessary sections and content
4. Ensure proper citations and references if needed
5. Use professional language and tone
6. Provide the document in the requested format (PDF, DOCX, or LaTeX)`,
    tools: ["document-editor", "formatter", "export-tools"],
  },
]

/**
 * Get build skill by ID
 */
export function getBuildSkill(id: string): BuildSkill | undefined {
  return BUILD_SKILLS.find((skill) => skill.id === id)
}

/**
 * Get skills by capability
 */
export function getSkillsByCapability(capability: BuildCapability): BuildSkill[] {
  return BUILD_SKILLS.filter((skill) => skill.capability === capability)
}

/**
 * Get all build skill IDs
 */
export function getAllBuildSkillIds(): string[] {
  return BUILD_SKILLS.map((skill) => skill.id)
}
