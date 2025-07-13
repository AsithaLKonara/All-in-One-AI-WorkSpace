"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: string
  model?: string
}

interface ChatInterfaceProps {
  model: any
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function ChatInterface({ model, messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${model.color}`} />
            <h3 className="font-semibold text-sm">Chat with {model.name}</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {messages.length} messages
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm mb-2">Start a conversation with {model.name}</p>
              <p className="text-xs text-gray-400">
                This AI specializes in: {model.capabilities.slice(0, 3).join(", ")}
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className={`w-8 h-8 rounded-full ${model.color} flex items-center justify-center flex-shrink-0`}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900 border border-gray-200"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</div>
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                        onClick={() => handleCopy(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-70 hover:opacity-100">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-70 hover:opacity-100">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className={`w-8 h-8 rounded-full ${model.color} flex items-center justify-center flex-shrink-0`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${model.name} anything...`}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <div className="flex flex-wrap gap-1 mt-2">
          {model.capabilities.slice(0, 4).map((capability: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs cursor-pointer hover:bg-gray-200">
              {capability}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
