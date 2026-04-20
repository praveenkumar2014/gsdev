"use client"

import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { ChevronDown, Globe, Smartphone, Image as ImageIcon, FileText, Presentation, Video, Code } from "lucide-react"
import { cn } from "../../../lib/utils"
import type { BuildCapability } from "../lib/build-capabilities"

const CAPABILITY_ICONS: Record<BuildCapability, React.ElementType> = {
  website: Globe,
  "mobile-app": Smartphone,
  poster: ImageIcon,
  blog: FileText,
  image: ImageIcon,
  presentation: Presentation,
  video: Video,
  document: FileText,
}

const CAPABILITY_LABELS: Record<BuildCapability, string> = {
  website: "Website Builder",
  "mobile-app": "Mobile App Builder",
  poster: "Poster Generator",
  blog: "Blog Generator",
  image: "Image Generator",
  presentation: "Presentation Builder",
  video: "Video Generator",
  document: "Document Generator",
}

interface BuildCapabilitySelectorProps {
  selected: BuildCapability | null
  onSelect: (capability: BuildCapability) => void
  className?: string
}

export function BuildCapabilitySelector({
  selected,
  onSelect,
  className,
}: BuildCapabilitySelectorProps) {
  const Icon = selected ? CAPABILITY_ICONS[selected] : Code

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-1.5", className)}
        >
          <Icon className="h-4 w-4" />
          <span>{selected ? CAPABILITY_LABELS[selected] : "Select Capability"}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {(Object.keys(CAPABILITY_LABELS) as BuildCapability[]).map((capability) => {
          const CapabilityIcon = CAPABILITY_ICONS[capability]
          return (
            <DropdownMenuItem
              key={capability}
              onClick={() => onSelect(capability)}
              className="gap-2"
            >
              <CapabilityIcon className="h-4 w-4" />
              <span>{CAPABILITY_LABELS[capability]}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
