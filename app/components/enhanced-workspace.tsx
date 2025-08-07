"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Send, 
  Bot, 
  User, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Loader2, 
  Play, 
  Square, 
  Save, 
  Plus, 
  X, 
  Terminal, 
  Eye, 
  Code2, 
  Sparkles,
  Lightbulb,
  Zap,
  MessageSquare,
  Brain,
  Wand2,
  Bug,
  Settings,
  Paperclip,
  Mic,
  RotateCcw
} from "lucide-react"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: string
  model?: string
}

interface FileTab {
  id: string
  name: string
  content: string
  language: string
  isModified: boolean
}

interface EnhancedWorkspaceProps {
  role: any
  model: any
  user: any
  onSendMessage: (message: string) => void
  messages: Message[]
  isLoading: boolean
}

export function EnhancedWorkspace({ role, model, user, onSendMessage, messages, isLoading }: EnhancedWorkspaceProps) {
  const [files, setFiles] = useState<FileTab[]>([
    {
      id: "1",
      name: "app.tsx",
      content: `import React from 'react'

function App() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Hello, Asvia!</h1>
      <p className="text-muted-foreground">
        Start coding with ${role.name} powered by ${model.name}
      </p>
    </div>
  )
}

export default App`,
      language: "typescript",
      isModified: false,
    },
  ])

  const [activeFileId, setActiveFileId] = useState("1")
  const [isRunning, setIsRunning] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    "🚀 Welcome to Asvia AI Workspace",
    `🤖 Active Role: ${role.name}`,
    `🧠 AI Model: ${model.name}`,
    "✨ Ready to code and chat with AI!",
    "",
    "💡 AI Features:",
    "• Chat with AI for general assistance",
    "• Use AI buttons for code-specific help",
    "• Generate, fix, and optimize code",
    "• Get explanations and tests",
  ])
  const [previewContent, setPreviewContent] = useState("")
  const [input, setInput] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const [workspaceMode, setWorkspaceMode] = useState<"chat" | "code">("chat")

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const activeFile = files.find((f) => f.id === activeFileId) || files[0]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleFileContentChange = (content: string) => {
    setFiles((prev) => prev.map((file) => (file.id === activeFileId ? { ...file, content, isModified: true } : file)))
  }

  const handleRunCode = () => {
    setIsRunning(true)
    setConsoleOutput((prev) => [...prev, `▶️ Running ${activeFile.name}...`])

    setTimeout(() => {
      setConsoleOutput((prev) => [...prev, "✅ Code executed successfully!"])
      setPreviewContent(activeFile.content)
      setIsRunning(false)
    }, 1000)
  }

  const handleSaveFile = () => {
    setFiles((prev) => prev.map((file) => (file.id === activeFileId ? { ...file, isModified: false } : file)))
    setConsoleOutput((prev) => [...prev, `💾 Saved ${activeFile.name}`])
  }

  const handleNewFile = () => {
    const newFile: FileTab = {
      id: Date.now().toString(),
      name: "untitled.tsx",
      content: "// New file\n",
      language: "typescript",
      isModified: false,
    }
    setFiles((prev) => [...prev, newFile])
    setActiveFileId(newFile.id)
  }

  const handleCloseFile = (fileId: string) => {
    if (files.length === 1) return

    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    if (activeFileId === fileId) {
      setActiveFileId(files[0].id === fileId ? files[1].id : files[0].id)
    }
  }

  const handleClearConsole = () => {
    setConsoleOutput([])
  }

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

  // AI Assistant Functions
  const handleAIAssist = () => {
    const prompt = `I'm working on this ${activeFile.language} code in file ${activeFile.name}:\n\n${activeFile.content}\n\nCan you help me improve it, add features, or provide suggestions?`
    onSendMessage(prompt)
    setConsoleOutput((prev) => [...prev, `🤖 AI Assistant: Analyzing your code...`])
  }

  const handleAIGenerate = () => {
    const prompt = `Generate a complete, functional ${activeFile.language} file for ${activeFile.name}. Make it well-structured, documented, and ready to use.`
    onSendMessage(prompt)
    setConsoleOutput((prev) => [...prev, `✨ AI Generator: Creating new code...`])
  }

  const handleAIFix = () => {
    const prompt = `Please review and fix any issues in this ${activeFile.language} code:\n\n${activeFile.content}\n\nIdentify bugs, errors, and provide corrected code.`
    onSendMessage(prompt)
    setConsoleOutput((prev) => [...prev, `🔧 AI Debugger: Analyzing for issues...`])
  }

  const handleAIOptimize = () => {
    const prompt = `Please optimize this ${activeFile.language} code for better performance, readability, and best practices:\n\n${activeFile.content}`
    onSendMessage(prompt)
    setConsoleOutput((prev) => [...prev, `⚡ AI Optimizer: Improving code...`])
  }

  const handleAIExplain = () => {
    const prompt = `Please explain this ${activeFile.language} code step by step:\n\n${activeFile.content}`
    onSendMessage(prompt)
    setConsoleOutput((prev) => [...prev, `📚 AI Teacher: Explaining code...`])
  }

  const handleAITest = () => {
    const prompt = `Generate unit tests for this ${activeFile.language} code:\n\n${activeFile.content}`
    onSendMessage(prompt)
    setConsoleOutput((prev) => [...prev, `🧪 AI Tester: Creating tests...`])
  }

  const getLanguage = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "js":
        return "javascript"
      case "ts":
        return "typescript"
      case "jsx":
      case "tsx":
        return "typescript"
      case "css":
        return "css"
      case "html":
        return "html"
      case "json":
        return "json"
      default:
        return "text"
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Enhanced Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-muted/30">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className={`${model.color} text-white`}>{role.icon}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{role.name}</h2>
              <p className="text-xs text-muted-foreground">Powered by {model.name}</p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center space-x-2 border-l border-border pl-4">
            <Button
              size="sm"
              variant={workspaceMode === "chat" ? "default" : "outline"}
              onClick={() => setWorkspaceMode("chat")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button
              size="sm"
              variant={workspaceMode === "code" ? "default" : "outline"}
              onClick={() => setWorkspaceMode("code")}
            >
              <Code2 className="h-4 w-4 mr-2" />
              Code
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <div className={`w-2 h-2 ${model.color} rounded-full`}></div>
            <span>Online</span>
          </Badge>
        </div>
      </div>

      {workspaceMode === "chat" ? (
        // Chat Mode
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm mb-2">Start a conversation with {model.name}</p>
                  <p className="text-xs text-gray-400">
                    This AI specializes in: {model.capabilities?.slice(0, 3).join(", ") || "AI assistance"}
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
                      <span className="text-sm text-gray-600">AI is thinking...</span>
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
          </div>
        </div>
      ) : (
        // Code Mode
        <div className="flex-1 flex">
          {/* File Explorer */}
          <div className="w-64 border-r border-border bg-muted/20">
            <div className="p-3 border-b border-border">
              <h3 className="text-sm font-semibold flex items-center">
                <Code2 className="h-4 w-4 mr-2" />
                Files
              </h3>
            </div>
            <ScrollArea className="h-full">
              <div className="p-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-accent ${
                      activeFileId === file.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setActiveFileId(file.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <Code2 className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      {file.isModified && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                    </div>
                    {files.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCloseFile(file.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col">
            {/* Code Toolbar */}
            <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-muted/30">
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={handleRunCode} disabled={isRunning}>
                  {isRunning ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isRunning ? "Stop" : "Run"}
                </Button>
                <Button size="sm" variant="outline" onClick={handleSaveFile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleNewFile}>
                  <Plus className="h-4 w-4 mr-2" />
                  New File
                </Button>
                
                {/* AI Assistant Buttons */}
                <div className="border-l border-border pl-2 ml-2 flex items-center space-x-1">
                  <Button size="sm" variant="outline" onClick={handleAIAssist} className="text-blue-600 hover:bg-blue-50">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Assist
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAIGenerate} className="text-green-600 hover:bg-green-50">
                    <Wand2 className="h-4 w-4 mr-1" />
                    Generate
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAIFix} className="text-orange-600 hover:bg-orange-50">
                    <Bug className="h-4 w-4 mr-1" />
                    Fix
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAIOptimize} className="text-purple-600 hover:bg-purple-50">
                    <Zap className="h-4 w-4 mr-1" />
                    Optimize
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAIExplain} className="text-indigo-600 hover:bg-indigo-50">
                    <Brain className="h-4 w-4 mr-1" />
                    Explain
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleAITest} className="text-red-600 hover:bg-red-50">
                    <Settings className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                </div>
              </div>
            </div>

            {/* File Tabs */}
            <div className="h-10 border-b border-border flex items-center bg-muted/10">
              <div className="flex">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center space-x-2 px-4 py-2 border-r border-border cursor-pointer ${
                      activeFileId === file.id ? "bg-background" : "hover:bg-accent"
                    }`}
                    onClick={() => setActiveFileId(file.id)}
                  >
                    <span className="text-sm">{file.name}</span>
                    {file.isModified && <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                    {files.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-4 w-4 ml-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCloseFile(file.id)
                        }}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Editor and Panels */}
            <div className="flex-1 flex">
              {/* Code Editor */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4">
                  <textarea
                    ref={editorRef}
                    value={activeFile.content}
                    onChange={(e) => handleFileContentChange(e.target.value)}
                    className="w-full h-full resize-none bg-transparent border-none outline-none font-mono text-sm"
                    placeholder="Start coding with AI assistance... Press Ctrl+Enter for AI help"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Right Panel */}
              <div className="w-1/2 border-l border-border">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chat" className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>AI Chat</span>
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </TabsTrigger>
                    <TabsTrigger value="console" className="flex items-center space-x-2">
                      <Terminal className="h-4 w-4" />
                      <span>Console</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="chat" className="flex-1 m-0">
                    <div className="h-full flex flex-col bg-white">
                      <div className="p-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${model.color}`} />
                            <h3 className="font-semibold text-sm">AI Assistant</h3>
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
                              <p className="text-sm mb-2">Ask AI to help with your code</p>
                              <p className="text-xs text-gray-400">
                                Try: "Help me improve this code", "Generate a function", "Fix this bug"
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
                                  <span className="text-sm text-gray-600">AI is thinking...</span>
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
                            placeholder="Ask AI to help with your code..."
                            disabled={isLoading}
                            className="flex-1"
                          />
                          <Button type="submit" disabled={!input.trim() || isLoading}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="flex-1 m-0">
                    <div className="h-full bg-white border rounded-lg m-4 p-4 overflow-auto">
                      {previewContent ? (
                        <div className="prose max-w-none">
                          <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                            <code>{previewContent}</code>
                          </pre>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <div className="text-center">
                            <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Run your code to see the preview</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="console" className="flex-1 m-0">
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between p-2 border-b border-border">
                        <span className="text-sm font-medium">Console Output</span>
                        <Button size="sm" variant="outline" onClick={handleClearConsole}>
                          <X className="h-3 w-3 mr-1" />
                          Clear
                        </Button>
                      </div>
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-1 font-mono text-sm">
                          {consoleOutput.map((line, index) => (
                            <div key={index} className="text-muted-foreground">
                              <span className="text-primary mr-2">$</span>
                              {line}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 