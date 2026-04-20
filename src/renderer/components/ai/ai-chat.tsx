import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User, Copy, Check, ThumbsUp, ThumbsDown, MoreVertical, Sparkles, Code2, FileText, Zap } from "lucide-react"

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: Date
  metadata?: {
    model?: string
    tokens?: number
    thinking?: string
    sources?: Array<{ title: string; url: string }>
  }
}

interface AiChatProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isProcessing?: boolean
  onStop?: () => void
  showThinking?: boolean
  showSources?: boolean
  showActions?: boolean
  className?: string
}

export function AiChat({
  messages,
  onSendMessage,
  isProcessing = false,
  onStop,
  showThinking = true,
  showSources = true,
  showActions = true,
  className = "",
}: AiChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [likedMessageIds, setLikedMessageIds] = useState<Set<string>>(new Set())
  const [dislikedMessageIds, setDislikedMessageIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleCopy = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content)
    setCopiedMessageId(messageId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  const handleLike = (messageId: string) => {
    const newLiked = new Set(likedMessageIds)
    const newDisliked = new Set(dislikedMessageIds)
    if (newLiked.has(messageId)) {
      newLiked.delete(messageId)
    } else {
      newLiked.add(messageId)
      newDisliked.delete(messageId)
    }
    setLikedMessageIds(newLiked)
    setDislikedMessageIds(newDisliked)
  }

  const handleDislike = (messageId: string) => {
    const newDisliked = new Set(dislikedMessageIds)
    const newLiked = new Set(likedMessageIds)
    if (newDisliked.has(messageId)) {
      newDisliked.delete(messageId)
    } else {
      newDisliked.add(messageId)
      newLiked.delete(messageId)
    }
    setDislikedMessageIds(newDisliked)
    setLikedMessageIds(newLiked)
  }

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-800 px-1 rounded">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-6 py-6">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <Avatar className={`h-10 w-10 flex-shrink-0 ${message.role === "user" ? "bg-blue-500" : "bg-purple-500"}`}>
                  {message.role === "user" ? (
                    <>
                      <AvatarImage src="/user-avatar.png" />
                      <AvatarFallback>
                        <User className="h-5 w-5 text-white" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/bot-avatar.png" />
                      <AvatarFallback>
                        <Bot className="h-5 w-5 text-white" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>

                {/* Message Content */}
                <div className={`flex-1 ${message.role === "user" ? "flex flex-col items-end" : ""}`}>
                  <Card
                    className={`max-w-[80%] ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="p-4">
                      {/* Thinking */}
                      {showThinking && message.metadata?.thinking && (
                        <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                              Thinking
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{message.metadata.thinking}</p>
                        </div>
                      )}

                      {/* Content */}
                      <div
                        className={`prose prose-sm ${
                          message.role === "user" ? "prose-invert" : "dark:prose-invert"
                        }`}
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                      />

                      {/* Sources */}
                      {showSources && message.metadata?.sources && message.metadata.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-3 w-3 text-gray-500" />
                            <span className="text-xs font-semibold text-gray-500">Sources</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {message.metadata.sources.map((source, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {source.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      {message.metadata?.model && (
                        <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
                          <Zap className="h-3 w-3" />
                          <span>{message.metadata.model}</span>
                          {message.metadata.tokens && <span>• {message.metadata.tokens} tokens</span>}
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Actions */}
                  {showActions && message.role === "assistant" && (
                    <div className="flex items-center gap-1 mt-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopy(message.content, message.id)}
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${likedMessageIds.has(message.id) ? "text-green-500" : ""}`}
                        onClick={() => handleLike(message.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${dislikedMessageIds.has(message.id) ? "text-red-500" : ""}`}
                        onClick={() => handleDislike(message.id)}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Processing Indicator */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <Avatar className="h-10 w-10 bg-purple-500">
                  <AvatarFallback>
                    <Bot className="h-5 w-5 text-white" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="p-4 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                          className="w-2 h-2 rounded-full bg-purple-500"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Stop Button */}
      {isProcessing && onStop && (
        <div className="px-4 pb-4">
          <Button onClick={onStop} variant="destructive" className="w-full max-w-4xl mx-auto">
            Stop Generation
          </Button>
        </div>
      )}
    </div>
  )
}
