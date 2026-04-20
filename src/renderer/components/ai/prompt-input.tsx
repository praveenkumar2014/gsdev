import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Wand2, Copy, Check, RotateCcw, Lightbulb, ChevronDown, ChevronUp } from "lucide-react"

interface PromptInputProps {
  onGenerate: (prompt: string) => void
  placeholder?: string
  suggestions?: string[]
  showSuggestions?: boolean
  maxLength?: number
  disabled?: boolean
}

export function PromptInput({
  onGenerate,
  placeholder = "Describe what you want to build...",
  suggestions = [
    "Create a React component for a user profile card",
    "Generate a Python function to sort a list",
    "Write a SQL query to find duplicate records",
    "Create a CSS animation for a loading spinner",
  ],
  showSuggestions = true,
  maxLength = 2000,
  disabled = false,
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [prompt])

  const handleGenerate = () => {
    if (prompt.trim() && !disabled) {
      onGenerate(prompt.trim())
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setPrompt("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Input Card */}
      <Card className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Wand2 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">AI Prompt Generator</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Describe what you want to build and let AI generate it for you
              </p>
            </div>
          </div>

          {/* Text Input */}
          <Textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className="min-h-[120px] max-h-[300px] resize-none border-0 bg-gray-50 dark:bg-gray-800 text-base focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 mb-4"
            rows={3}
          />

          {/* Character Count */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-500">
                {prompt.length} / {maxLength} characters
              </span>
            </div>
            <div className="flex items-center gap-2">
              {prompt.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-8"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || disabled}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium"
          >
            <Wand2 className="h-5 w-5 mr-2" />
            Generate
          </Button>
        </div>

        {/* Suggestions Toggle */}
        {showSuggestions && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Suggestions</span>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Try these prompt ideas:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-blue-500 hover:text-white transition-colors"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </Card>
    </div>
  )
}
