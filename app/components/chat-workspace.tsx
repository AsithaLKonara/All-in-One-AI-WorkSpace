"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, Mic, Square, RotateCcw, ThumbsUp, ThumbsDown, Copy, Bot, User } from "lucide-react"

interface ChatWorkspaceProps {
  role: any
  model: any
  user: any
}

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  reactions?: string[]
  attachments?: string[]
}

export function ChatWorkspace({ role, model, user }: ChatWorkspaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello! I'm ${role.name}, powered by ${model.name}. How can I help you today?`,
      sender: "ai",
      timestamp: new Date(),
      reactions: [],
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
      reactions: [],
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue, role, model),
        sender: "ai",
        timestamp: new Date(),
        reactions: [],
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (input: string, role: any, model: any) => {
    const responses = [
      `As ${role.name}, I can help you with ${role.description.toLowerCase()}. What specific task would you like to work on?`,
      `Using ${model.name}, I can assist with: ${model.capabilities.slice(0, 3).join(", ")}. What would you like to explore?`,
      `Great question! Let me help you with that using my ${role.workspace} expertise.`,
      `I understand you're asking about "${input}". Here's how I can help with my ${model.name} capabilities...`,
      `That's an interesting challenge! As your ${role.name}, I recommend we approach this step by step.`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReaction = (messageId: string, reaction: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: msg.reactions?.includes(reaction)
                ? msg.reactions.filter((r) => r !== reaction)
                : [...(msg.reactions || []), reaction],
            }
          : msg,
      ),
    )
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        content: `Chat cleared. I'm ${role.name}, ready to help you again!`,
        sender: "ai",
        timestamp: new Date(),
        reactions: [],
      },
    ])
  }

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Chat Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-muted/30">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className={`${model.color} text-white`}>{role.icon}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{role.name}</h3>
            <p className="text-xs text-muted-foreground">Powered by {model.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <div className={`w-2 h-2 ${model.color} rounded-full`}></div>
            <span>Online</span>
          </Badge>
          <Button size="sm" variant="outline" onClick={handleClearChat}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {message.sender === "user" ? (
                    <>
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className={`${model.color} text-white`}>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1">
                  <Card className={`${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <CardContent className="p-3">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="text-xs opacity-75">
                              📎 {attachment}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex items-center justify-between mt-1 px-1">
                    <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</span>

                    <div className="flex items-center space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleCopyMessage(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>

                      {message.sender === "ai" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => handleReaction(message.id, "👍")}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => handleReaction(message.id, "👎")}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex space-x-1 mt-1">
                      {message.reactions.map((reaction, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {reaction}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={`${model.color} text-white`}>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="bg-muted">
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${role.name}...`}
                className="pr-20"
                disabled={isTyping}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => {
                    /* File attachment logic */
                  }}
                >
                  <Paperclip className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-6 w-6 ${isRecording ? "text-red-500" : ""}`}
                  onClick={handleVoiceRecording}
                >
                  {isRecording ? <Square className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{inputValue.length}/2000</span>
          </div>
        </div>
      </div>
    </div>
  )
}
