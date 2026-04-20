import { motion, HTMLMotionProps } from "motion/react"
import { Input } from "./input"
import { forwardRef } from "react"

interface PremiumInputProps extends Omit<React.ComponentProps<typeof Input>, "ref"> {
  glow?: boolean
}

export const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ className, glow = false, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Input
          ref={ref}
          className={`
            transition-all duration-300
            ${glow ? "focus:shadow-lg focus:shadow-primary/20" : ""}
            ${className || ""}
          `}
          {...props}
        />
      </motion.div>
    )
  }
)

PremiumInput.displayName = "PremiumInput"
