import { motion, HTMLMotionProps } from "motion/react"
import { Button, ButtonProps } from "./button"
import { forwardRef } from "react"

interface PremiumButtonProps extends ButtonProps {
  glow?: boolean
  shimmer?: boolean
}

export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, glow = false, shimmer = false, children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          ref={ref}
          className={`
            relative overflow-hidden
            ${glow ? "shadow-lg shadow-primary/20 hover:shadow-xl shadow-primary/30" : ""}
            ${shimmer ? "" : ""}
            ${className}
          `}
          {...props}
        >
          {shimmer && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          )}
          {children}
        </Button>
      </motion.div>
    )
  }
)

PremiumButton.displayName = "PremiumButton"
