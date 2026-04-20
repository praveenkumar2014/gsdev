import * as React from "react"
import { cn } from "../../lib/utils"
import logo from "../../assets/logo.png"

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string
  variant?: "default" | "black" | "white"
}

export function Logo({ className, variant = "default", ...props }: LogoProps) {
  // Apply color filters based on variant
  const variantClass = variant === "black"
    ? "brightness-0 contrast-100"
    : variant === "white"
      ? "brightness-0 invert"
      : ""

  return (
    <img
      src={logo}
      alt="GSDEV Aftext logo"
      className={cn("w-full h-full", variantClass, className)}
      {...props}
    />
  )
}
