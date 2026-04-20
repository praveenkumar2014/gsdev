import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
  className?: string
  blur?: "sm" | "md" | "lg" | "xl"
  border?: boolean
}

export function GlassCard({ 
  children, 
  className, 
  blur = "md",
  border = true,
  ...props 
}: GlassCardProps) {
  const blurMap = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        relative
        bg-background/50
        ${blurMap[blur]}
        ${border ? "border border-border/50" : ""}
        rounded-2xl
        shadow-xl
        ${className}
      `}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent dark:from-black/5" />
      {children}
    </motion.div>
  )
}
