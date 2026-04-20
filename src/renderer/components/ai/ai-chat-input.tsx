import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Mic, Sparkles, X, StopCircle, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AiChatInputProps {
  onSend: (message: string) => void
  onStop?: () => void
  isProcessing?: boolean
  placeholder?: string
  disabled?: boolean
  showAttach?: boolean
  showVoice?: boolean
  maxLength?: number
}

export function AiChatInput({
  onSend,
  onStop,
  isProcessing = false,
  placeholder = "Ask anything...",
  disabled = false,
  showAttach = true,
  showVoice = true,
  maxLength = 4000,
}: AiChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording)
    // TODO: Implement voice recording logic
  }

  const handleAttach = () => {
    // TODO: Implement file attachment logic
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "relative group w-full",
        "bg-background/80 backdrop-blur-xl",
        "border border-border/50",
        "rounded-2xl shadow-2xl",
        "transition-all duration-300",
        isFocused && "shadow-primary/20 border-primary/50 ring-2 ring-primary/10"
      )}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ opacity: isFocused ? 0.5 : 0 }}
      />

      <div className="relative p-4">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={cn(
            "min-h-[60px] max-h-[200px] resize-none pr-32 pl-4 pt-4 pb-4",
            "bg-transparent border-0 focus:ring-0",
            "text-base leading-relaxed",
            "placeholder:text-muted-foreground/60"
          )}
        />

        {/* Action buttons */}
        <div className="absolute right-2 bottom-2 flex items-center gap-1">
          {showAttach && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "h-9 w-9 rounded-xl",
                  "hover:bg-primary/10 hover:text-primary",
                  "transition-all duration-300",
                  disabled && "opacity-50"
                )}
                disabled={disabled}
                onClick={handleAttach}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {showVoice && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "h-9 w-9 rounded-xl",
                  "hover:bg-primary/10 hover:text-primary",
                  "transition-all duration-300",
                  isRecording && "bg-red-500/10 text-red-500",
                  disabled && "opacity-50"
                )}
                disabled={disabled}
                onClick={handleVoiceToggle}
              >
                <AnimatePresence mode="wait">
                  {isRecording ? (
                    <motion.div
                      key="recording"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <StopCircle className="h-4 w-4 animate-pulse" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mic"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Mic className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          )}

          <div className="w-px h-6 bg-border/50 mx-1" />

          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="stop"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  size="icon"
                  variant="destructive"
                  className={cn(
                    "h-9 w-9 rounded-xl",
                    "shadow-lg shadow-red-500/20",
                    "hover:shadow-xl shadow-red-500/30"
                  )}
                  onClick={onStop}
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="send"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Button
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-xl",
                    "bg-gradient-to-br from-primary to-primary/80",
                    "shadow-lg shadow-primary/30",
                    "hover:shadow-xl shadow-primary/40",
                    "transition-all duration-300",
                    !message.trim() && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={!message.trim() || disabled}
                  onClick={handleSend}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Character count */}
        <motion.div
          className="absolute left-4 bottom-2 text-xs text-muted-foreground/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: message.length > 0 ? 1 : 0 }}
        >
          {message.length}/{maxLength}
        </motion.div>
      </div>

      {/* AI sparkles decoration */}
      <motion.div
        className="absolute -top-2 -right-2 pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Wand2 className="h-5 w-5 text-primary/40" />
      </motion.div>

      {/* Recording Indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
          >
            Recording...
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
